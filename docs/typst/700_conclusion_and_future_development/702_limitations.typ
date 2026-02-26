Despite the successful deployment, the system operates under significant constraints inherent to its academic scope and on-premise infrastructure.

*Functional Constraints:*
- *Simplistic Logic*: The product categorization system is rigid, supporting only basic hierarchy without dynamic attributes or tagging. Similarly, shop functions like inventory management lack depth (e.g., no batch updates or supplier management).
- *Scope Limits*: Essential e-commerce features such as real-time shipping calculation, tax automation, and third-party payment gateways are simulated or omitted.

*Technical Limitations:*
- *Performance*: The frontend application suffers from noticeable latency. This sluggishness is attributed to unoptimized React re-renders and the overhead of the current development environment.
- *Error Handling*: The system's resilience is low. Error messages are often generic (e.g., "500 Server Error" or "Login Failed"), providing little actionable feedback to the user or developer for debugging.
- *Infrastructure*: Hosted on non-redundant on-premise servers, the application lacks the high availability and scalability guarantees of a cloud-native deployment.
