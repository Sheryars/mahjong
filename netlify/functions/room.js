// Room management function — create, read, update game rooms via Supabase
// Requires SUPABASE_URL and SUPABASE_ANON_KEY environment variables

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
};

function json(data, status=200) {
  return { statusCode: status, headers: { ...CORS, "Content-Type":"application/json" }, body: JSON.stringify(data) };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode:200, headers:CORS, body:"" };

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return json({ error:"Supabase not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to Netlify environment variables." }, 500);
  }

  const base = `${SUPABASE_URL}/rest/v1/rooms`;
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };

  try {
    // POST /api/room — create a new room
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const code = body.code || generateCode();
      const res = await fetch(`${base}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          code,
          game_state: body.game_state || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      });
      if (!res.ok) {
        const err = await res.text();
        return json({ error: `Supabase error: ${err}` }, 502);
      }
      const data = await res.json();
      return json({ room: data[0] || data });
    }

    // GET /api/room?code=XXXX — fetch room by code
    if (event.httpMethod === "GET") {
      const code = event.queryStringParameters?.code;
      if (!code) return json({ error: "code required" }, 400);
      const res = await fetch(`${base}?code=eq.${code.toUpperCase()}&limit=1`, { headers });
      if (!res.ok) return json({ error: "fetch failed" }, 502);
      const data = await res.json();
      if (!data.length) return json({ error: "room not found" }, 404);
      return json({ room: data[0] });
    }

    // PUT /api/room — update room game state
    if (event.httpMethod === "PUT") {
      const body = JSON.parse(event.body || "{}");
      const { code, game_state } = body;
      if (!code) return json({ error: "code required" }, 400);
      const res = await fetch(`${base}?code=eq.${code.toUpperCase()}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ game_state, updated_at: new Date().toISOString() })
      });
      if (!res.ok) return json({ error: "update failed" }, 502);
      return json({ ok: true });
    }

    return json({ error: "method not allowed" }, 405);

  } catch (err) {
    return json({ error: err.message }, 500);
  }
};

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
