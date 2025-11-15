import { NextRequest, NextResponse } from "next/server";
import { createStudents } from "@/app/(frontend)/server/supabase/queries/student";
import type { CreateStudentInput } from "@/types/students";
import { sendTelegramMessage } from "@/app/(frontend)/server/notifications/telegram";

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

  // Fire-and-forget Telegram notification
  try {
    const subjects: string[] = Array.isArray(body.subjects) ? body.subjects : [];
    const pkgName = typeof body.package_name === "string" ? body.package_name : null;
    const pkgId = typeof body.package_id === "string" ? body.package_id : null;

    const lines: string[] = [];
    lines.push("New Registration Received");
    lines.push("---------------------------");
    if (data?.studentid) lines.push(`Student ID: ${data.studentid}`);
    if (data?.ticketid) lines.push(`Ticket: ${data.ticketid}`);
    if (data?.full_name) lines.push(`Full Name: ${data.full_name}`);
    if (data?.name) lines.push(`Preferred Name: ${data.name}`);
    if (data?.grade) lines.push(`Grade: ${data.grade}`);
    if (data?.school) lines.push(`School: ${data.school}`);
    if (data?.studentphone) lines.push(`Student Phone: ${data.studentphone}`);
    if (data?.parentname) lines.push(`Parent: ${data.parentname}`);
    if (data?.parentphone) lines.push(`Parent Phone: ${data.parentphone}`);
    if (data?.email) lines.push(`Email: ${data.email}`);
    if (data?.status) lines.push(`Status: ${data.status}`);
    if (data?.registereddate) lines.push(`Registered: ${data.registereddate}`);
    if (data?.icnumber) lines.push(`IC: ${data.icnumber}`);
    if (Array.isArray(data?.modes) && data.modes.length) lines.push(`Modes: ${data.modes.join(", ")}`);
    if (subjects.length) lines.push(`Subjects: ${subjects.join(", ")}`);
    if (pkgName || pkgId) lines.push(`Package: ${pkgName ?? "-"}${pkgId ? ` (${pkgId})` : ""}`);

    await sendTelegramMessage(lines.join("\n"));
  } catch {}

  return NextResponse.json({ data }, { status: 201 });
}

