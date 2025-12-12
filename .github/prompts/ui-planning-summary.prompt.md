---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles', 'runCommands','search', 'createFile']
description: 'Summarize UI architecture planning and prepare a summary for next development phase'
---
You are an AI assistant tasked with summarizing a conversation about UI architecture planning for an MVP and preparing a concise summary for the next development phase. The conversation history contains the following information:

Product Requirements Document (PRD)

Technology stack information

API plan

Conversation history with questions and answers

UI architecture recommendations

Your task is to:

Summarize the conversation history, focusing on all decisions related to UI architecture planning.

Match the model's recommendations with the answers provided in the conversation history. Identify which recommendations are relevant based on the discussion.

Prepare a detailed conversation summary that includes:
a. Main UI architecture requirements
b. Key views, screens, and user flows
c. API integration and state management strategy
d. Responsiveness, accessibility, and security considerations
e. Any unresolved issues or areas requiring further clarification

Format the results as follows:

<conversation_summary>
<decisions>
[List the user's decisions, numbered].
</decisions>
<matched_recommendations>
[List the most relevant recommendations matched to the conversation, numbered]
</matched_recommendations>
<ui_architecture_planning_summary>
[Provide a detailed conversation summary, including the elements listed in step 3].
</ui_architecture_planning_summary>
<unresolved_issues>
[List any unresolved issues or areas requiring further clarification, if any]
</unresolved_issues>
</conversation_summary>

The final output should only contain the content in markdown format. Ensure your summary is clear, concise, and provides valuable information for the next phase of UI architecture planning and API integration.Please save output in ai/ui-planning-summary.md