As a senior front-end developer, your job is to create a detailed implementation plan for a new view in a web application. This plan should be comprehensive and clear enough for another front-end developer to implement the view correctly and efficiently. First, review the following information:

1. Product Requirements Document (PRD):
   <prd>
   {{prd}} <- replace with a reference to the @prd.md file
   </prd>

2. View Description:
   <view_description>
   {{view-description}} <- paste the description of the implemented view from ui-plan.md
   </view_description>

3. User Stories:
   <user_stories>
   {{user-stories}} <- paste the user stories from @prd.md that will be addressed by the view
   </user_stories>

4. Endpoint Description:
   <endpoint_description>
   {{endpoint-description}} <- paste the endpoint descriptions from api-plan.md that the view will use
   </endpoint_description>

5. Endpoint Implementation:
   <endpoint_implementation>
   {{endpoint-implementation}} <- replace with A reference to the endpoint implementations the view will use (e.g., @generations.ts, @flashcards.ts)

</endpoint_implementation>

6. Tech Stack:
   <tech_stack>
   {{tech-stack}} <- replace with a reference to the @tech-stack.md file

</tech_stack>

Before creating your final implementation plan, perform analysis and planning within the <implementation_breakdown> tags in your thinking block. This section can be quite long, as it's important to be thorough.

In your implementation breakdown, follow these steps:
1. For each input section (PRD, User Stories, Endpoint Description, Endpoint Implementation, Type Definitions, Tech Stack):
- Summarize key points
- List any requirements or constraints
- Highlight any potential challenges or important considerations
2. Extract and list key requirements from the PRD
3. List all required core components, along with a brief description of their description, required types, supported events, and validation conditions
4. Create a high-level component tree diagram
5. Identify the required DTOs and custom ViewModel types for each view component. Explain these new types in detail, breaking down their fields and associated types. 6. Identify potential state variables and custom hooks, explaining their purpose and usage.
7. List the required API calls and their corresponding front-end actions.
8. Map each user story to specific implementation details, components, or functions.
9. List user interactions and their expected outcomes.
10. List the conditions required by the API and how to validate them at the component level.
11. Identify potential error scenarios and suggest how to address them.
12. List potential challenges in implementing this view and suggest possible solutions.

After analysis, deliver an implementation plan in Markdown format with the following sections:

1. Overview: A brief summary of the view and its purpose.
2. View Routing: Defining the path along which the view should be accessed.
3. Component Structure: Outline the main components and their hierarchy. 4. Component Details: For each component, describe:
- A description of the component, its purpose, and its components
- The main HTML elements and child components that make up the component
- Handled events
- Validation conditions (detailed conditions, according to the API)
- Types (DTOs and ViewModels) required by the component
- Props the component accepts from the parent (component interface)
5. Types: A detailed description of the types required to implement the view, including a precise breakdown of any new types or view models by field and type.
6. State Management: A detailed description of how state is managed in the view, specifying whether a custom hook is required.
7. API Integration: An explanation of how integration with the provided endpoint will be handled. This precisely identifies the request and response types.
8. User Interactions: A detailed description of user interactions and how they will be handled. 9. Conditions and Validation: Describe which conditions are validated by the interface, which components they apply to, and how they affect the interface state.
10. Error Handling: Describe how to handle potential errors or edge cases.
11. Implementation Steps: A step-by-step guide to implementing the view.

Ensure your plan complies with the PRD, user stories, and takes into account the provided technology stack.

The final results should be  saved in a file named .ai/{view-name}-view-implementation-plan.md. Do not include any analysis or planning in the final result.

Here is an example of what the output file should look like (content is replaceable):

```markdown
# View Implementation Plan [View Name]

## 1. Overview
[Brief description of the view and its purpose]

## 2. View Routing
[Path where the view should be available]