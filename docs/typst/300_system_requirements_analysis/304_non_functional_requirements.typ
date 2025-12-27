=== Performance Requirements
- *Response Time*: The system should respond to user interactions (e.g., page loads, API calls) within *10 seconds*. This relaxed constraint accounts for the limitations of the on-premise hosting environment used for this student project.
- *Throughput*: Capable of handling concurrent access by a small cohort of users (e.g., class demonstration).

=== internal/Reliability & Availability
- *Uptime*: The target availability is *95%* during evaluation periods. Occasional downtime is expected due to the non-redundant infrastructure.
- *Data Integrity*: Database transactions must support ACID properties to ensure order data is never lost or corrupted.

=== Security Requirements
- *Authentication*: All protected resources require a valid JSON Web Token (JWT).
- *Password Storage*: Passwords must be hashed using robust algorithms (e.g., bcrypt) before storage.
- *Authorization*: API endpoints must validate the user's role (Admin, Seller, Customer) before processing requests.

=== Usability
- *Interface*: The web interface should be responsive and accessible on standard desktop browsers.
- *Feedback*: Clear error messages and loading states should be provided to the user.
