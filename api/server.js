require('dotenv').config();
const express = require('express');
const cors = require('cors');
const JiraClient = require('jira-client');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/create-jira-issue', async (req, res) => {
  try {
    if (!process.env.JIRA_HOST || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN || !process.env.JIRA_PROJECT_KEY) {
      throw new Error('Missing required environment variables');
    }

    const jira = new JiraClient({
      protocol: 'https',
      host: process.env.JIRA_HOST,
      username: process.env.JIRA_EMAIL,
      password: process.env.JIRA_API_TOKEN,
      apiVersion: '2',
      strictSSL: true
    });

    const { conversation } = req.body;

    if (!conversation || !Array.isArray(conversation)) {
      throw new Error('Invalid request body');
    }

    const issueData = {
      fields: {
        project: {
          key: process.env.JIRA_PROJECT_KEY
        },
        summary: 'Chat Assistant Issue Report',
        description: conversation
          .map(msg => `${msg.sender.toUpperCase()}: ${msg.content}`)
          .join('\n\n'),
        issuetype: {
          name: 'Bug'
        }
      }
    };

    const issue = await jira.addNewIssue(issueData);

    res.json({
      success: true,
      issueKey: issue.key,
      issueUrl: `https://${process.env.JIRA_HOST}/browse/${issue.key}`
    });
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});