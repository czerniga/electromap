---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles','search','createFile']
description: 'Implement a REST API endpoint based on the provided plan'
---
Your task is to implement a REST API endpoint based on the provided implementation plan. Your goal is to create a robust and well-organized implementation that includes proper validation, error handling, and follows all the logical steps outlined in the plan.

First, carefully review the provided implementation plan:

<implementation_plan>
{{endpoint-implementation-plan}}
</implementation_plan>

<types>
backend/schemas.py
</types>

<implementation_approach>
Implement a maximum of 3 steps from the implementation plan, briefly summarize what you have done and describe the plan for the next 3 actions - stop work at this point and wait for my feedback.
</implementation_approach>

Now, follow these steps to implement the REST API endpoint:

Analyze the implementation plan:

Determine the HTTP method (GET, POST, PUT, DELETE, etc.) for the endpoint.

Define the endpoint's URL structure.

List all expected input parameters.

Understand the required business logic and data processing steps.

Note any specific requirements for validation or error handling.

Begin the implementation:

Start by defining the endpoint function with the correct HTTP method decorator.

Configure the function parameters based on the expected input data.

Implement input data validation for all parameters.

Follow the logical steps outlined in the implementation plan.

Implement error handling for each stage of the process.

Ensure proper data processing and transformation as required.

Prepare the response data structure.

Validation and error handling:

Implement thorough input data validation for all parameters.

Use appropriate HTTP status codes for different scenarios (e.g., 400 for bad requests, 404 for not found, 500 for server errors).

Provide clear and informative error messages in the response.

Handle potential exceptions that may occur during processing.

Testing considerations:

Consider edge cases and potential issues that should be tested.

Ensure the implementation covers all scenarios listed in the plan.

Documentation:

Add clear comments to explain complex logic or important decisions.

Include documentation for the main function and any helper functions.

Upon completion of the implementation, make sure it includes all necessary imports, function definitions, and any additional helper functions or classes required for the implementation.

If you must make any assumptions or have any questions about the implementation plan, state them before writing the code.

Remember to follow REST API design best practices, adhere to programming language style guidelines, and ensure the code is clean, readable, and well-organized.