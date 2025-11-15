"server-only";
import { getSupabaseServerClient } from "@/app/(frontend)/server/supabase/client";
import { Subject } from "@/types/subject";
import { DbSubject } from "@/types/db";

export async function getAllSubjects(): Promise<Subject[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("subjects")
      .select("code, name, standard, type, subject")
      .order("code", { ascending: true });
  
    if (error) throw error;
    const rows = (data as DbSubject[] | null) ?? [];
    return rows.map((r) => ({ ...r, standard: (r.standard ?? "").toLowerCase() }));
  }