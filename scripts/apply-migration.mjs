import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return {};
  }
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const POOLER_REGIONS = [
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-north-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "ap-southeast-1",
  "ap-northeast-1",
  "ap-south-1",
];

function poolerUrl(ref, encodedPass, region) {
  return `postgresql://postgres.${ref}:${encodedPass}@aws-0-${region}.pooler.supabase.com:6543/postgres?sslmode=require`;
}

function probeDbUrl(dbUrl) {
  const r = spawnSync(
    "npx",
    ["supabase", "db", "query", "select 1", "--db-url", dbUrl],
    { cwd: root, stdio: "pipe", shell: true, env: { ...process.env } }
  );
  return r.status === 0;
}

const env = loadEnv(join(root, ".env.local"));
let dbUrl = env.DATABASE_URL?.trim();

if (!dbUrl && env.SUPABASE_DB_PASSWORD) {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "";
  const m = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
  if (!m) {
    console.error(
      "Нужен NEXT_PUBLIC_SUPABASE_URL вида https://<ref>.supabase.co или полный DATABASE_URL."
    );
    process.exit(1);
  }
  const ref = m[1];
  const pass = encodeURIComponent(env.SUPABASE_DB_PASSWORD);
  const useDirect = env.SUPABASE_DB_DIRECT === "1" || env.SUPABASE_DB_DIRECT === "true";
  if (useDirect) {
    dbUrl = `postgresql://postgres:${pass}@db.${ref}.supabase.co:5432/postgres?sslmode=require`;
    if (!probeDbUrl(dbUrl)) {
      console.error(
        "Прямое подключение к db не удалось (часто IPv6). Уберите SUPABASE_DB_DIRECT или задайте DATABASE_URL из pooler."
      );
      process.exit(1);
    }
  } else {
    const fixedRegion =
      env.SUPABASE_POOLER_REGION || process.env.SUPABASE_POOLER_REGION;
    if (fixedRegion) {
      dbUrl = poolerUrl(ref, pass, fixedRegion);
      if (!probeDbUrl(dbUrl)) {
        console.error(`Подключение pooler (${fixedRegion}) не удалось.`);
        process.exit(1);
      }
    } else {
      for (const region of POOLER_REGIONS) {
        const candidate = poolerUrl(ref, pass, region);
        if (probeDbUrl(candidate)) {
          dbUrl = candidate;
          console.error(`Подключение pooler: aws-0-${region}.pooler.supabase.com`);
          break;
        }
      }
      if (!dbUrl) {
        console.error(
          [
            "Не удалось подключиться через pooler ни в одном регионе.",
            "Добавьте в .env.local строку из Dashboard → Database → Connection string (URI), режим Transaction:",
            "  DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres",
            "или укажите регион: SUPABASE_POOLER_REGION=eu-west-1",
          ].join("\n")
        );
        process.exit(1);
      }
    }
  }
}

if (!dbUrl) {
  console.error(
    [
      "Не задано подключение к Postgres.",
      "Добавьте в .env.local одно из:",
      "  DATABASE_URL=postgresql://postgres:ПАРОЛЬ@db.<ref>.supabase.co:5432/postgres",
      "  или SUPABASE_DB_PASSWORD=<пароль из Supabase → Settings → Database>",
      "",
      "Публичный ключ (anon / publishable) не даёт права выполнять произвольный SQL.",
      "Аккаунт в `supabase login` должен совпадать с владельцем проекта, иначе link → Forbidden.",
    ].join("\n")
  );
  process.exit(1);
}

const migrationsDir = join(root, "supabase", "migrations");
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("В supabase/migrations нет .sql файлов.");
  process.exit(1);
}

console.error(`Применяю ${files.length} миграций…`);

for (const file of files) {
  const migration = join(migrationsDir, file);
  console.error(`→ ${file}`);
  const r = spawnSync(
    "npx",
    ["supabase", "db", "query", "-f", migration, "--db-url", dbUrl],
    { cwd: root, stdio: "inherit", shell: true, env: { ...process.env } }
  );
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

console.error("Готово.");
