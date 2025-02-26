import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: user, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { data, error } = await supabase
    .from("salaries")
    .select("date, salary")
    .eq("user_id", user.user.id)
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: user, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { salaries } = await request.json();

  // Delete existing salaries
  await supabase.from("salaries").delete().eq("user_id", user.user.id);

  // Insert new salaries
  const { error } = await supabase
    .from("salaries")
    .insert(salaries.map((s: { date: string; salary: number }) => ({
      user_id: user.user.id,
      date: s.date,
      salary: s.salary,
    })));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Salaries saved" });
}