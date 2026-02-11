# Backend

This folder contains the Spring Boot backend for the Legal Aid Matching Platform.

Overview
- Implements API endpoints, business logic, data access, authentication/authorization, the matching engine, integrations (NGO Darpan, Bar Council, external directories), WebSocket messaging, notifications, and admin/verification tooling.

For collaborators (who to contact / responsibilities)
- Backend developers: implement REST APIs, domain models, services, and database migrations.
- Integration engineers: implement connectors to NGO Darpan, Bar Council APIs and implement import jobs for public directories.
- Security owners: implement JWT access + refresh token flows, OAuth2 providers, CSRF protections, and review WebSocket auth.
- DevOps: containerization, deployment manifests, DB provisioning (Postgres), and observability (metrics/logs).

Quick start (development)
- Install JDK 17+ and Maven (or use the bundled `./mvnw`).
- Configure a local development database (SQLite for quick dev or a local Postgres instance) and set environment variables. Example `.env` keys:
	- `SPRING_DATASOURCE_URL` (jdbc:postgresql://... or jdbc:sqlite:dev.db)
	- `SPRING_DATASOURCE_USERNAME`
	- `SPRING_DATASOURCE_PASSWORD`
	- `JWT_SECRET`
	- `OAUTH_GOOGLE_CLIENT_ID` / `OAUTH_GOOGLE_CLIENT_SECRET` (optional)
	- `GOOGLE_MAPS_API_KEY`
- Run locally:

	mvn spring-boot:run

Build and test
- Build artifact: `mvn clean package` (produces an executable JAR).
- Run tests: `mvn test`.

Database & migrations
- Production DB: PostgreSQL. Development: SQLite may be used for lightweight local runs.
- Migrations: use Flyway or Liquibase (check `pom.xml` for configured tool). To run migrations locally, run the migration CLI or rely on Spring Boot auto-migration on startup.

Authentication & Authorization
- Primary auth: JWT (access + refresh tokens). Implement secure refresh-token storage and revocation.
- Optional OAuth2 providers: Google and GitHub for federated login.
- Roles: `CITIZEN`, `LAWYER`, `NGO`, `ADMIN` — enforce role-based access on endpoints.

Key services to implement
- Case ingestion: accept plain-language case submissions and normalize into structured case model.
- Matching engine: match cases to lawyers/NGOs using expertise tags, geolocation proximity, and availability.
- Integrations: scheduled sync jobs to import and refresh registry data from NGO Darpan, Bar Council, and international directories.
- Real-time messaging: WebSocket endpoints for secure chat; include message persistence and audit trail.
- Notifications: push events for matches, messages, and appointments (email / in-app / push as implemented).
- Admin tools: verification flows for lawyers/NGOs, monitoring endpoints, and audit logs.

APIs & Contract
- Keep REST contracts documented (OpenAPI/Swagger). Store API spec in `docs/` or enable Springdoc/OpenAPI for automatic generation.

Testing & quality
- Unit tests for services and controllers, integration tests that spin up an in-memory DB.
- End-to-end tests for critical flows (registration, case submission, matching, messaging).
- Static analysis and security scans (SpotBugs, SonarQube) are encouraged.

Development conventions
- Follow existing package structure and naming conventions.
- Keep controller-layer thin; put business logic in services.
- Write small, focused pull requests with descriptive messages and link to the related issue.

Deployment notes
- Production DB is PostgreSQL; ensure `application-prod.yml` is configured with the prod datasource and secrets come from environment variables or a secrets manager.
- Include health checks and readiness/liveness endpoints for Kubernetes or container orchestrators.

Where to find more info
- API docs: enable or open `http://localhost:8080/swagger-ui.html` when running locally (if configured).
- See the project root for CI/CD configuration and deployment manifests.

Contact
- For questions about backend design or APIs, open an issue or contact the repository maintainers.
