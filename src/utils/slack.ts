const API_URL = 'http://localhost:3000/api';

export const createSlackChannel = async (name: string) => {
  try {
    const response = await fetch(`${API_URL}/slack/channel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Slack channel');
    }

    const data = await response.json();
    return data.channelId;
  } catch (error) {
    console.error('Error creating Slack channel:', error);
    return null;
  }
};

export const postToSlack = async (channelId: string, message: string, sender: string) => {
  try {
    const response = await fetch(`${API_URL}/slack/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId, message, sender }),
    });

    if (!response.ok) {
      throw new Error('Failed to post message to Slack');
    }
  } catch (error) {
    console.error('Error posting to Slack:', error);
  }
};