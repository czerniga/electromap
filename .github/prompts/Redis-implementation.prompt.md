---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles','search','createFile']
description: 'Implement Redis in-memory model and initialization'
---
You are tasked with creating a Redis in-memory implementation based on the plan prepared in the ai/redis-plan.md file, while considering the information in ai/tech-stack.md and ai/prd.md. Your focus should be on creating the model and Redis initialization, not on implementing the rest of the logic.

First, review the Redis plan:
<redis_plan>
{{REDIS_PLAN}}
</redis_plan>

Next, consider the tech stack:
<tech_stack>
{{TECH_STACK}}
</tech_stack>

Finally, keep in mind the product requirements:
<prd>
{{PRD}}
</prd>

Based on these inputs, your task is to create the Redis in-memory implementation. Focus specifically on:

1. Creating the data model for Redis
2. Implementing the Redis initialization process

When creating the implementation:
- Use the programming language and frameworks specified in the tech stack
- Ensure your model aligns with the requirements outlined in the PRD
- Follow the structure and guidelines provided in the Redis plan
- Do not implement any logic beyond the model and initialization at this stage

Your output should include:
1. The data model for Redis
2. The Redis initialization code

Make sure to include any necessary imports and configurations required for the Redis model and initialization.

Remember, focus only on the model and initialization. Do not implement other Redis operations or application logic at this point.