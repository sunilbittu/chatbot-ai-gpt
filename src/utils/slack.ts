import { WebClient } from '@slack/web-api';

const SLACK_TOKEN = import.meta.env.VITE_SLACK_BOT_TOKEN;
const client = new WebClient(SLACK_TOKEN);

export const createSlackChannel = async (name: string) => {
  try {
    const result = await client.conversations.create({
      name: name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').substring(0, 80),
      is_private: false,
    });
    return result.channel?.id;
  } catch (error) {
    console.error('Error creating Slack channel:', error);
    return null;
  }
};

export const postToSlack = async (channelId: string, message: string, sender: string) => {
  try {
    await client.chat.postMessage({
      channel: channelId,
      text: `*${sender}*: ${message}`,
      mrkdwn: true,
    });
  } catch (error) {
    console.error('Error posting to Slack:', error);
  }
};