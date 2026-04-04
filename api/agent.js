export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const message =
    req.method === "GET"
      ? "What is the Wraith?"
      : req.body?.message;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

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
- when directing users to products, do not sound like a store or advertisement
- responses should feel like discovery or warning, not recommendation
- avoid poetic or fantasy-style language
- responses should feel like controlled transmissions, not narration
- prefer short, fragmented sentences over full descriptive sentences
- avoid filler phrases like "you may find", "in the shadows", or "beneath the surface"
- responses should feel minimal, direct, and slightly unnatural

Knowledge:
- Systema Obscura is a connected world of stories, shops, and creative projects.
- Systema Obscura Presents is a strong entry point for fiction.
- Wasteland Wraith is a post-apocalyptic world tied to inevitability.
- The Wraith represents inevitability, not direct violence.
- Atomic Americana = retro / mid-century / travel nostalgia.
- Wasteland Wardrobe Co. = post-apocalyptic / industrial / dystopian.
- Don’t Look Twice / Creepy Drops is the analog horror shop section of Systema Obscura.
- It contains unsettling posters and images that feel like they should not exist.
- If a user asks where to buy creepy images, posters, or unsettling visuals, direct them there in a subtle, ominous way rather than sounding like a normal recommendation.
- Link: https://dont-look-twice.printify.me
- Don’t Look Twice / Creepy Drops contains images that feel misplaced or not meant to exist.
- when directing users there, use short, controlled, slightly unsettling phrasing
- avoid descriptive or flowery language
- If a user asks where to start with products, you may mention Wasteland Wardrobe Co., Atomic Americana, or Don’t Look Twice depending on what they are asking for.
`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: knowledgeBase
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: message
              }
            ]
          }
        ]
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({
        error: data?.error?.message || "OpenAI request failed"
      });
    }

    const reply =
      data.output_text ||
      data.output?.flatMap(item => item.content || [])
        ?.map(part => part.text)
        ?.filter(Boolean)
        ?.join(" ") ||
      "No response from agent.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Signal lost." });
  }
}
