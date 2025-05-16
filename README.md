# Interactive Chatbot

A modern, feature-rich chat interface built with React and TypeScript that provides an interactive AI assistant experience. This application combines powerful AI capabilities with a beautiful, responsive UI to deliver engaging conversations and content analysis.

## Features

- 💬 Real-time chat interface with AI responses
- 📸 Image upload and analysis capabilities
- 🖼️ Screen capture functionality
- 📝 Detailed analysis mode for in-depth responses
- 🔄 Slack integration for conversation syncing
- 📑 PDF export of chat conversations
- ⚡ Fast and responsive UI with animations
- 🎨 Modern design with gradient accents

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Slack Bot Token (optional, for Slack integration)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interactive-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_api_key
SLACK_BOT_TOKEN=your_slack_bot_token # Optional
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Start the Express server (for Slack integration):
```bash
npm run server
```

The application will be available at `http://localhost:5173`

## Features Guide

### Chat Interface
- Type messages in the input field
- Press Enter to send
- Toggle detailed mode for comprehensive responses
- Clear conversations using the trash icon

### Image Analysis
- Upload images via the upload button
- Drag and drop images into the chat
- Paste images directly from clipboard
- Capture screen areas using the camera icon

### Slack Integration
- Toggle Slack sync with the message circle icon
- Automatically creates dedicated Slack channels
- Syncs all conversations in real-time

### PDF Export
- Click the download icon to export conversations
- Includes timestamps and sender information
- Maintains conversation formatting
- Automatically handles page breaks

## API Documentation

### OpenAI Integration
The application uses GPT-4 for generating responses:
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages,
  max_tokens: maxTokens,
  temperature: 0.4,
});
```

### Slack Integration
Supports channel creation and message posting:
```typescript
// Create channel
POST /api/slack/channel
Body: { name: string }

// Post message
POST /api/slack/message
Body: { channelId: string, message: string, sender: string }
```

## Project Structure

```
src/
├── components/     # React components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript definitions
└── main.tsx       # Application entry point
```

## Dependencies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- OpenAI API
- Slack Web API
- jsPDF

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and feature requests, please open an issue in the repository.