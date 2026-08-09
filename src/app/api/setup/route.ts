import { NextResponse } from "next/server";
import { Client } from "pg";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase URL or service role key." }, { status: 500 });
    }

    const databaseUrl = process.env.POSTGRES_URL ?? process.env.SUPABASE_DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ error: "Missing POSTGRES_URL or SUPABASE_DATABASE_URL." }, { status: 500 });
    }

    const sqlFile = path.join(process.cwd(), "sql", "create_projects_table.sql");
    const sql = fs.readFileSync(sqlFile, "utf8");

    const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();
    await client.query(sql);
    await client.end();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? String(error) }, { status: 500 });
  }
}
