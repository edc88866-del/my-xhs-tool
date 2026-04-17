export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "你是一个小红书爆款内容分析专家"
          },
          {
            role: "user",
            content: `请分析以下小红书内容，并输出：
1. 内容评分（10分制）
2. 优点
3. 问题
4. 优化建议
5. 3个爆款标题
6. 关键词

内容如下：
${text}`
          }
        ]
      })
    });

    const data = await response.json();

    const result = data.choices?.[0]?.message?.content || "分析失败";

    res.status(200).json({ result });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
