To ensure a smooth implementation process and consistent behavior across different machines, a standardized development environment was established. This section outlines the hardware and software requirements, along with the specific tools and technologies utilized.

== Software Configuration
The following software tools and runtimes are required to build and run the system:

#figure(
  table(
    columns: (30%, 20%, 50%),
    align: (left, center, left),
    [*Software*], [*Version*], [*Purpose*],
    [Docker], [v24.x], [Containerization platform for consistent environments],
    [Docker Compose], [v2.x], [Orchestration of multi-container applications],
  ),
  caption: [Software Requirements],
)

== Development Tools
To maximize productivity and code quality, the following development tools were employed:
- *Visual Studio Code (VS Code)*: The primary Integrated Development Environment (IDE), enhanced with extensions for ESLint, Prettier, and Docker.
- *Git*: Version control system for tracking changes and collaboration.
- *Swagger*: API testing tool used to verify backend endpoints before frontend integration.
- *Prisma Studio*: Database management tools for inspecting schemass.
