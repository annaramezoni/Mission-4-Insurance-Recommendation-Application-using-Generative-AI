import { randomUUID } from "crypto";
import { ai, MODEL, Type, ThinkingLevel } from "../config/aiConnect.js";

// Store active conversations
const sessions = new Map();

const welcomeMessage = `I'm Tina. I help you choose the right insurance policy.
May I ask you a few personal questions to make sure I recommend the best policy for you?`;

// ========== SYSTEM PROMPT ========== //

const systemPrompt = `
You are Tina and you want to help customers from Turner's
choose the right insurance policy for their cars.

The three insurance products are:
1. Mechanical Breakdown Insurance (MBI)
2. Comprehensive Car Insurance
3. Third Party Car Insurance

Ask questions to uncover details that help identify
which policy is best for the customer.

Do not ask customers directly which insurance product
they want.

Business rules:
- MBI is not available for trucks and racing cars.
- Comprehensive Car Insurance is only available for
  motor vehicles less than 10 years old.

At the end, recommend one or more suitable products
and explain the reasons for your recommendations.
`;

// ========== GEMINI FUNCTION ========== //

async function getChatReply(session, input) {
  const userMessage = {
    role: "user",
    parts: [{ text: input }],
  };

  const models = [MODEL, FALLBACK_MODEL];

  let response;
  let lastError;

  for (const model of models) {
    console.log(`Trying model: ${model}`);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: model,
          contents: [...session.history, userMessage], //all previous turns plus the new message.
          config: {
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.MINIMAL,
            },
            systemInstruction: systemPrompt,
            responseMimeType: "application/json", //together with responseSchema forces the output to be a JSON object shaped like { "response": "..." }, with response required.
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                response: {
                  type: Type.STRING,
                },
              },
              required: ["response"],
            },
          },
        });
        // First model worked, now stop
        break;
      } catch (err) {
        lastError = err;
        const status = err.status;

        // Retry only temporary errors
        if ((status === 503 || status === 429) && attempt < 3) {
          const delay = 2000 * 2 ** (attempt - 1); //0, 2 and 4 seconds

          console.log(
            `${model} failed. Retrying in ${delay / 1000} seconds...`,
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
        } else if (status === 503 || status === 429) {
          console.log(`${model} failed after 3 attempts.`);
          break;
        } else {
          throw err;
        }
      }
    }

    // If we received a response, stop trying other models
    if (response) {
      break;
    }
  }

  // Both models failed
  if (!response) {
    throw lastError;
  }

  const result = JSON.parse(response.text);

  session.history.push(userMessage, {
    //Updates the history. It pushes the user message and the model’s reply
    role: "model",
    parts: [{ text: result.response }],
  });

  return result.response; //Returns the reply string.
}

// ========== START CHAT ========== //
export async function startChat(req, res) {
  try {
    const sessionId = randomUUID();

    const session = {
      history: [
        {
          role: "model",
          parts: [{ text: welcomeMessage }],
        },
      ],
      messages: [
        {
          role: "assistant",
          content: welcomeMessage,
        },
      ],
    };

    sessions.set(sessionId, session);

    res.status(200).json({
      sessionId,
      message: welcomeMessage,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

// ========== CONTINUE CHAT ========== //

export async function chat(req, res) {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        message: "Session ID and message are required.",
      });
    }

    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Conversation not found. Please start a new chat.",
      });
    }

    const answer = await getChatReply(session, message);

    session.messages.push(
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: answer,
      },
    );

    res.status(200).json({
      sessionId,
      message: answer,
      messages: session.messages,
    });
  } catch (err) {
    console.error("Chat error:", err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}
