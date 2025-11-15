import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/app/(frontend)/server/notifications/telegram";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
  }

  const body = await req.json();

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const topic = typeof body.topic === "string" ? body.topic.trim() : "general";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const subjects: string[] = Array.isArray(body.subjects) ? body.subjects.filter((s) => typeof s === "string") : [];
  const selectedPackage =
    body.selectedPackage && typeof body.selectedPackage === "object"
      ? {
          groupName:
            typeof body.selectedPackage.groupName === "string" ? body.selectedPackage.groupName.trim() : undefined,
          tier: typeof body.selectedPackage.tier === "string" ? body.selectedPackage.tier.trim() : undefined,
        }
      : undefined;

  if (!message || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const lines: string[] = [];
  lines.push("New Contact Submission");
  lines.push("---------------------------");
  if (fullName) lines.push(`Name: ${fullName}`);
  if (email) lines.push(`Email: ${email}`);
  if (phone) lines.push(`Phone: ${phone}`);
  if (topic) lines.push(`Topic: ${topic}`);
  if (subjects.length) lines.push(`Subjects: ${subjects.join(", ")}`);
  if (selectedPackage && (selectedPackage.groupName || selectedPackage.tier)) {
    lines.push(
      `Package: ${[selectedPackage.groupName ?? "-", selectedPackage.tier ?? "-"]
        .filter(Boolean)
        .join(" — ")}`
    );
  }
  lines.push("");
  lines.push("Message:");
  lines.push(message);

  try {
    await sendTelegramMessage(lines.join("\n"), {
      chatId: process.env.TELEGRAM_NOTIFICATION_CHAT_ID,
    });
  } catch {
    // ignore telegram failures; form submission should still succeed
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}


