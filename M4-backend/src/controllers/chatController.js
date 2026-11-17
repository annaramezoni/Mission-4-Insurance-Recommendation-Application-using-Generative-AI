import { randomUUID } from "crypto";
import { ai, MODEL, Type, ThinkingLevel } from "../config/aiConnect.js";

// Store active conversations
const sessions = new Map();

// System prompt
const systemPrompt = `
You are Tina and you want to help customers from Turner's
choose the right insurance policy for their cars.

The three insurance products are:
1. Mechanical Breakdown Insurance (MBI)
2. Comprehensive Car Insurance
3. Third Party Car Insurance

Start the conversation with:
"I'm Tina. I help you choose the right insurance policy.
May I ask you a few personal questions to make sure I
recommend the best policy for you?"

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

export async function startChat(req, res) {
  try {
    // Will create a new conversation here.

    res.status(200).send("ok");
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

export async function chat(req, res) {
  try {
    // Will process the customer's answer here.

    res.status(200).send("ok");
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}
