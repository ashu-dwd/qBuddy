# qBuddy

[![Ask DeepWiki](https://q-buddy.vercel.app/logo.png)](https://deepwiki.com/ashu-dwd/qBuddy)

qBuddy is an interactive chat application that allows users to engage in conversations with AI personas of renowned tech educators, Hitesh Chaudhary and Piyush Garg. The application leverages Google's Gemini API to generate context-aware and personality-driven responses, creating an immersive and educational chat experience.

## Features

- **AI Personas**: Chat with AI versions of Hitesh Chaudhary or Piyush Garg, each with a unique personality based on their real-world teaching styles.
- **Dynamic Chat Interface**: A clean, responsive interface displaying user messages and AI responses in real-time.
- **Markdown & Code Rendering**: Bot responses support Markdown, including syntax highlighting for code blocks, making technical explanations clear and readable.
- **Voice-to-Text Input**: Use your microphone to dictate messages for a hands-free experience.
- **Typing Indicator**: See when the AI is preparing a response.
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing.
- **Persistent Conversation**: The backend maintains conversation history for each persona to provide contextual follow-up responses.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, React Markdown
- **Backend**: Node.js, Express.js
- **AI**: Google Gemini API
- **Deployment**: Vercel, Docker

## Architecture

The project is structured as a monorepo containing two main parts:

- **/client**: A React-based single-page application built with Vite that serves as the user interface. It handles user input, displays the chat history, and communicates with the backend API.
- **/server**: A Node.js and Express.js backend that serves the API. It manages conversation history in-memory, processes user messages, interacts with the Gemini API to generate responses, and implements rate limiting.

The project is configured for deployment on Vercel, which serves the static frontend and runs the backend as serverless functions, as defined in `vercel.json`. A `Dockerfile` is also provided for containerizing the server application.

## API Endpoint

The primary API endpoint for handling chat interactions is:

#### `POST /api/v1/chat/generate`

This endpoint receives a user's message and the selected persona (ROLE) and returns an AI-generated response.

**Request Body:**

```json
{
  "userMessage": "Hello sir, can you explain what an API is?",
  "ROLE": 1
}
```

- `userMessage` (String): The message from the user.
- `ROLE` (Integer): The ID of the persona to chat with (`1` for Hitesh Chaudhary, `2` for Piyush Garg).

**Success Response (200 OK):**

```json
{
  "generatedResponse": "Haan ji, chaliye shuru karte hain... An API, or Application Programming Interface, is like a menu in a restaurant. It lists the dishes you can order and describes them, but you don't need to know how the kitchen prepares the food. Similarly, an API lets two software applications talk to each other without knowing the internal details. Simple, hai na?",
  "success": true
}
```

## Local Setup

To run this project on your local machine, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/)

### 1. Clone the Repository

```bash
git clone https://github.com/ashu-dwd/qBuddy.git
cd qBuddy
```

### 2. Set up the Backend (Server)

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Create a `.env.local` file and add your environment variables. You will need a Google Gemini API key.
    ```env
    # .env.local
    PORT=8080
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    GEMINI_MODEL_NAME=gemini-pro
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```
4.  Run the development server:
    ```bash
    pnpm run dev
    ```
    The backend will be running on `http://localhost:8080`.

### 3. Set up the Frontend (Client)

1.  Open a new terminal and navigate to the `client` directory from the root folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Run the development server:
    ```bash
    pnpm run dev
    ```
    The frontend will be available at `http://localhost:5173` or another port if 5173 is in use. Open this URL in your browser to use the application.
