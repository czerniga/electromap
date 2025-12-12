---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles','search','createFile']
description: 'Generate a detailed frontend implementation plan for a new view based on PRD, user stories, endpoints, and tech stack'
---
As a senior frontend developer, your task is to create a detailed implementation plan for a new view in a web application. This plan should be comprehensive and clear enough for another frontend developer to implement the view correctly and efficiently.

First, review the following information:

Product Requirements Document (PRD):

<prd>
ai\prd.md
</prd>

<view_description & user_stories & endpoint_description>
for this data please refer to provided task number and task list
</route_api_specification & user_stories & endpoint_description>

View Description:
<view_description>
ai\ui-plan.md
</view_description>

Endpoint Implementation:
<endpoint_implementation>
reference the endpoint implementation
</endpoint_implementation>

Type Definitions:
<type_definitions>
backend/schemas.py
</type_definitions>

Tech Stack:
<tech_stack>
ai\tech-stack.md
</tech_stack>

Before creating the final implementation plan, conduct an analysis and planning within the <implementation_breakdown> tags in your thinking block. This section can be quite long, as it is important to be thorough.

In your implementation breakdown, follow these steps:

For each input section (PRD, User Stories, Endpoint Description, Endpoint Implementation, Type Definitions, Tech Stack):

Summarize key points

List any requirements or constraints

Note any potential challenges or important issues

Extract and list the key requirements from the PRD

List all the necessary main components, along with a brief description, required types, handled events, and validation conditions

Create a high-level component tree diagram

Identify the required DTOs and custom ViewModel types for each view component. Explain these new types in detail, breaking down their fields and associated types.

Identify potential state variables and custom hooks, explaining their purpose and how they will be used

List the required API calls and their corresponding frontend actions

Map each user story to specific implementation details, components, or features

List user interactions and their expected outcomes

List the conditions required by the API and how to verify them at the component level

Identify potential error scenarios and suggest how to handle them

List potential challenges related to implementing this view and suggest possible solutions

After conducting the analysis, provide the implementation plan in Markdown format with the following sections:

Overview: A brief summary of the view and its purpose.

View Routing: Specify the path where the view should be available.

Component Structure: Outline the main components and their hierarchy.

Component Details: For each component, describe:

Component description, its purpose, and what it consists of

The main HTML elements and child components that build the component

Handled events

Validation conditions (detailed conditions, according to the API)

DTO and ViewModel types required by the component

The props that the component accepts from its parent (component interface)

Types: A detailed description of the types required for view implementation, including a precise breakdown of any new types or view models by fields and types.

State Management: A detailed description of how state will be managed in the view, specifying whether a custom hook is required.

API Integration: An explanation of how to integrate with the provided endpoint. Precisely indicate the request and response types.

User Interactions: A detailed description of user interactions and how they will be handled.

Conditions and Validation: Describe which conditions are verified by the interface, which components they apply to, and how they affect the interface state

Error Handling: A description of how to handle potential errors or edge cases.

Implementation Steps: A step-by-step guide for implementing the view.

Ensure that your plan is consistent with the PRD, user stories, and takes into account the provided tech stack.

The final output should be in Polish and saved to a file named .ai/{view-name}-view-implementation-plan.md. Do not include any analysis and planning in the final output.

Here is an example of what the output file should look like (the content is to be replaced):

# Plan implementacji widoku [View Name]

## 1. Przegląd
[A brief description of the view and its purpose]

## 2. Routing widoku
[The path where the view should be available]

## 3. Struktura komponentów
[Outline of the main components and their hierarchy]

## 4. Szczegóły komponentów
### [Component Name 1]
- Opis komponentu [description]
- Główne elementy: [description]
- Obsługiwane interakcje: [list]
- Obsługiwana walidacja: [list, detailed]
- Typy: [list]
- Propsy: [list]

### [Component Name 2]
[...]

## 5. Typy
[A detailed description of the required types]

## 6. Zarządzanie stanem
[Description of state management in the view]

## 7. Integracja API
[Explanation of integration with the provided endpoint, specifying request and response types]

## 8. Interakcje użytkownika
[A detailed description of user interactions]

## 9. Warunki i walidacja
[A detailed description of conditions and their validation]

## 10. Obsługa błędów
[Description of handling potential errors]

## 11. Kroki implementacji
1. [Step 1]
2. [Step 2]
3. [...]

Start the analysis and planning now. Your final output should consist only of the implementation plan in Polish in markdown format, which you will save to the file .ai/{view-name}-view-implementation-plan.md, and it should not duplicate or repeat any work done in the implementation breakdown.