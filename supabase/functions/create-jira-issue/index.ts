import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:jira-client@8.2.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const jira = new createClient({
  protocol: 'https',
  host: Deno.env.get('JIRA_HOST'),
  username: Deno.env.get('JIRA_EMAIL'),
  password: Deno.env.get('JIRA_API_TOKEN'),
  apiVersion: '2',
  strictSSL: true
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversation } = await req.json();

    const issueData = {
      fields: {
        project: {
          key: Deno.env.get('JIRA_PROJECT_KEY')
        },
        summary: 'Chat Assistant Issue Report',
        description: `Conversation History:\n\n${conversation.map((msg: any) => 
          `${msg.sender}: ${msg.content}\nTimestamp: ${new Date(msg.timestamp).toISOString()}\n`
        ).join('\n')}`,
        issuetype: {
          name: 'Bug'
        }
      }
    };

    const issue = await jira.addNewIssue(issueData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        issueKey: issue.key,
        issueUrl: `https://${Deno.env.get('JIRA_HOST')}/browse/${issue.key}`
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});