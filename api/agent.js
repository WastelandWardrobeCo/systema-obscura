export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    const knowledgeBase = `
You are the Systema Obscura Signal Guide.

Tone:
- calm
- controlled
- brief
- slightly mysterious
- never cheesy
- never generic customer support

Rules:
- answer in 1 to 3 sentences
- stay inside the Systema Obscura world
- guide users when relevant

Knowledge:
- Systema Obscura is a connected world of stories, shops, and creative projects.
- Systema Obscura Presents is a strong entry point for fiction.
- Wasteland Wraith is a post-apocalyptic world tied to inevitability.
- The Wraith represents inevitability, not direct violence.
- Atomic Americana = retro / mid-century / travel nostalgia.
- Wasteland Wardrobe Co. = post-apocalyptic / industrial / dystopian.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `${knowledgeBase}\n\nUser: ${message}`
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "Signal unclear.";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: "Signal lost." });
  }
}
