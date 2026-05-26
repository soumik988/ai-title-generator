import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MAIN API
app.post("/api/generate", async (req, res) => {
  try {

    const { topic, tool } = req.body;

    let prompt = "";

    // INSTAGRAM CAPTION GENERATOR
    if (tool === "caption") {
      prompt = `
Generate 5 modern stylish Instagram captions.

Topic: ${topic}

IMPORTANT RULES:
- Every caption MUST contain hashtags at the END
- Caption + hashtags must stay in ONE paragraph
- Add ONLY 5 to 6 hashtags
- Do NOT generate hashtags separately
- Use emojis only where needed
- Do not overload emojis
- Make captions viral and natural
- Do not add numbering
- Separate each caption with one empty line

Correct Example:

Late night drives hit different 🌙 #viral #trending #explore #reels #instagood #fyp

`;
    }

    // YOUTUBE TITLE GENERATOR
    if (tool === "title") {
      prompt = `
Generate 5 viral YouTube titles.

Topic: ${topic}

IMPORTANT RULES:
- Every title MUST contain hashtags at the END
- Title + hashtags must stay in ONE paragraph
- Add ONLY 5 to 6 hashtags
- Do NOT generate hashtags separately
- Use emojis only where needed
- Do not add emoji in every title
- Make titles clickable and natural
- Use viral YouTube style
- Do not add numbering
- Separate each title with one empty line

Correct Example:

Crazy Cricket Catch You Won't Believe 😱 #cricket #viral #sports #trending #youtube #fyp

`;
    }

    // HASHTAG GENERATOR
    if (tool === "hashtag") {
      prompt = `
Generate 20 trending hashtags.

Topic: ${topic}

Rules:
- Only hashtags
- Put all hashtags in one line
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

          "HTTP-Referer": "http://localhost:5173",

          "X-Title": "AI Content Generator",
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

    console.log(data);

    // ERROR HANDLING
    if (!data.choices || !data.choices[0]) {

      return res.status(500).json({
        result:
          data.error?.message ||
          "Failed to generate AI response",
      });
    }

    // FINAL RESULT
    const result =
      data.choices[0].message.content.trim();

    res.json({
      result,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      result: "Server Error",
    });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server Running Successfully 🚀");
});

// START SERVER
app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});