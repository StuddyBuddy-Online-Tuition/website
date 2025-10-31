import { NextRequest, NextResponse } from "next/server";
import { createStudents } from "@/app/server/supabase/queries/student";
import type { CreateStudentInput } from "@/types/students";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
  }

  const body = await req.json();

  const payload: CreateStudentInput = {
    parentname: typeof body.parentname === "string" ? body.parentname : undefined,
    email: typeof body.email === "string" ? body.email : undefined,
    parentphone: typeof body.parentphone === "string" ? body.parentphone : undefined,
    full_name: typeof body.full_name === "string" ? body.full_name : undefined,
    icnumber: typeof body.ic_number === "string" ? body.ic_number : undefined,
    grade: typeof body.grade === "string" ? body.grade : undefined,
    studentphone: typeof body.studentphone === "string" ? body.studentphone : undefined,
    school: typeof body.school === "string" ? body.school : undefined,
    name: typeof body.name === "string" ? body.name : undefined,
    // Optional fields not present on the form are intentionally omitted
    // dlp left undefined; server will handle defaulting
  };

  const { data, error } = await createStudents(payload);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}


