import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  const connectionString = process.env.POSTGRES_URL || "";
  return NextResponse.json({ url: connectionString.split("@")[1] });
}
