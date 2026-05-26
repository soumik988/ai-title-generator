export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  try {

    const { topic, tool } = req.body;

    let prompt = "";

    // CAPTION
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

    // TITLE
    if (tool === "title") {
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

    // HASHTAG
    if (tool === "hashtag") {
      prompt = `
Generate 20 trending hashtags.

Topic: ${topic}

Rules:
- Only hashtags
- Single line
- No numbering
`;
    }

    // OPENROUTER API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },

        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",

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

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        result: "Failed to generate AI response",
      });
    }

    return res.status(200).json({
      result: data.choices[0].message.content,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      result: "Server Error",
    });
  }
}