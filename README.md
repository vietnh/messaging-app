This code is part of a project that demonstrates a real-time chat application using Express, Socket.io, Vite, ReactJS, Redux Toolkit, and RTK Query.

Date of submission: 05/12/2023

Instructions to run locally:
1. Install Docker and Docker Compose.
2. Run the following command in the project directory:
  ```
  docker-compose up --build
  ```
  This will start the backend server, frontend development server, and the database.

3. Access the application in your browser at http://localhost:3000.

Time spent:
- Build the app with Express, Socket.io, Vite: 2 hours
- Implement backend API: 3 hours
- Implement ReactJS app using Vite, Redux Toolkit, RTK Query: 5 hours
- Handle web socket data transfer between backend and frontend: 2 hours
- Testing and bug fixings: 1 hour
- Write README: 0.5 hour
- Total: 13.5 hours

Assumptions made:
- User can only join 1 room at a time.
- There is no security handled. All APIs are public and users don't need any credentials to join and view everything.

Compromises made:
- All messages (of a room) are fetched without pagination/lazy loading. Should have handled that if I have time.
- Didn't handle edge cases. For example, users shutting down the browser instantly, which can cause some unexpected errors.
- Didn't handle logging, which is very important in a real-world application.
- Unit tests were not implemented due to time constraints.

Production readiness checklist:
- Achieve a test coverage of around 70-80% (or more, depending on the project).
- Conduct security testing. This can be done using automated tools and manual testing for complex cases.
- Perform cross-browser and cross-device testing.
- Ensure monitoring and logging are properly set up.
- Document changes for the production environment.

Handling high concurrent users:
While I don't have direct experience in this area, some basic strategies come to mind:
- Implement load balancing to distribute the load.
- Use caching to reduce the load on the database.
- Apply database indexing for query optimization.

Ensuring security:
- Consider applying multi-factor authentication.
- Use HTTPS to secure data transmission between the server and client.
- Use a firewall or VPC to protect internal/core services.
- Validate user inputs to prevent malicious data entry.

Not included in this version:
- API pagination for messages (due to time constraints).
- Unit testing (due to time constraints).
- There may be bugs present as not all scenarios have been handled.