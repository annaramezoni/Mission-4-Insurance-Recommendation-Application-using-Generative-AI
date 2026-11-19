import { randomUUID } from "crypto";
import {
  ai,
  MODEL,
  FALLBACK_MODEL,
  Type,
  ThinkingLevel,
} from "../config/aiConnect.js";

// Store active conversations
const sessions = new Map();

const welcomeMessage = `I'm Tina. I help you choose the right insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?`;

// ========== SYSTEM PROMPT ========== //

const systemPrompt = `
You are Tina and you are a friendly assistant that wants to help customers from Turner's
choose the right insurance policy for their cars.

Today's year is ${new Date().getFullYear()}.

The three insurance products are (use only these,do not invent coverage):
1. Mechanical Breakdown Insurance (MBI)
2. Comprehensive Car Insurance
3. Third Party Car Insurance

Ask questions to uncover details that help identify
which policy is best for the customer.
Before recommending, make sure you know: vehicle type, vehicle age(give the customer the option to answer with age or year), and how the customer uses the car. If the omer does not answer that it is a racing car, make sure, in a polite way that it is not used for racing, if it is a truck don't need to ask if it is used for racing. Ask one question at a time.

Business rules:
- MBI is not available for trucks and racing cars.
- Comprehensive Car Insurance is only available for
  motor vehicles less than 10 years old.

Do not ask customers directly which insurance product
they want
Do not repeat questions
Ask questions based on the full conversation
Do not recommend a product that fails a business rule
Do not invent any other eligibility rules, exclusions, or coverage
details. If a product is not excluded by the rules above, it is
available. If you are unsure whether something is covered, say you
are not sure rather than guessing.

At the end, recommend one or more suitable products, name each suitable product and say why it fits. Avoid exaggerated claims. End by asking if they have questions.
`;

// ========== GEMINI FUNCTION ========== //
//
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
        //Gemini conversation format
        {
          role: "model",
          parts: [{ text: welcomeMessage }],
        },
      ],
      messages: [
        {
          sender: "Tina",
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
        sender: "Me",
        content: message,
      },
      {
        sender: "Tina",
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
