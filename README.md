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
- Implement backend API: 2 hours
- Implement ReactJS app using Vite, Redux Toolkit, RTK Query: 5 hours
- Handle web socket data transfer between backend and frontend: 2 hours
- Testing and bug fixings: 1 hour
- Write README: 0.5 hour

Assumptions made:
- User can only join 1 room at a time.
- There is no security handled. All APIs are public and users don't need any credentials to join and view everything.

Compromises made:
- All messages (of a room) are fetched without pagination/lazy loading. Should have handled that if I have time.
- Didn't handle edge cases. For example, users shutting down the browser instantly, which can cause some unexpected errors.
- Didn't handle logging, which is very important in a real-world application.
- Unit tests were not implemented. Should have done that if I have time.

Go production checklist:
- Test coverage should be around 70-80% (or more depends on each project).
- Security testing. There must be some tools for this, including manual effort for complex cases.
- Cross browsers and cross devices testing.
- Monitoring and logging should be handled.
- Document changes for the production.

High concurrent users:
Honestly, I don't have experience in this part, never joined a social platform development or anything that requires it. Some basic things pop in my mind:
- Load balancing to distribute load.
- Caching for reducing load on the database.
- Database indexing for query optimization.

Ensure security:
- Probably apply multi-factor authentication.
- Use HTTPS to secure data between server and client.
- Use a firewall/VPC to hide internal/core services.
- Validate user inputs.

Did not include:
- API pagination for messages (not enough time).
- Unit testing (not enough time).
- There are bugs somewhere, probably. I didn't handle everything.