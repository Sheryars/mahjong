// Netlify Function (v1 classic format) — secure proxy to Claude Vision API
// The ANTHROPIC_API_KEY is stored in Netlify environment variables, never exposed to browser

exports.handler = async function(event, context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: "Method not allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "API key not configured. Add ANTHROPIC_API_KEY to Netlify environment variables." })
    };
  }

  let image;
  try {
    const body = JSON.parse(event.body || "{}");
    image = body.image;
  } catch {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid request body" })
    };
  }

  if (!image) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "No image provided" })
    };
  }

  const systemPrompt = `You are an expert Taiwanese/Dubai-style Mahjong tile recognition AI.
Analyse the photo of a winning Mahjong hand and return ONLY a raw JSON object — no markdown, no explanation.

Return exactly this structure:
{
  "tiles_visible": true,
  "ai_notes": "brief description of what you see",
  "flower_count": 0,
  "suit_type": "pure|semi_pure|two_suit|two_suit_clean|all_five|mixed",
  "hand_type": "all_sheung|all_pong|special|mixed",
  "pong_dragon": 0,
  "pong_wind": 0,
  "open_gongs": 0,
  "concealed_gongs": 0,
  "concealed_pongs": 0,
  "good_eye": false,
  "dragon_run": "none|mix_exp|mix_con|pure_exp|pure_con",
  "step_up": "none|step|all_step|all_step_pure",
  "terminals": "none|no_term|no_term_no_hon|all_term_hon|all_term_pure",
  "special_hand": "none|nico|orphan13|orphan16|jade|ruby|diamond",
  "dragon_combo": "none|little|big",
  "wind_combo": "none|little3|big3|little4|big4",
  "confidence": "high|medium|low"
}

Dubai Mahjong rules:
- Sheung = 3 consecutive same-suit tiles (sequence)
- Pong = 3 identical tiles, Gong = 4 identical tiles
- Flowers = bonus tiles (red/blue garden 1-4)
- Dragons: Red, Green, White
- Winds: East, South, West, North
- Jade Hand: Green Dragon pong + all Bamboo tiles
- Ruby Hand: Red Dragon pong + all Character tiles
- Diamond Hand: White Dragon pong + all Circle tiles
- Nico Nico: 7 pairs + 1 pong (fully concealed)
- good_eye = true if the pair (eyes) are 2s, 5s, or 8s of any suit
- Set confidence "low" if photo is unclear`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/jpeg", data: image }
            },
            {
              type: "text",
              text: "Analyse this Mahjong hand photo and return the JSON object."
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return {
        statusCode: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Anthropic API error: ${response.status}` })
      };
    }

    const data = await response.json();
    const text = data.content?.find(b => b.type === "text")?.text || "{}";
    const clean = text.replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      result = {
        tiles_visible: true,
        ai_notes: "Tiles detected but could not parse full analysis. Answer questions manually.",
        flower_count: 0, suit_type: "mixed", hand_type: "mixed",
        pong_dragon: 0, pong_wind: 0, open_gongs: 0, concealed_gongs: 0,
        concealed_pongs: 0, good_eye: false, dragon_run: "none",
        step_up: "none", terminals: "none", special_hand: "none",
        dragon_combo: "none", wind_combo: "none", confidence: "low"
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(result)
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Internal server error" })
    };
  }
};
