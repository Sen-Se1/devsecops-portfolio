## VIII. Creating the Node.js / Express API

### 29. Create the Express API

A standalone REST API was created using Node.js and Express. It runs independently of the Next.js frontend and provides portfolio information in JSON format.

The project structure is organized as follows:

```text
devsecops-portfolio/
├── api/
│   ├── src/
│   │   └── server.js
│   ├── package.json
│   └── README.md
├── components/
│   ├── Projects.tsx
│   └── Skills.tsx
├── data/
│   ├── projects.ts
│   └── skills.ts
├── .env.example
└── README.md
```

To start the API, run the following commands from the project root:

```bash
cd api
npm install
npm start
```

The Express server listens on port `4000` and can be accessed independently of the Next.js frontend.

**Screenshot 29 — API Server Started**

![Express API Server Started](images/29-api-server.png)

The screenshot should show:
- The terminal opened in the `api/` directory.
- The command `npm start`.
- A successful server startup message indicating that the API is listening on port `4000`.

### 30. Create the Health Check Route

The API exposes the following endpoint:

```http
GET /api/health
```

This route checks whether the API is running.

Test the endpoint using:

```bash
curl http://localhost:4000/api/health
```

Expected response example:

```json
{
  "status": "ok",
  "message": "API is running"
}
```

The actual response depends on the implementation in `api/src/server.js`.

**Screenshot 30 — Health Check**

![API Health Check](images/30-api-health.png)

The screenshot should show:
- The `curl` command or the endpoint opened in a browser.
- The complete JSON response.
- The successful health status returned by the API.

### 31. Create the Profile Route

The API provides the portfolio owner's main information through:

```http
GET /api/profile
```

Test the endpoint:

```bash
curl http://localhost:4000/api/profile
```

The endpoint returns profile information in JSON format, such as the portfolio owner's name, professional title, biography, and other relevant details configured in the API.

Example response structure:

```json
{
  "name": "Your Name",
  "title": "Your Professional Title",
  "bio": "A short professional biography"
}
```

Replace the example values with the actual information returned by your implementation.

**Screenshot 31 — Profile API Response**

![Profile API Response](images/31-api-profile.png)

The screenshot should show:
- The request to `/api/profile`.
- The complete JSON response containing the portfolio profile.
- The actual profile data returned by Express.

### 32. Create the Projects Route

The API exposes the following endpoint:

```http
GET /api/projects
```

This route returns the list of projects displayed in the portfolio.

Test the endpoint:

```bash
curl http://localhost:4000/api/projects
```

The response should contain a JSON array of projects, including the fields defined by the API, such as project names, descriptions, technologies, and links.

**Screenshot 32 — Projects API Response**

![Projects API Response](images/32-api-projects.png)

The screenshot should show:
- The request to `/api/projects`.
- The JSON array returned by the API.
- Several actual portfolio projects and their corresponding information.

### 33. Create the Skills Route

The API provides the portfolio's technical skills through:

```http
GET /api/skills
```

Test the endpoint:

```bash
curl http://localhost:4000/api/skills
```

The endpoint returns the skills configured in the API, such as programming languages, frameworks, DevOps tools, and other technical competencies.

**Screenshot 33 — Skills API Response**

![Skills API Response](images/33-api-skills.png)

The screenshot should show:
- The request to `/api/skills`.
- The JSON response containing the skills.
- The actual skills returned by the API.

### 34. Integrate the Projects API into Next.js

The Next.js frontend was modified to retrieve project information from the Express API instead of relying exclusively on the local `data/projects.ts` file.

The API base URL is configured using an environment variable:

```env
API_URL=http://localhost:4000
```

The frontend requests the projects endpoint and renders the returned data in the existing Projects component.

Example server-side request:

```typescript
const response = await fetch(
  `${process.env.API_URL}/api/projects`,
  { cache: "no-store" }
);

if (!response.ok) {
  throw new Error("Failed to fetch projects");
}

const projects = await response.json();
```

Adapt this example to the existing component structure and data types. If the Projects component is a client component, use an appropriate client-side fetching approach instead.

Start the frontend separately:

```bash
npm run dev
```

Open `http://localhost:3000` in the browser and verify that the projects are displayed correctly.

**Screenshot 34 — Projects Retrieved from the API**

![Projects Integrated into Next.js](images/34-projects-integration.png)

The screenshot should show:
- The portfolio opened in the browser.
- The Projects section displaying the actual project cards.
- The corresponding API request succeeding, visible in the browser's Network tab or terminal logs.

This demonstrates the integration between the Next.js frontend and the Express backend.

### 35. Integrate the Skills API into Next.js

The Skills component was also modified to retrieve its data from the Express API instead of relying exclusively on the local `data/skills.ts` file.

The frontend requests:

```http
GET /api/skills
```

Example server-side request:

```typescript
const response = await fetch(
  `${process.env.API_URL}/api/skills`,
  { cache: "no-store" }
);

if (!response.ok) {
  throw new Error("Failed to fetch skills");
}

const skills = await response.json();
```

The returned data is passed to the existing Skills component and displayed in the portfolio.

**Screenshot 35 — Skills Retrieved from the API**

![Skills Integrated into Next.js](images/35-skills-integration.png)

The screenshot should show:
- The portfolio's Skills section in the browser.
- The technical skills displayed correctly.
- Evidence that the data is retrieved from the Express API, such as the successful `/api/skills` request in the browser's Network tab or terminal logs.

### Summary

The Express API provides four endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Check API availability |
| `GET /api/profile` | Retrieve portfolio profile information |
| `GET /api/projects` | Retrieve portfolio projects |
| `GET /api/skills` | Retrieve technical skills |

The API runs independently on port `4000`, while the Next.js frontend runs on port `3000`. The frontend consumes the projects and skills endpoints to display portfolio data.

This separation establishes a foundation for a more modular architecture, allowing the backend and frontend to be developed, tested, and deployed independently.