export default async function handler(req, res) {

  // ALLOW ONLY POST
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  try {

    const { topic, tool } = req.body;

    // VALIDATION
    if (!topic || !tool) {
      return res.status(400).json({
        result: "Topic and tool are required",
      });
    }

    let prompt = "";

    // INSTAGRAM CAPTIONS
    if (tool === "caption") {

      prompt = `
Generate 5 modern stylish Instagram captions.

Topic: ${topic}

Rules:
- Every caption MUST contain hashtags at the END
- Caption + hashtags must stay in ONE paragraph
- Add ONLY 5 to 6 hashtags
- Use emojis only where needed
- Make captions viral and natural
- Do not add numbering
- Separate each caption with one empty line
`;

    }

    // YOUTUBE TITLES
    else if (tool === "title") {

      prompt = `
Generate 5 viral YouTube titles.

Topic: ${topic}

Rules:
- Every title MUST contain hashtags at the END
- Title + hashtags must stay in ONE paragraph
- Add ONLY 5 to 6 hashtags
- Use emojis only where needed
- Make titles clickable and natural
- Do not add numbering
- Separate each title with one empty line
`;

    }

    // HASHTAGS
    else if (tool === "hashtag") {

      prompt = `
Generate 20 trending hashtags.

Topic: ${topic}

Rules:
- Only hashtags
- Single line
- No numbering
`;

    }

    // OPENROUTER API REQUEST
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "HTTP-Referer":
            "https://ai-title-generator-ww71.vercel.app",

          "X-Title": "AI Title Generator",
        },

        body: JSON.stringify({

          model: "openai/gpt-4o-mini",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.9,

          max_tokens: 700,

        }),
      }
    );

    // RESPONSE DATA
    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", data);

    // ERROR HANDLING
    if (!response.ok) {

      return res.status(500).json({
        result:
          data?.error?.message ||
          "Failed to generate AI response",
      });

    }

    // SUCCESS RESPONSE
    return res.status(200).json({
      result: data.choices[0].message.content,
    });

  } catch (error) {

    console.log("SERVER ERROR:", error);

    return res.status(500).json({
      result: "Server Error",
    });

  }
}