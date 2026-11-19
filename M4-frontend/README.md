# Turner's AI Insurance Recommendation – Frontend

A React-based frontend application developed as part of the **Full Stack Developer Diploma at Mission Ready HQ**.

The application provides an interactive chat interface where customers can communicate with an AI assistant named Tina to receive personalised car insurance recommendations based on their vehicle details and usage.

## Project Overview

The frontend connects to a Node.js and Express backend integrated with Google's Gemini AI.

Customers interact with Tina through a conversational interface. Tina asks questions one at a time to understand the customer's vehicle type, vehicle age and driving habits before recommending suitable insurance products.

The application provides a simple and user-friendly experience, displaying both customer messages and AI-generated responses in real time as the conversation progresses.

## Technologies Used

- **React** – JavaScript library for building user interfaces.
- **JavaScript (ES6+)** – Application logic and functionality.
- **CSS Modules** – Component-scoped styling.
- **React Hooks** – State management and component lifecycle.
- **React Router** – Client-side navigation.
- **Fetch API** – Communication with the backend REST API.
- **HTML5** – Application structure and semantic elements.
- **CSS3** – Layout and responsive styling.

## Project Structure

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── Chat.jsx
│   │   ├── Chat.module.css
│   │   ├── Home.jsx
│   │   ├── Home.module.css
│   │   ├── Navbar.jsx
│   │   └── Navbar.module.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── package.json
├── package-lock.json
└── index.html
```

## Getting Started

### 1. Prerequisites

Before running the application, make sure you have installed:

- Node.js
- npm
- The backend application running locally.

### 2. Clone the Repository

```bash
git clone <https://github.com/annaramezoni/Mission-4-Insurance-Recommendation-Application-using-Generative-AI.git>
```

Navigate into the project directory:

```bash
cd <M4-frontend>
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

Run the following command:

```bash
npm run dev
```

The application will be available at the local URL provided by Vite, usually:

```text
http://localhost:5173
```

**Important:** Make sure the backend server is running on port 3000 so the frontend can communicate with the API.

## Application Components

The frontend is organised into reusable React components, with separate CSS Modules for styling.

### Home.jsx

The landing page of the application.

### Chat.jsx

The main conversational interface.

Responsibilities include:

- Starting a new conversation by requesting a session from the backend.
- Displaying Tina's welcome message.
- Managing customer input and message submission.
- Sending messages to the backend using the Fetch API.
- Displaying customer messages and AI-generated responses.
- Automatically scrolling to the latest message.
- Managing loading states while waiting for AI responses.
- Automatically focusing the input field when Tina finishes responding.

### Navbar.jsx

Just a UI feature for now, future improvement is to add navigation links.

### CSS Modules

Each component has its own CSS Module to keep styles organised and prevent unwanted styling conflicts.

- `Chat.module.css`
- `Home.module.css`
- `Navbar.module.css`

## React Concepts Implemented

This project demonstrates several React concepts:

### State Management with useState

The application uses React's `useState` Hook to manage the chat interface.

| State       | Purpose                                                            |
| ----------- | ------------------------------------------------------------------ |
| `sessionId` | Stores the unique conversation session ID returned by the backend. |
| `messages`  | Stores the conversation messages displayed in the chat interface.  |
| `userInput` | Controls the customer's current input.                             |
| `loading`   | Tracks whether the application is waiting for the AI response.     |

### Side Effects with useEffect

The application uses `useEffect` to handle operations outside the normal rendering process:

- Starts a new chat session when the Chat component first renders.
- Automatically scrolls the conversation to the latest message when messages change.
- Returns focus to the input field when the loading state finishes.

### DOM References with useRef

The application uses `useRef` to access DOM elements directly without triggering additional renders.

- `messagesRef` accesses the conversation container to control scrolling.
- `inputRef` accesses the input field to manage focus.

## Backend Integration

The frontend communicates with the backend through HTTP requests using the Fetch API.

The backend is responsible for managing conversation sessions, processing messages and generating AI responses through Google Gemini.

### API Endpoints

| Method | Endpoint     | Description                                                                          |
| ------ | ------------ | ------------------------------------------------------------------------------------ |
| POST   | `/startChat` | Starts a new conversation and retrieves Tina's welcome message.                      |
| POST   | `/chat`      | Sends the customer's message and retrieves Tina's response and conversation history. |

### Conversation Workflow

1. The customer opens the chat page.
2. The frontend sends a POST request to `/startChat`.
3. The backend creates a unique session ID and returns Tina's welcome message.
4. The customer enters a message and submits the form.
5. The frontend sends the message and session ID to `/chat`.
6. The backend processes the conversation using Gemini AI.
7. The frontend receives the updated conversation history.
8. React updates the interface to display the latest messages.

## User Experience Features

The application includes several features to improve the conversational experience:

- **Dynamic Chat Interface:** Displays customer and AI messages in a conversational format.
- **Loading State:** Prevents customers from submitting additional messages while waiting for Tina's response.
- **Auto Scrolling:** Automatically moves the conversation to the latest message.
- **Input Validation:** Prevents empty messages from being submitted.
- **Automatic Input Focus:** Keeps the input field ready for the next message.
- **Session Management:** Maintains the conversation using a unique session ID.

## Academic Project

**Programme:** Full Stack Developer Diploma
**Institution:** Mission Ready HQ
**Project:** AI-Powered Insurance Recommendation Application
**Year:** 2026

This project demonstrates frontend development using React, component-based architecture, state management, API integration and the development of an interactive user interface powered by generative AI.
