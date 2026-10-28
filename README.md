# DevSecOps Portfolio

## XI. Automated infrastructure with Vagrant + Ansible

### 43. Deploy the Portfolio with Ansible

#### Objective

Automate the deployment of the DevSecOps Portfolio on an Ubuntu VM using Ansible and Docker Compose.

#### Execute the Ansible Playbook

From the `ansible/` directory on the administration VM, run:

```bash
ansible-playbook playbooks/deploy-portfolio.yml
```

The deployment playbook performs the following operations:

- Installs the required packages.
- Installs and configures Docker.
- Clones the portfolio repository from GitHub.
- Builds the frontend and API Docker images.
- Deploys the containers using Docker Compose.
- Verifies that the frontend is accessible over HTTP.

#### Verify the Deployment

Check the status of the deployed containers:

```bash
ansible portfolio_servers -b -m shell -a "cd /opt/devsecops-portfolio && docker compose ps"
```

Test the frontend from the target VM:

```bash
ansible portfolio_servers -b -m shell -a "curl -I http://127.0.0.1:3000"
```

**Expected result:** The frontend responds with HTTP `200 OK`, and both the frontend and API containers are running.

#### Access the Portfolio

Open the following address in a browser on a machine that can reach the target VM:

**http://192.168.122.125:3000**

#### Portfolio Screenshot

After confirming that the portfolio loads successfully, capture the browser displaying the homepage.

![Portfolio successfully deployed using Ansible](images/42-ansible-portfolio-deployed.png)

### 44. Automate Ansible Provisioning with Vagrant

#### Objective

Modify the Vagrant configuration to automatically execute the Ansible playbook after the VM is created.

The objective is to automate the entire infrastructure deployment process with a single command.

#### Vagrant and Ansible Integration

An Ansible provisioner was added to the `Vagrantfile` to execute the existing deployment playbook automatically.

The provisioner runs:

```bash
ansible-playbook playbooks/deploy-portfolio.yml
```

The playbook installs the required packages, configures Docker, and deploys the frontend and API using Docker Compose.

#### Launch the Automation

From the directory containing the `Vagrantfile`, execute:

```bash
vagrant up --provider=libvirt
```

If the VM already exists, rerun the provisioning with:

```bash
vagrant provision
```

#### Automated Deployment Workflow

The complete workflow is:

1. **Vagrant:** Creates and starts the Ubuntu VM.
2. **Ansible:** Automatically executes the provisioning playbook.
3. **Package Installation:** Installs the required system packages.
4. **Docker Installation:** Installs and configures Docker.
5. **Application Deployment:** Builds the frontend and API Docker images and starts the containers using Docker Compose.
6. **Verification:** Checks whether the frontend is accessible.

#### Verify the Deployment

Check the VM status:

```bash
vagrant status
```

Check the running containers inside the VM:

```bash
docker ps
```

Open the portfolio in a browser:

**http://192.168.122.125:3000**

#### Screenshot: Complete Automation

Capture the terminal output showing the execution of `vagrant up`, including the successful Ansible provisioning and deployment tasks.

![Complete Vagrant and Ansible automation](images/43-vagrant-ansible-automation.png)

### 45. VM Destruction and Automated Redeployment

#### Objective

Verify that the infrastructure is fully automated by destroying the existing Vagrant virtual machine and recreating it from scratch. The Portfolio application must be automatically redeployed without manual configuration.

#### 1. Destroy the Existing VM

Run the following command:

```bash
vagrant destroy -f
```

Verify that the virtual machine has been removed:

```bash
vagrant status
```

Expected result: the default virtual machine is reported as `not created`.

#### 2. Recreate the VM

Run:

```bash
vagrant up --provider=libvirt
```

Vagrant recreates the Ubuntu virtual machine and automatically runs the configured provisioning steps.

The provisioning process includes:

- DNS configuration.
- Ansible execution.
- Installation of required packages.
- Docker Engine and Docker Compose installation.
- Portfolio repository deployment.
- Docker image building and container startup.
- Application availability checks.

#### 3. Verify the Deployment

Check the VM status:

```bash
vagrant status
```

Check the installed Docker version:

```bash
vagrant ssh -c "docker --version"
```

Check the application containers:

```bash
vagrant ssh -c "docker compose -f /opt/devsecops-portfolio/docker-compose.yml ps"
```

Check the frontend HTTP response:

```bash
vagrant ssh -c "curl -I http://127.0.0.1:3000"
```

Check the API health endpoint:

```bash
vagrant ssh -c "curl http://127.0.0.1:4000/api/health"
```

#### 4. Expected Results

- The original VM is successfully destroyed.
- A new VM is created by Vagrant.
- Ansible automatically configures the new VM.
- Docker and Docker Compose are installed.
- The Portfolio containers start successfully.
- The frontend returns an HTTP 200 response.
- The API health endpoint responds successfully.

#### 5. Evidence

Add screenshots demonstrating:

1. The successful execution of `vagrant destroy -f`.
2. The successful execution of `vagrant up --provider=libvirt`.
3. The Ansible provisioning recap showing `failed=0`.
4. The running Docker containers.
5. The frontend responding with HTTP 200.
6. The API health endpoint response.

#### Conclusion

This test validates the automated provisioning and redeployment process. The Portfolio can be redeployed on a newly created virtual machine using Vagrant and Ansible, reducing the need for manual configuration.

## XII. API evolution and security

### 46. Implement and Secure the Contact API Endpoint

#### Objective

Implement a `POST /api/contact` endpoint that allows the Portfolio contact form to submit information to the Express backend.

#### Endpoint

| Property | Value |
|---|---|
| Method | `POST` |
| Path | `/api/contact` |
| Content-Type | `application/json` |
| Success status | `201 Created` |
| Validation error | `400 Bad Request` |

#### Request example

```bash
curl -i -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Hello, I would like to contact you."
  }'
```

#### Request body

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Hello, I would like to contact you."
}
```

#### Successful response

**HTTP status:** `201 Created`

```json
{
  "success": true,
  "message": "Contact message received successfully."
}
```

#### Validation error example

When the email address is invalid, the API returns `400 Bad Request`.

```json
{
  "success": false,
  "error": "Invalid email address."
}
```

#### Security and validation

The endpoint implements the following checks:

- JSON request body size limited to 10 KB.
- Required fields: `name`, `email`, and `message`.
- Input type validation.
- Trimming of leading and trailing whitespace.
- Email format validation.
- Maximum field lengths: 100 characters for the name, 254 for the email address, and 5,000 for the message.

#### Current limitations

The endpoint validates and acknowledges contact submissions, but it does not yet persist messages in a database or send email notifications. A database or email integration is required to complete the contact workflow.

#### Verification

Test the endpoint with `curl` and verify that:

1. A valid request returns `201 Created`.
2. An invalid email address returns `400 Bad Request`.
3. Missing required fields return `400 Bad Request`.

### 47. Connect the Next.js Contact Form to the Express API

**Objective:** Connect the Portfolio's Next.js contact form to the Express API so that user-submitted information is sent to the backend.

#### Implementation

The contact form allows users to enter:
- Their name.
- Their email address.
- Their message.

When the user submits the form, the Next.js frontend sends an HTTP `POST` request to the Express API endpoint `/api/contact`.

API request logic is centralized in `lib/api.ts`, using the `submitContact()` function.

The form handles the API response and displays a success message when the submission succeeds or an error message if the request fails.

#### Verification

1. Start the Next.js frontend and Express backend.
2. Open the Portfolio in a browser.
3. Navigate to the Contact section.
4. Fill in the form fields.
5. Click **Send Message**.
6. Verify that a success message appears.
7. Confirm that the API returns a successful response.

#### Screenshot: Successful Contact Form Submission

Add a screenshot showing the contact form after a successful submission.

![Successful contact form submission](images/44-contact-form-success.png)

### 48. Validate API Input Using Zod

**Objective:** Implement strict validation of incoming API data using Zod to ensure that invalid requests are rejected by the backend.

#### Implementation

Zod is used to define a validation schema for the `POST /api/contact` endpoint.

The schema validates the following fields:
- **Name:** Required, non-empty string.
- **Email:** Required, valid email address.
- **Message:** Required, non-empty string.

The backend validates the request body before processing the submitted data. If the data does not match the schema, the API rejects the request and returns an appropriate HTTP error response.

#### Example of a Rejected Request

**Endpoint:** `POST /api/contact`

**Request body:**
```json
{
  "name": "",
  "email": "invalid-email",
  "message": ""
}
```

**Expected response:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "message",
      "message": "Message is required"
    }
  ]
}
```

**Expected HTTP status:** `400 Bad Request`

*Note: The response structure and validation messages above are examples. Your actual response must match the implementation in your Express API.*

#### Verification

1. Start the Express backend.
2. Send a `POST` request to `/api/contact` with invalid data.
3. Verify that the API returns `400 Bad Request`.
4. Confirm that the invalid request is rejected and is not processed as a valid contact submission.
5. Send a valid request to verify that valid data continues to be accepted.

### 49. Implement Centralized API Error Handling

**Objective:** Implement centralized error handling in the Express API to provide consistent error responses and simplify error management across endpoints.

#### Implementation

A centralized error-handling middleware was added to the Express backend.

The implementation includes:
- A custom `ApiError` class for application errors.
- A centralized error-handling middleware.
- A 404 handler for unknown routes.
- Integration with Zod validation errors.
- Consistent JSON error responses.
- Server-side logging for unexpected errors without exposing internal details to clients.

#### Example of an Error Response

**Request:**

`GET /api/unknown`

**HTTP Status:** `404 Not Found`

**Response:**

```json
{
  "success": false,
  "error": {
    "message": "Route not found: GET /api/unknown"
  }
}
```

#### Verification

1. Start the Express backend.
2. Request a nonexistent API endpoint.
3. Verify that the API returns HTTP `404`.
4. Submit invalid data to `POST /api/contact`.
5. Verify that validation errors are handled by the centralized middleware.
6. Confirm that all error responses follow a consistent JSON structure.

#### Expected Result

The API uses a centralized middleware to handle errors consistently. Invalid requests, unknown routes, and unexpected server errors return appropriate HTTP status codes and structured JSON responses.

### 50. Add Security HTTP Headers with Helmet

**Objective:** Improve the security of the Express API by adding protective HTTP response headers using Helmet.

#### Implementation

Helmet was installed and configured as global middleware in the Express application.

```javascript
const helmet = require("helmet");

app.use(helmet());
```

Helmet automatically configures several HTTP security headers to help protect the application against common web vulnerabilities.

#### Verification Using curl

The following command was used to inspect the response headers returned by the API:

```bash
curl -I http://localhost:4000/api/health
```

#### Security Headers

The following headers may be present in the response, depending on the Helmet configuration and environment:

- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Strict-Transport-Security`
- `Cross-Origin-Opener-Policy`

#### Example Output

![Helmet](images/45-helmet.png)

*Note: This is an illustrative excerpt. Replace it with the actual output obtained from your API.*

#### Expected Result

The Express API returns security-related HTTP headers configured by Helmet. The headers can be inspected using `curl -I`, helping verify that the security middleware is active.

### 51. Implement Rate Limiting for Sensitive API Routes

**Objective:** Protect sensitive API endpoints, especially `POST /api/contact`, against excessive requests and repeated contact form submissions.

#### Implementation

The `express-rate-limit` package was installed and configured as middleware for the contact endpoint.

The rate limiter allows a maximum of five requests per client within a 15-minute window.

When the limit is exceeded, the API returns HTTP `429 Too Many Requests` with a JSON error response.

#### Configuration

- **Protected endpoint:** `POST /api/contact`
- **Request limit:** 5 requests
- **Time window:** 15 minutes
- **Rate-limit response:** `429 Too Many Requests`

#### Example of a Rate-Limit Response

After exceeding the configured request limit, the API returns:

**HTTP Status:** `429 Too Many Requests`

![Rate Limit](images/46-rate-limit.png)

#### Verification

1. Start the Express backend.
2. Submit five valid requests to `POST /api/contact`.
3. Send an additional request within the same 15-minute window.
4. Verify that the additional request receives HTTP `429`.
5. Confirm that the response contains a JSON error message.
6. Verify that other API endpoints remain accessible.

#### Expected Result

The contact endpoint limits repeated requests and rejects additional submissions after the configured threshold is reached. This helps reduce automated spam and excessive requests to the contact API.

### 52. OWASP API Security Top 10 Risk Assessment

**Objective:** Review the OWASP API Security Top 10 (2023), identify the risks relevant to the Portfolio API, and document the existing and planned security controls.

#### Risk Assessment

The following table assesses the OWASP API Security Top 10 against the current Express.js API architecture.

| OWASP Risk | Relevance to the Portfolio API | Existing or Planned Mitigation | Status |
|---|---|---|---|
| **API1:2023 – Broken Object Level Authorization (BOLA)** | Currently limited because the profile, projects, and skills endpoints return static data without user-specific object access. This risk may become relevant if the API introduces user-owned resources or database records. | Implement object-level authorization checks for every operation involving user-provided resource identifiers. | Planned if resource access is introduced |
| **API2:2023 – Broken Authentication** | The current public endpoints do not implement authentication. This is acceptable for public portfolio information, but sensitive or administrative endpoints would require protection. | Introduce secure authentication and session or token validation if protected endpoints are added. | Planned if protected endpoints are introduced |
| **API3:2023 – Broken Object Property Level Authorization** | The contact endpoint accepts user-supplied properties. Unexpected fields are rejected by the strict Zod schema, reducing the risk of mass assignment. | Keep request schemas strict and return only explicitly approved response fields. Review data exposure whenever new endpoints are introduced. | Partially mitigated |
| **API4:2023 – Unrestricted Resource Consumption** | Excessive requests to the contact endpoint could consume server resources or generate spam. | A rate limiter is configured for `POST /api/contact`, allowing five requests per client within 15 minutes. The JSON body is also limited to 10 KB. Consider broader limits and monitoring for other resource-intensive endpoints. | Partially mitigated |
| **API5:2023 – Broken Function Level Authorization** | The current API exposes public read-only endpoints and a contact submission endpoint. Administrative or privileged functions are not currently implemented. | Enforce role-based authorization on any future administrative or privileged routes. | Planned if privileged endpoints are introduced |
| **API6:2023 – Unrestricted Access to Sensitive Business Flows** | Automated abuse of the contact form could generate spam or excessive submissions. | Apply rate limiting to `POST /api/contact`. Consider CAPTCHA or other anti-automation measures if abuse occurs. | Partially mitigated |
| **API7:2023 – Server Side Request Forgery (SSRF)** | No current endpoint is intended to fetch arbitrary URLs supplied by clients. The risk may arise if URL previews, webhooks, or remote-resource fetching are introduced. | Avoid fetching arbitrary user-provided URLs. If remote fetching is required, validate destinations and block access to internal and cloud metadata addresses. | No direct exposure identified in current routes; reassess when features change |
| **API8:2023 – Security Misconfiguration** | Incorrect security headers, permissive CORS settings, excessive request sizes, or exposed error details could weaken the API. | Helmet is enabled, the JSON request body is limited to 10 KB, and centralized error handling is implemented. Review CORS configuration and production settings. | Partially mitigated |
| **API9:2023 – Improper Inventory Management** | Undocumented, obsolete, or accidentally exposed endpoints could increase the attack surface. | Maintain an up-to-date API route inventory and README documentation. Review deployed endpoints and remove unused routes. | Documentation exists; inventory review planned |
| **API10:2023 – Unsafe Consumption of APIs** | This risk is currently limited because the API does not intentionally consume third-party API responses. It may become relevant if external integrations are added. | Validate external responses, handle failures safely, use HTTPS, and avoid trusting third-party data without verification. | No direct exposure identified in current routes; reassess when integrations are introduced |

#### Existing Security Controls

The API currently includes the following security measures:

- **Helmet:** Adds HTTP security headers.
- **Zod validation:** Validates contact form fields, enforces length limits, and rejects unexpected properties.
- **Centralized error handling:** Provides consistent error responses.
- **Request body limit:** Restricts JSON request bodies to 10 KB.
- **Rate limiting:** Limits `POST /api/contact` to five requests per client within a 15-minute window.
- **Route organization:** Separates endpoints into dedicated route modules, making the API easier to review and maintain.

#### Recommended Next Steps

1. Review and restrict CORS to the frontend origins that require access.
2. Test the contact endpoint's validation and rate-limiting behavior.
3. Verify that production errors do not expose stack traces or sensitive implementation details.
4. Introduce authentication and authorization before adding private or administrative functionality.
5. Maintain an inventory of exposed routes and review dependencies regularly.
6. Reassess the OWASP risks whenever new endpoints, databases, or third-party integrations are introduced.

**Conclusion:** The API already implements several useful security controls, but these controls do not eliminate every OWASP API Security Top 10 risk. Risks that depend on future functionality should be reassessed when that functionality is introduced.

## XIII. PostgreSQL database

### 53. Add a PostgreSQL Database Service

**Objective:** Add a PostgreSQL database service to the project's Docker Compose configuration and verify that the service starts correctly.

#### Implementation

A PostgreSQL service was added to `docker-compose.yml` with the following configuration:

- **Image:** `postgres:17`
- **Container name:** `portfolio-postgres`
- **Database:** `portfolio`
- **Database user:** `portfolio_user`
- **Internal port:** `5432`
- **Persistent storage:** `postgres_data` Docker volume
- **Restart policy:** `unless-stopped`
- **Health check:** `pg_isready`

Database credentials are configured through environment variables. The database data is stored in a named Docker volume to preserve it when the container is recreated.

#### Start the Database Service

Run the following commands from the project root:

```bash
docker compose up -d 
docker compose ps
```

#### Example of `docker compose ps` Output

The following output illustrates the expected result when PostgreSQL is running and healthy. Container IDs, port mappings, and status details may differ on the local machine.

![Postgres](images/47-postgres.png)

Replace this illustrative output with the actual output from your environment.

#### Verify Database Readiness

Execute:

```bash
docker compose exec postgres sh -c \
  'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Expected result:

```text
/var/run/postgresql:5432 - accepting connections
```

#### Persistence

PostgreSQL data is stored in the `postgres_data` named volume mounted at `/var/lib/postgresql/data`.

This volume allows database data to persist when the container is stopped or recreated. Removing the named volume, however, deletes the stored database data.

#### Expected Result

The PostgreSQL service starts successfully, reports a healthy status, accepts local connections from containers on the shared Docker network, and stores its data in a persistent Docker volume.

At this stage, adding PostgreSQL to Docker Compose does not automatically connect the Express API to the database. Application-level database integration can be implemented separately.

### 54. Persist Contact Form Messages in PostgreSQL

**Objective:** Modify the Express API to store contact form submissions in a PostgreSQL database.

#### Implementation

The Express API was integrated with PostgreSQL using the `pg` Node.js package.

A `contact_messages` table was created with the following columns:

| Column | Description |
|---|---|
| `id` | Unique message identifier |
| `name` | Contact's name |
| `email` | Contact's email address |
| `message` | Submitted message |
| `created_at` | Message creation timestamp |

The contact controller validates incoming data using Zod and inserts valid submissions into PostgreSQL using a parameterized SQL query.

Database connection settings are provided through environment variables. The API returns HTTP `201 Created` when a message is successfully stored and handles database errors through the centralized error middleware.

#### Verification

A test message was submitted to `POST /api/contact`.

The database was queried to verify that the submitted message was stored in the `contact_messages` table.

```sql
SELECT id, name, email, message, created_at
FROM contact_messages
ORDER BY created_at DESC;
```

#### Database Screenshot

The following screenshot shows the contact messages stored in PostgreSQL after successful form submissions.

![PostgreSQL contact messages](images/48-contact-messages-postgres.png)

#### Expected Result

Contact form submissions are validated by the Express API and persisted in PostgreSQL. Stored messages remain available after the API or database container is restarted, provided the PostgreSQL data volume is retained.

### 55. Database Migrations with Prisma

Prisma Migrate manages database schema changes using versioned SQL migration files.

#### Apply migrations

From the `api` directory, execute:

```bash
npx prisma migrate deploy
```

This command applies all pending migrations to the configured PostgreSQL database.

#### Create a new migration (development)

When the Prisma schema changes, create and apply a migration with:

```bash
npx prisma migrate dev --name migration_name
```

Replace `migration_name` with a descriptive name, such as `add_contact_messages`.

#### Check migration status

To check whether the database is up to date, run:

```bash
npx prisma migrate status
```

#### Docker deployment

The API Docker container automatically runs:

```bash
npx prisma migrate deploy
```

before starting the application. Migration files are stored in `api/prisma/migrations/` and must be committed to Git.

## XIV. Application tests

### 58. Tests applicatifs — API Express

The API uses Jest and Supertest to test Express routes automatically.

#### Installation

From the `api` directory, install the testing dependencies:

```bash
npm install --save-dev jest supertest
```

#### Execute the tests

Run the following commands from the project root:

```bash
cd api
npm test
```

#### Tested route

**Endpoint:** `GET /api/health`

The automated test verifies:
- The HTTP status code is `200`.
- The response contains `"status": "ok"`.
- The response contains `"message": "API is running"`.

#### Successful test results

The test execution completed successfully:

- Test suites: 1 passed.
- Tests: 1 passed.
- Snapshots: 0.

#### Screenshot

![Successful Express API tests](images/49-api-tests.png)

### 59. Tests automatisés de sécurité de l'API

#### Objectif

Des tests automatisés avec Jest et Supertest permettent de vérifier le comportement de l'API Express face à différentes requêtes invalides ou potentiellement malveillantes.

#### Scénarios testés

- **Route inexistante :** vérification du code HTTP `404`.
- **JSON malformé :** vérification du rejet de la requête avec le code HTTP `400`.
- **Entrée de type injection SQL :** vérification que la route de santé reste fonctionnelle.
- **Entrée très longue :** vérification que la requête ne provoque pas de plantage.
- **Corps JSON trop volumineux :** vérification du rejet avec le code HTTP `413`.

#### Commandes utilisées

Depuis le répertoire du projet :

```bash
cd api
npm test
```

#### Résultats des tests

Après exécution, les résultats doivent être reportés à partir de la sortie réelle de Jest.

| Vérification | Résultat attendu |
|---|---|
| Route inconnue | PASS — HTTP 404 |
| JSON malformé | PASS — HTTP 400 |
| Entrée de type injection | PASS — réponse contrôlée |
| Entrée très longue | PASS — pas de plantage |
| Corps JSON trop volumineux | PASS — HTTP 413 |

**Résultat réel :** à compléter après l'exécution de `npm test`.

#### Screenshot

![Successful Express API tests](images/50-api-tests.png)

### 60. Frontend → API → PostgreSQL Integration Tests

#### Objective

Verify the contact form submission workflow, from the frontend to the API and PostgreSQL database.

#### Tested Architecture

1. The `components/Contact.tsx` component collects the contact form data.
2. The `submitContact()` function in `lib/api.ts` sends an HTTP `POST /api/contact` request.
3. The Express API validates the submitted data using Zod.
4. The `contactController.js` controller uses Prisma to store the message.
5. PostgreSQL saves the message in the `contact_messages` table.

#### Test Scenarios

- **Valid contact submission:** Expect HTTP `201` and verify that the message is stored in PostgreSQL.
- **Invalid email submission:** Expect HTTP `400` and verify that no database record is created.
- **API health and security tests:** Run the existing automated tests to verify API availability and error handling.

#### Commands Used

Check the running Docker services:

```bash
docker compose ps
docker network ls
```

Create a dedicated test database:

```bash
docker compose exec postgres sh -c \
  'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE portfolio_test OWNER $POSTGRES_USER;"'
```

Build the test image:

```bash
docker build -f api/Dockerfile.test -t devsecops-api-test ./api
```

Run database migrations and automated tests. Replace `NOM_DU_RESEAU` with the actual Docker network name:

```bash
docker run --rm \
  --network NOM_DU_RESEAU \
  -e DATABASE_URL='postgresql://portfolio_user:portfolio_pass@postgres:5432/portfolio_test?schema=public' \
  devsecops-api-test \
  sh -c 'npx prisma migrate deploy && npm test'
```

> If your PostgreSQL credentials differ from the defaults in `docker-compose.yml`, update the connection string accordingly. Do not commit database passwords to the repository.

#### Test Results

Complete this section after running the tests:

- **Passed tests:** To be confirmed.
- **Failed tests:** To be confirmed.
- **Database persistence verification:** To be confirmed.
- **Browser-based frontend integration test:** To be confirmed.

#### Test Execution Screenshot

![Integration test results](images/51-api-integration-tests.png)

## XV. Jenkins : tests et images Docker

### 61. Jenkins Automated Tests and Docker Images

#### Objective

Configure Jenkins to automatically execute the frontend and API tests before building the Docker images.

#### Pipeline Stages

- **Frontend Tests:** Run the frontend test suite using Jest.
- **API Tests:** Run the API health, security, and integration tests.
- **Build Next.js:** Build the frontend application after the tests pass.
- **Build Docker Images:** Build the frontend and API Docker images.

The pipeline must fail if a required test fails. Docker image builds must not proceed after a failed test stage.

#### Screenshot

The following screenshot shows the Jenkins pipeline stages for the automated frontend and API tests.

![Jenkins automated frontend and API test stages](images/52-jenkins-tests.png)

### 62. Construction automatique des images Docker avec Jenkins

#### Objectif

Automatiser la construction des images Docker du frontend et de l'API à l'aide du pipeline Jenkins.

#### Étapes du pipeline

**1. Build Frontend Docker Image**

Jenkins utilise le `Dockerfile` situé à la racine du dépôt pour construire l'image `devsecops-portfolio:latest`.

**2. Build API Docker Image**

Jenkins utilise le `Dockerfile` du dossier `api/` pour construire l'image `devsecops-api:latest`.

Ces étapes sont exécutées automatiquement après les étapes précédentes du pipeline.

#### Capture d'écran

La capture suivante montre les étapes de construction des images Docker dans Jenkins.

![Construction automatique des images Docker dans Jenkins](images/52-jenkins-tests.png)

### 63. Tag des images Docker avec Git SHA

#### Objectif

Configurer Jenkins pour utiliser le SHA abrégé du commit Git comme tag des images Docker, puis vérifier automatiquement que les deux images ont été construites correctement.

#### Exemple d'images générées

Pour un commit dont le SHA abrégé est `a1b2c3d`, les images Docker générées sont :

```text
devsecops-portfolio:a1b2c3d
devsecops-api:a1b2c3d
```

> **Remarque :** `a1b2c3d` est un exemple. Jenkins utilise automatiquement le véritable SHA du commit traité.

#### Vérification des images Docker

Le stage `Verify Docker Images` vérifie :
- que le Git SHA est défini ;
- que l'image du frontend existe ;
- que l'image de l'API existe ;
- que les tags des deux images correspondent au Git SHA.

#### Capture d'écran du pipeline Jenkins

La capture suivante présente le stage de vérification des images Docker après leur construction.

![Vérification des images Docker dans Jenkins](images/53-verify-docker-images.png)

#### Vérification manuelle

Les images peuvent également être consultées sur la machine exécutant Docker avec la commande :

```bash
docker images | grep -E 'devsecops-portfolio|devsecops-api'
```

## XVI. Pipeline DevSecOps Jenkins

### 67. OWASP Dependency-Check

#### Objective

OWASP Dependency-Check is a Software Composition Analysis (SCA)
tool used to identify dependencies associated with publicly
disclosed vulnerabilities.

It complements `npm audit` in the Jenkins CI pipeline.

#### Dependencies analyzed

The pipeline analyzes the dependency lock files of:

- Frontend: `package-lock.json`
- Backend API: `api/package-lock.json`

#### Pipeline integration

The `OWASP Dependency-Check` stage:

1. Downloads the Dependency-Check Docker image.
2. Scans the frontend and backend dependency lock files.
3. Generates an HTML vulnerability report.
4. Archives the report as a Jenkins build artifact.

#### Generated report

The report is generated at:

`odc-reports/dependency-check-report.html`

To access it, open the corresponding Jenkins build and
download the archived report.

#### Example of a vulnerable dependency

For example, an older version of `lodash` may be associated
with a publicly disclosed vulnerability.

If a scan identifies a vulnerable dependency, the report
should be checked for:

- Dependency name
- Installed version
- CVE identifier, when available
- Severity
- Description of the vulnerability
- Recommended remediation

**Important:** This is an illustrative example, not a claim
that the current project contains a vulnerable version of
`lodash`. The actual dependency and CVE must be taken from
the generated report.

#### Security tools

| Tool | Purpose |
|---|---|
| Gitleaks | Detects exposed secrets |
| Semgrep | Performs static application security testing (SAST) |
| npm audit | Checks known vulnerabilities in npm dependencies |
| OWASP Dependency-Check | Identifies dependencies associated with known vulnerabilities |

#### Limitations

Dependency-Check results depend on the available vulnerability
data and the analyzers supported by the tool.

An empty report does not guarantee that the application is
free of vulnerabilities.
