import { createClient } from "npm:jira-client@8.2.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    if (!Deno.env.get("JIRA_HOST") || !Deno.env.get("JIRA_EMAIL") || !Deno.env.get("JIRA_API_TOKEN") || !Deno.env.get("JIRA_PROJECT_KEY")) {
      throw new Error("Missing required environment variables");
    }

    const jira = new createClient({
      protocol: "https",
      host: Deno.env.get("JIRA_HOST"),
      username: Deno.env.get("JIRA_EMAIL"),
      password: Deno.env.get("JIRA_API_TOKEN"),
      apiVersion: "2",
      strictSSL: true,
    });

    const { conversation } = await req.json();

    if (!conversation || !Array.isArray(conversation)) {
      throw new Error("Invalid request body");
    }

    const issueData = {
      fields: {
        project: {
          key: Deno.env.get("JIRA_PROJECT_KEY"),
        },
        summary: "Chat Assistant Issue Report",
        description: conversation
          .map((msg) => `${msg.sender.toUpperCase()}: ${msg.content}`)
          .join("\n\n"),
        issuetype: {
          name: "Bug",
        },
      },
    };

    const issue = await jira.addNewIssue(issueData);

    return new Response(
      JSON.stringify({
        success: true,
        issueKey: issue.key,
        issueUrl: `https://${Deno.env.get("JIRA_HOST")}/browse/${issue.key}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating Jira issue:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});