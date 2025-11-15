import "server-only";
import { getSupabaseServerClient } from "@/app/(frontend)/server/supabase/client";
import {
  toNullIfEmpty,
  normalizeEmail,
  generateTicketId,
} from "@/lib/utils";
import type { CreateStudentInput, CreateStudentResult } from "@/types/students";

// Student IDs are now hard-coded to "0000" for all newly registered students.
// Previous sequential ID generation logic has been removed per new requirements.

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

  // Determine next 4-digit numeric studentid for new registrations (exclude SBF- or SB-prefixed IDs).
  let nextStudentId = "0001";
  try {
    const { data: existingIds } = await supabase
      .from("students")
      .select("studentid")
      .not("studentid", "ilike", "SBF%")
      .not("studentid", "ilike", "SB%")
      .order("studentid", { ascending: false })
      .limit(1000);

    if (Array.isArray(existingIds)) {
      const latestNumeric = existingIds
        .map((r: any) => r?.studentid as string | null)
        .filter((id): id is string => !!id && /^\d{4}$/.test(id))
        .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))[0];

      if (latestNumeric) {
        const next = parseInt(latestNumeric, 10) + 1;
        nextStudentId = String(next).padStart(4, "0");
      }
    }
  } catch {
    // Fallback to "0001" if lookup fails
  }

  // First insert attempt
  let { data, error } = await supabase
    .from("students")
    .insert({ ...payloadBase, studentid: nextStudentId })
    .select()
    .single();

  // Minimal retry on potential duplicate (e.g., concurrent registration)
  if (error && (error as any)?.code === "23505") {
    try {
      const { data: existingIds } = await supabase
        .from("students")
        .select("studentid")
        .not("studentid", "ilike", "SBF%")
        .not("studentid", "ilike", "SB%")
        .order("studentid", { ascending: false })
        .limit(1000);

      if (Array.isArray(existingIds)) {
        const latestNumeric = existingIds
          .map((r: any) => r?.studentid as string | null)
          .filter((id): id is string => !!id && /^\d{4}$/.test(id))
          .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))[0];

        if (latestNumeric) {
          const next = parseInt(latestNumeric, 10) + 1;
          nextStudentId = String(next).padStart(4, "0");
        } else {
          nextStudentId = "0001";
        }
      }
    } catch {
      nextStudentId = "0001";
    }

    const retry = await supabase
      .from("students")
      .insert({ ...payloadBase, studentid: nextStudentId })
      .select()
      .single();
    data = retry.data as any;
    error = retry.error as any;
  }

  if (error) {
    return { data: null, error: (error as any)?.message || "Failed to create student" };
  }

  return { data, error: null };
}

export type { CreateStudentInput, CreateStudentResult };