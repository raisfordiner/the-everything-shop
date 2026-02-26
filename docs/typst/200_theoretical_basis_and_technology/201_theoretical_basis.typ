This chapter outlines the theoretical frameworks and architectural patterns that underpin the design of the "Everything Shop".

=== Model-View-Controller (MVC) Pattern
The application is structured using the *MVC architecture*, a design pattern that decouples the user interface (View), data (Model), and application logic (Controller).
- *Model*: Represents the data and business rules. In our system, this is managed by the *Prisma ORM* and the PostgreSQL database, wrapped by a *Service Layer* to handle business logic.
- *View*: The presentation layer that interacts with the user. Our *React* frontend serves as the view, consuming data from the API and rendering the UI.
- *Controller*: The interface between the Model and View. Our *Express* controllers receive HTTP requests, validate input, invoke the Service layer, and return the appropriate JSON response.

=== RESTful API
Communication between the frontend and backend relies on *REST (Representational State Transfer)* principles.
- *Statelessness*: Each request from the client to the server contains all the information needed to understand and process the request.
- *Resource-Based*: Data is exposed as resources (e.g., `/products`, `/orders`) manipulated using standard HTTP methods (GET, POST, PUT, DELETE).

=== Single Page Application (SPA)
The frontend is built as an SPA, meaning the application loads a single HTML page and dynamically updates content as the user interacts with the app. This provides a smoother user experience similar to a desktop application, avoiding full page reloads.
