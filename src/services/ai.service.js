
// const Groq = require("groq-sdk");
// const groq = new Groq({ apikey: process.env.GROQ_API_KEY });

// //function for getting response
// async function getResponse(prompt) {
  
//   const chatcompletion = await groq.chat.completions.create({
//     model: "deepseek-r1-distill-llama-70b",
//     messages: [
//       {
//         role: "user",
//         content: prompt,
//       },
//       {
//         role: "system",
//         content: `
//                 Act as an expert in programming languages who has read through many programming advice online for Python, Java, C, and C ++.
//         Can you please help suggest improvements for the given Python code, mentioning the existing code line by line with proper indentation?  
//         Can you also convert the improved code version to Java, C, and C++? 
//         Can you also give time and space complexities for the improved code version? 
//         While responding, can you use this format? 
//         Suggestions
//         Improved code in Python
//         Improved code in Java, c, and C++. 
//         Time and space complexities 
//         Personalized learning links
//                 `,
//       },
//     ],
//   });

//   return chatcompletion.choices[0].message.content;
// }

// module.exports = getResponse;


const Groq = require("groq-sdk");
const groq = new Groq({ apikey: process.env.GROQ_API_KEY });

/**
 * Utility: Detect language from code snippet (basic heuristic)
 */
function detectLanguage(code) {
  if (/^\s*(function|const|let|var|=>)/m.test(code)) return "JavaScript";
  if (/^\s*(def|import|print|self)/m.test(code)) return "Python";
  if (/^\s*#include\s+<.*>|int\s+main\s*\(\)/m.test(code)) return "C++";
  if (/^\s*public\s+class|System\.out\.println/m.test(code)) return "Java";
  if (/^\s*using\s+System;|Console\.WriteLine/m.test(code)) return "C#";
  if (/<[a-z][\s\S]*>/i.test(code) && /<\/[a-z]+>/i.test(code)) return "HTML";
  if (/^\s*SELECT|INSERT|CREATE|UPDATE/i.test(code)) return "SQL";
  return "General Programming";
}

/**
 * Build a dynamic system prompt based on language
 */
function buildPrompt(code) {
  const language = detectLanguage(code);

  return `
Act as an expert in ${language} who specializes in writing clean, efficient, and secure code.

Please review the following ${language} code and respond in this format:

1. 🔍 Suggestions with line references
2. ✅ Optimized code in ${language}
3. ⏱️ Time and Space Complexity
4. 📌 Best Practices Used
5. 📚 Helpful Learning Resources

Code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`
`;
}

/**
 * Function to get AI response
 */
async function getResponse(code) {
  const prompt = buildPrompt(code);

  const chatcompletion = await groq.chat.completions.create({
    model: "deepseek-r1-distill-llama-70b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return chatcompletion.choices[0].message.content;
}

module.exports = getResponse;
