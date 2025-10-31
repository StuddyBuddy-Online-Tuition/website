import "server-only";
import { getSupabaseServerClient } from "@/app/server/supabase/client";
import {
  toNullIfEmpty,
  normalizeEmail,
  parseSequentialId,
  formatSequentialId,
  generateTicketId,
} from "@/lib/utils";
import type { CreateStudentInput, CreateStudentResult } from "@/types/students";

// types moved to @/types/students

async function getNextStudentId(): Promise<string> {
  const supabase = getSupabaseServerClient();

  // Fetch a window of existing IDs and compute the numeric max client-side.
  // This avoids lexical ordering pitfalls across varying digit widths.
  const { data, error } = await supabase
    .from("students")
    .select("studentid")
    .like("studentid", "SBF%")
    .limit(2000);

  if (error) {
    // Fall back to first ID if we cannot query existing rows.
    return formatSequentialId(1, "SBF", 4);
  }

  let maxNumeric = 0;
  for (const row of data || []) {
    const suffix = parseSequentialId(row.studentid as string, "SBF");
    if (suffix !== null && suffix > maxNumeric) maxNumeric = suffix;
  }

  return formatSequentialId(maxNumeric + 1, "SBF", 4);
}

export async function createStudents(input: CreateStudentInput): Promise<CreateStudentResult> {
  const supabase = getSupabaseServerClient();

  const normalizedFullName = toNullIfEmpty(input.full_name);
  const preferredName = toNullIfEmpty(input.name);
  const studentName = preferredName || normalizedFullName; // DB column `name` is NOT NULL

  if (!studentName) {
    return { data: null, error: "Student name is required" };
  }

  if (!normalizedFullName) {
    return { data: null, error: "Full name is required" };
  }

  const email = normalizeEmail(input.email);

  // DLP is NOT NULL in the schema; ensure a value is provided.
  // Default to "non-DLP" when not supplied by the form.
  const dlp = toNullIfEmpty(input.dlp) || "non-DLP";

  const payloadBase: Record<string, any> = {
    // required and present/derived
    name: studentName,
    full_name: normalizedFullName,
    parentname: toNullIfEmpty(input.parentname),
    parentphone: toNullIfEmpty(input.parentphone),
    email,
    grade: toNullIfEmpty(input.grade),
    // optional
    studentphone: toNullIfEmpty(input.studentphone),
    school: toNullIfEmpty(input.school),
    classinid: toNullIfEmpty(input.classinid),
    icnumber: toNullIfEmpty(input.icnumber),
    // registereddate defaults to today's date; modes only if provided
    status: "pending",
    dlp,
    ticketid: generateTicketId(),
  };

  // Default registereddate to today (YYYY-MM-DD), override if a valid date is provided
  let registeredDateStr = new Date().toISOString().slice(0, 10);
  if (input.registereddate) {
    const dt = input.registereddate instanceof Date ? input.registereddate : new Date(input.registereddate);
    if (!Number.isNaN(dt.getTime())) {
      registeredDateStr = dt.toISOString().slice(0, 10);
    }
  }
  payloadBase.registereddate = registeredDateStr;

  if (Array.isArray(input.modes)) {
    payloadBase.modes = input.modes;
  }

  // Only include keys with non-undefined values; allow nulls for optional fields.
  const buildInsertPayload = async () => {
    const studentid = await getNextStudentId();
    return { ...payloadBase, studentid };
  };

  // Retry on unique violation for `studentid`.
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const insertPayload = await buildInsertPayload();
    const { data, error } = await supabase
      .from("students")
      .insert(insertPayload)
      .select()
      .single();

    if (!error) {
      return { data, error: null };
    }

    // 23505 is Postgres unique_violation
    const code = (error as any)?.code;
    const isUniqueViolation = code === "23505" || /duplicate key/.test((error as any)?.message || "");
    if (!isUniqueViolation) {
      return { data: null, error: (error as any)?.message || "Failed to create student" };
    }

    if (attempt === maxAttempts) {
      return { data: null, error: "Failed to generate a unique student ID. Please retry." };
    }
  }

  return { data: null, error: "Failed to create student" };
}

export type { CreateStudentInput, CreateStudentResult };


