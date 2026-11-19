# Turner's AI Insurance Recommendation – Backend

An AI-powered car insurance recommendation application developed as part of the **Full Stack Developer Diploma at Mission Ready HQ**.

The application uses Google's Gemini AI to conduct a conversational interview with customers and recommend suitable car insurance products based on their vehicle information and usage.

## Project Overview

The backend provides a REST API that connects the frontend application to Google's Gemini AI.

Customers interact with an AI assistant named **Tina**, who asks a series of questions to understand their vehicle and driving habits. Based on the customer's answers, Tina recommends suitable insurance products according to predefined business rules.

### Available Insurance Products

The application supports three insurance products:

1. **Mechanical Breakdown Insurance (MBI)**
2. **Comprehensive Car Insurance**
3. **Third Party Car Insurance**

### Business Rules

The AI assistant follows these predefined eligibility rules:

| Insurance Product              | Eligibility                                               |
| ------------------------------ | --------------------------------------------------------- |
| Mechanical Breakdown Insurance | Not available for trucks or racing cars.                  |
| Comprehensive Car Insurance    | Only available for motor vehicles less than 10 years old. |
| Third Party Car Insurance      | Available according to the defined business rules.        |

The AI must not invent additional eligibility requirements or insurance coverage details.

## Technologies Used

- **Node.js** – JavaScript runtime environment.
- **Express.js** – Backend framework for building REST APIs.
- **Google Gemini AI** – Generates conversational responses and insurance recommendations.
- **@google/genai** – Google Gemini SDK.
- **CORS** – Enables communication between the frontend and backend.
- **dotenv** – Manages environment variables.
- **JavaScript (ES Modules)** – Application development.

## Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   └── aiConnect.js
│   │
│   ├── controllers/
│   │   └── chatController.js
│   │
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   └── index.js
│   │
│   └── app.js
│
├── server.js
├── package.json
├── package-lock.json
└── .env
```

## Getting Started

### 1. Prerequisites

Before running the application, make sure you have installed:

- Node.js
- npm
- A Google Gemini API key

### 2. Clone the Repository

```bash
git clone <https://github.com/annaramezoni/Mission-4-Insurance-Recommendation-Application-using-Generative-AI.git>
```

Navigate into the project directory:

```bash
cd <M4-backend>
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your own Google Gemini API key.

**Important:** Never commit your `.env` file or expose your API key publicly.

### 5. Run the Application

Start the backend server:

```bash
node server.js
```

If you have configured Nodemon, you can also use:

```bash
npm run dev
```

The server will start on the configured port.

Example:

```text
Listening to port 3000
```

## API Endpoints

The backend provides the following REST API endpoints:

| Method | Endpoint     | Description                                                     |
| ------ | ------------ | --------------------------------------------------------------- |
| GET    | `/health`    | Checks whether the server is running.                           |
| GET    | `/`          | Returns the welcome message.                                    |
| POST   | `/startChat` | Creates a new chat session and returns Tina's welcome message.  |
| POST   | `/chat`      | Sends a customer message to Gemini and returns Tina's response. |

### 1. Health Check

**GET** `/health`

Checks whether the backend server is running.

Example response:

```text
Server working
```

### 2. Start a Conversation

**POST** `/startChat`

Creates a new conversation session and generates a unique session ID.

Example response:

```json
{
  "sessionId": "generated-session-id",
  "message": "I'm Tina. I help you choose the right insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?"
}
```

### 3. Continue a Conversation

**POST** `/chat`

Sends the customer's message to the backend using the existing session ID.

Request body:

```json
{
  "sessionId": "generated-session-id",
  "message": "I drive a Toyota Corolla from 2020."
}
```

Example response:

```json
{
  "sessionId": "generated-session-id",
  "message": "How do you usually use your car?",
  "messages": [
    {
      "sender": "Tina",
      "content": "Welcome message..."
    },
    {
      "sender": "Me",
      "content": "I drive a Toyota Corolla from 2020."
    },
    {
      "sender": "Tina",
      "content": "How do you usually use your car?"
    }
  ]
}
```

The actual AI response will depend on the conversation.

## How It Works

The backend follows a conversational workflow:

1. **Start Chat:** The frontend sends a request to `/startChat`.
2. **Create Session:** The backend generates a unique session ID using `randomUUID()` and creates a new conversation.
3. **Customer Interaction:** The customer sends a message through the frontend.
4. **Process Message:** The `/chat` endpoint retrieves the corresponding session and sends the conversation history and new message to Gemini.
5. **Generate Response:** Gemini processes the conversation using the system instructions and predefined business rules.
6. **Update History:** The backend stores both the customer's message and Tina's response.
7. **Return Response:** The API returns the latest response and complete conversation history to the frontend.

## AI Integration and Error Handling

The application integrates Google Gemini AI using the `@google/genai` SDK.

Some of the implemented features include:

- **System Instructions:** Defines Tina's personality, interview behaviour, insurance products and eligibility rules.
- **Conversation History:** Maintains previous messages so the AI can generate context-aware responses.
- **Structured JSON Responses:** Uses `responseMimeType` and `responseSchema` to ensure Gemini returns a predictable JSON object.
- **Model Fallback:** Attempts to use a secondary Gemini model if the primary model is unavailable.
- **Retry Mechanism:** Retries temporary API errors (503 and 429) up to three times per model.
- **Session Management:** Uses a JavaScript `Map` to maintain active conversations.

## Error Handling

The API handles common errors using appropriate HTTP status codes:

| Status Code | Description                     |
| ----------- | ------------------------------- |
| 200         | Request successful.             |
| 400         | Missing session ID or message.  |
| 404         | Conversation session not found. |
| 500         | Internal server error.          |

## Academic Project

**Programme:** Full Stack Developer Diploma  
**Institution:** Mission Ready HQ  
**Project:** AI-Powered Insurance Recommendation Application  
**Year:** 2026

This project demonstrates the integration of backend development, REST API architecture, third-party AI services, session management and business logic to develop an interactive AI-powered application.
