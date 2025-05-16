require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { WebClient } = require('@slack/web-api');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

app.post('/api/slack/channel', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await slack.conversations.create({
      name: name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').substring(0, 80),
      is_private: false,
    });
    res.json({ channelId: result.channel.id });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/slack/message', async (req, res) => {
  try {
    const { channelId, message, sender } = req.body;
    await slack.chat.postMessage({
      channel: channelId,
      text: `*${sender}*: ${message}`,
      mrkdwn: true,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});