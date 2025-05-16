import { WebClient } from "npm:@slack/web-api@6.9.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface SlackRequest {
  action: "createChannel" | "postMessage";
  name?: string;
  channelId?: string;
  message?: string;
  sender?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SLACK_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
    if (!SLACK_TOKEN) {
      throw new Error("SLACK_BOT_TOKEN is not configured");
    }

    const client = new WebClient(SLACK_TOKEN);
    const { action, name, channelId, message, sender }: SlackRequest = await req.json();

    let response;

    if (action === "createChannel" && name) {
      const result = await client.conversations.create({
        name: name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').substring(0, 80),
        is_private: false,
      });
      response = { channelId: result.channel?.id };
    } 
    else if (action === "postMessage" && channelId && message && sender) {
      await client.chat.postMessage({
        channel: channelId,
        text: `*${sender}*: ${message}`,
        mrkdwn: true,
      });
      response = { success: true };
    } 
    else {
      throw new Error("Invalid action or missing parameters");
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Slack function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});