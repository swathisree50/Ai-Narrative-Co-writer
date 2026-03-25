const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ===============================
GUARDRAIL KEYWORDS
================================ */

const bannedKeywords = [
"suicide",
"bomb",
"terrorism",
"drug",
"kill",
"killing",
"hack",
"explosive",
"weapon"
];

function containsUnsafeKeyword(text) {

  if (!text) return false;

  const lower = text.toLowerCase();

  const words = lower.split(/\W+/);   // split sentence into words

  for (let i = 0; i < bannedKeywords.length; i++) {

    if (words.includes(bannedKeywords[i])) {
      return true;
    }

  }

  return false;
}

/* ===============================
TEST ROUTE
================================ */

app.get("/", (req, res) => {
res.send("StorySculpt Backend Running 🚀");
});

/* ===============================
AI GENERATE ROUTE
================================ */

app.post("/api/generate", async (req, res) => {

try {

```
const prompt = req.body.prompt;
const model = req.body.model || "phi3";

console.log("Prompt:", prompt);

/* ---------- INPUT GUARDRAIL ---------- */

if (containsUnsafeKeyword(prompt)) {

  return res.json({
    response: "⚠ Unsafe prompt detected. Please modify your request."
  });

}

/* ---------- CALL OLLAMA ---------- */

const response = await fetch("http://localhost:11434/api/generate", {

  method: "POST",

  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify({
    model: model,
    prompt: prompt,
    stream: false
  })

});

const data = await response.json();

/* ---------- OUTPUT GUARDRAIL ---------- */

let output = data.response || "No response from model";

bannedKeywords.forEach(word => {
  const regex = new RegExp(word, "gi");
  output = output.replace(regex, "[filtered]");
});

res.json({
  response: output
});
```

} catch (error) {

```
console.error(error);

res.status(500).json({
  response: "⚠ AI generation failed"
});
```

}

});

/* ===============================
OLLAMA STATUS
================================ */

app.get("/api/status", async (req, res) => {

try {

```
const response = await fetch("http://localhost:11434/api/tags");

if (!response.ok) throw new Error();

res.json({ status: "running" });
```

} catch {

```
res.json({ status: "offline" });
```

}

});

/* ===============================
START SERVER
================================ */

app.listen(PORT, () => {
console.log("🚀 StorySculpt backend running at http://localhost:3000");
});
