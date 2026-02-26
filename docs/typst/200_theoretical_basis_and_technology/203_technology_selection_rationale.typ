The selection of technologies was driven by the need for a modern, scalable, and developer-friendly stack.

=== Why PERN Stack (Postgres, Express, React, Node)?
- *Unified Language*: Using JavaScript/TypeScript on both the frontend and backend reduces context switching and allows for code reuse (e.g., shared types).
- *Ecosystem*: The Node.js ecosystem (npm) is the largest in the world, providing libraries for almost any functionality required (e.g., authentication, validation).
- *Performance*: Node.js's non-blocking I/O model is well-suited for I/O-heavy applications like e-commerce APIs.

=== Why TypeScript?
We chose TypeScript over plain JavaScript to enforce static typing. This helps catch errors at compile-time rather than runtime, significantly improving code quality and maintainability, especially in the backend logic.

=== Why Containerization?
Using Docker and Docker Compose solves the "it works on my machine" problem. By defining the environment (Node version, Database version) in code, every team member can spin up the entire stack with a single command, ensuring a consistent development experience.
