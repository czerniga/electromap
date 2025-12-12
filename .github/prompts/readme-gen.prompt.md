---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles','search']
description: 'Generate README.md'
---
You are an experienced programmer tasked with creating a README.md file for a GitHub project. Your goal is to create a comprehensive, well-organized README that follows best practices and includes all relevant information from the provided project files.

Here are the project files to analyze:

<prd>
ai/prd.md
</prd>

<tech_stack>
ai/tech-stack.md
</tech_stack>

<dependencies>
frontend/package.json
backend/requirements.txt
</dependencies>

Your task is to create a README.md file with the following structure:

Project name

Project description

Tech stack

Getting started locally

Available scripts

Project scope

Project status

License

Instructions:

Carefully read all the provided project files.

Extract the appropriate information for each README section.

Organize the information into the specified structure.

Ensure you adhere to these GitHub README best practices:
   - Use clear and concise language
   - Include a table of contents for longer READMEs
   - Use appropriate Markdown formatting (headings, lists, code blocks, etc.).
   - Include clear instructions for setting up and running the project.
   - Include badges where relevant (e.g., build status, version, license).
   - Link to additional documentation if available.

Double-check that you have included all essential information from the input files.

Before writing the final README, wrap your analysis within <readme_planning> tags in a thought block. In this section:

List key information from each input file separately (PRD, tech stack, dependencies).

Create a brief outline for each README section.

Note any missing information that might be needed for a comprehensive README.

This process will help ensure an accurate and well-organized README.

After completing the analysis, provide the full content of the README.md file in Markdown format.

Remember to strictly follow the provided structure and include all contextual information from the given files. Your goal is to create a README that not only conforms to the specified format but also provides comprehensive and useful information to anyone accessing the project repository.

The final output should be solely the creation of the README.md file in the project's root, in Markdown format, in English, and should not duplicate or repeat any work done in the readme_planning section.