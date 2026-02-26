export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ answer: "No question provided." });
    }

    // Simple topic filter
    const allowedTopics = ["ai", "fitness", "training", "workout", "health", "avatar"];
    const isRelated = allowedTopics.some(topic =>
      question.toLowerCase().includes(topic)
    );

    if (!isRelated) {
      return res.status(200).json({
        answer: "Please ask a question related to AI and fitness."
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI fitness assistant. Only answer questions related to AI, fitness, training, health, or avatar technology. If unrelated, politely refuse."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return res.status(200).json({
      answer: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({
      answer: "Server error. Please try again."
    });
  }
}
