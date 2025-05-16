const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const createSlackChannel = async (name: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/slack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        action: 'createChannel',
        name,
      }),
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
    const response = await fetch(`${SUPABASE_URL}/functions/v1/slack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        action: 'postMessage',
        channelId,
        message,
        sender,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to post message to Slack');
    }
  } catch (error) {
    console.error('Error posting to Slack:', error);
  }
};