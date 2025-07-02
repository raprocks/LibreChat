# Assignment README

## How to Run the App

Everything is set up using Docker Compose. To start both the backend and frontend, after cloning the repo, simply run:

```sh
# create .env file ( no changes needed as this works by default )
cp .env.example .env

# Start the app (frontend & backend)
docker compose up
```

The frontend is automatically built and served from the backend container. No separate command is needed for the frontend if you use Docker Compose.

Signup to create a new account and the todo panel should be on the right side panel.

### Cleanup Commands
To stop and clean up all containers, networks, and volumes created by Docker Compose, you can run:

```sh
# Stop and remove containers, networks, and volumes
docker compose down --volumes --remove-orphans
# Remove unused Docker resources
docker system prune -f
```

## Assumptions
- The todo feature is built into the side panel so users can keep track of their todos.
- Todos are user-specific and only visible to the user who created them.
- Users require permission to use the todo feature (permission is granted by default) to support RBAC.

## Deployment
The app is not deployed online. but can be done simply by deploying using docker or a container orchestartion framework.

## Notes
- Could not add shadcn UI due to dependency version conflicts with existing client packages. but the styles used are inline with the design of the webapp client.

## Changes
1. API Route Addition
2. Schema in data-schemas package
3. API connector in data-provider package
4. UI Components in react client
5. mongodb instance being used is exposed to inspect database
6. changes were made to the docker compose to build and use the code in the repository instead of the official backend repository of the project.

## Work Left to be Done
- [ ] add translations
- [ ] deployment