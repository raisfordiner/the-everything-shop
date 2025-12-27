The deployment of "The Everything Shop" is designed for portability, scalability, and security using containerization. The system orchestrates multiple services ensuring a seamless production environment.

=== Deployment Architecture
The system utilizes *Docker Compose* to manage a collection of interacting containers. A *Traefik Reverse Proxy* sits at the entry point of the cluster, handling routing, SSL termination (via Let's Encrypt), and load balancing.

==== Core Services
The production `docker-compose.prod.yml` defines the following critica services. In a production environment, services *pull pre-built versioned images* from a container registry rather than building from source at runtime.

- *Traefik*: Acts as the Edge Router, automatically discovering services via Docker labels. It manages HTTPS certificates and routes traffic to the appropriate container based on hostnames.
- *App (Backend)*: Runs the Node.js/Express API using a pre-built image. It runs database migrations (`npx prisma migrate deploy`) upon startup.
- *Frontend*: Serves the React SPA using *Nginx*. The image contains the pre-compiled static assets (`/dist`), ensuring fast startup and consistent deployments.
- *DB (PostgreSQL)*: The primary relational database, persisting data to a docker volume. It includes a healthcheck to ensure dependent services wait until it is ready.
- *S3 (MinIO)*: An S3-compatible object storage service for handling product images and file uploads.
- *Mailhog*: A simulated SMTP server for testing email notifications without sending actual emails.

=== Docker Configuration

==== Production Compose Stack
The production stack relies on pulling optimized images. This separation of concerns ensures that the deployment environment is not cluttered with build tools.

```yaml
# docker-compose.prod.yml
services:
  app:
    image: {registry}/tes-backend:latest
    restart: unless-stopped
    env_file: .env
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`${DOMAIN}`) && PathPrefix(`/api`)"
      - "traefik.http.routers.backend.entrypoints=websecure"

  frontend:
    image: {registry}/tes-frontend:latest
    restart: unless-stopped
    labels:
      - "traefik.http.routers.frontend.rule=Host(`${DOMAIN}`)"
```

==== Immutable Artifacts (Dockerfile)
Although images are pulled in production, they are built from immutable definitions using multi-stage Dockerfiles.

```dockerfile
# backend/prod.Dockerfile (Snippet)
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
# ... copy prisma and package.json ...
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
```

=== Environment Configuration
Sensitive configuration is decoupled from the code using `.env` files.
- *`POSTGRES_USER` / `POSTGRES_PASSWORD`*: Database credentials.
- *`ACME_EMAIL`*: Email used for Let's Encrypt certificate registration.
- *`DOMAIN_NAME`*: The base domain for routing.

=== Deployment Diagram (Textual Representation)
The architecture follows this flow:

1. *Client Request* (Browser) -> *Internet*
2. *Traefik* (Port 443) -> *Route Matching*
  - Host `localhost` -> *Frontend* (Nginx)
  - Path `/api` -> *Backend* (Node.js)
  - Host `obj.storage...` -> *MinIO* (S3)
  - Host `mail...` -> *MailHog*
3. *Backend* -> *DB* (PostgreSQL 5432)
4. *Backend* -> *S3* (MinIO 9000)
