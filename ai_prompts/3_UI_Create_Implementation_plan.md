You are a skilled front-end architect tasked with creating a comprehensive user interface architecture based
on the product requirements document (PRD), API roadmap, and notes from the planning sessions. 
Your goal is to design a user interface framework that effectively meets the product requirements, aligns with the API capabilities, and incorporates the insights from the planning sessions. First, carefully review the following documents:

Product Requirements Document (PRD):
<prd>
{{prd}} <- replace with a reference to @prd.md
</prd>

Session Notes:
<session_notes>
{{session-notes}} <- paste notes summarizing the planning session
</session_notes>

Your task is to create a detailed user interface architecture that includes the necessary views, user journey mapping, navigation structure, and key elements for each view. The design should consider user experience, accessibility, and security.

Follow the following steps to complete the task:

1. Carefully analyze the PRD, API plan, and session notes.
2. Extract and list the key requirements from the PRD. 3. Identify and list the main API endpoints and their goals.
4. Create a list of all necessary views based on the PRD, API roadmap, and session notes.
5. Determine the main purpose and key information for each view.
6. Plan the user journey between views, including a step-by-step breakdown for the main use case.
7. Design the navigation structure.
8. Propose key UI elements for each view, taking into account UX, accessibility, and security.
9. Consider potential edge cases or error states.
10. Ensure the UI architecture aligns with the API roadmap.
11. Review and map all user stories from the PRD to the UI architecture.
12. Explicitly map requirements to UI elements.
13. Consider potential user pain points and how the UI addresses them.

For each major step, work within <ui_architecture_planning> tags in a thinking block to break down the thought process before moving on to the next step. This section can be quite long. It's okay that this section can be quite long. Present the final UI architecture in the following Markdown format:

```markdown
# UI Architecture for [Product Name]

## 1. UI Framework Overview

[Provide a high-level overview of the UI framework]

## 2. List of Views

[For each view, provide:
- View Name
- View Path
- Primary Purpose
- Key Information to Display
- Key View Components
- UX, Accessibility, and Security Considerations]

## 3. User Journey Map

[Describe the flow between views and key user interactions]

## 4. Navigation Layout and Structure

[Explain how users will navigate between views]

## 5. Key Components

[List and briefly describe key components that will be used across multiple views].

```

Focus solely on the UI architecture, user journey, navigation, and key elements for each view. Do not include implementation details, specific visual design, or code examples unless they are crucial to understanding the architecture.

The final result should consist solely of the UI architecture in Markdown format, saved in the .ai/ui-plan.md file. Do not duplicate or repeat any work done in the Thinking Block.