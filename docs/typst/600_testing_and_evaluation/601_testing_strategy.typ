To ensure the reliability and correctness of "The Everything Shop," a multi-layered testing strategy was employed. This approach combines functional verification with structural analysis to identify defects at different granularities.

=== Testing Levels

==== Unit Testing
Unit tests focus on individual components and functions in isolation.
- *Scope*: Backend utility functions, data validation helpers, and Redux reducers.
- *Method*: White-box testing using Jest (implied).
- *Goal*: Verify that specific logic blocks (e.g., price calculation, email validation) return correct outputs for given inputs.

==== Integration Testing
Integration tests verify the interactions between different modules/services.
- *Scope*: API endpoints, Database interactions, and Client-Server communication.
- *Method*: Black-box testing via Postman and internal API tests.
- *Goal*: Ensure that the Express backend correctly communicates with the PostgreSQL database and that the React frontend successfully consumes these APIs.

==== System Testing
System tests evaluate the complete, integrated application against the functional requirements.
- *Scope*: Full user flows (e.g., "Registration to Checkout").
- *Method*: Black-box testing via the web interface.
- *Goal*: Validate that the system meets user needs as defined in the Use Case Specifications.

=== Testing Environment
- *OS*: Linux (Development)
- *Browser*: Chromium / Firefox
- *Database*: PostgreSQL 16 (Dockerized)
- *Tools*: Jest (Unit), Manual Execution (System)
