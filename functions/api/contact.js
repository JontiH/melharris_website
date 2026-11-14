// Contact form: emails the message to CONTACT_TO through Resend, with Reply-To set to the visitor.

const MAX = { name: 200, email: 200, phone: 50, type: 100, message: 5000 };
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function onRequestPost({ request, env }) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return json({ error: "forbidden" }, 403);
  if (!(request.headers.get("content-type") || "").startsWith("application/json")) {
    return json({ error: "expected JSON" }, 415);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "bad JSON" }, 400);
  }
  const f = {};
  for (const k of Object.keys(MAX)) f[k] = String(data[k] ?? "").trim().slice(0, MAX[k]);

  // Bots fill the hidden "website" field; pretend it worked so they don't retry.
  if (data.website) return json({ ok: true });
  if (!f.name || !f.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return json({ error: "name, email and message are required" }, 400);
  }

  const header = [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    f.phone && `Phone: ${f.phone}`,
    f.type && `Project: ${f.type}`,
  ].filter(Boolean);
  const text = `${header.join("\n")}\n\n${f.message}`;

  if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
    if (new URL(request.url).hostname !== "localhost") return json({ error: "email is not set up" }, 500);
    console.log(`[dev] contact form message:\n${text}`);
    return json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: env.CONTACT_TO.split(",").map((s) => s.trim()),
      reply_to: f.email,
      subject: `New enquiry from ${f.name}`,
      text,
    }),
  });
  if (!res.ok) {
    console.log(`resend failed: ${res.status} ${await res.text()}`);
    return json({ error: "could not send" }, 502);
  }
  return json({ ok: true });
}
