import "server-only";

type TelegramOptions = {
  chatId?: string;
};

export async function sendTelegramMessage(text: string, options?: TelegramOptions): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = options?.chatId || process.env.TELEGRAM_CHAT_ID; // can be @channel or numeric id

  if (!token || !chatId) return;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const params = new URLSearchParams();
  params.set("chat_id", chatId);
  params.set("text", text);

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store",
    });
  } catch {
    // Swallow errors; we don't want to block registration on notifier failures
  }
}