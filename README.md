# DevSecOps Portfolio

## VII. Automation with Ansible

### 25. Install Ansible on the Administration VM

The directory structure is located in `ansible/`:

```text
ansible/
├── ansible.cfg
├── inventory.ini
├── README.md
└── playbooks/
    ├── install-package.yml
    └── install-docker.yml
```

On the VM dedicated to administration:

```bash
sudo apt update
sudo apt install -y ansible openssh-client
ansible --version
```

![Install Ansible](images/25-install-ansible.png)

### 26. Configure the Inventory and Test SSH Communication

Edit `inventory.ini`: replace the IP address and `ansible_user` with the actual values of the target VM. SSH key-based authentication must be configured beforehand. Example to adapt:

```bash
ssh-copy-id houssem@192.168.122.125
ssh houssem@192.168.122.125
ansible all -m ping
```

Expected result if the connection is successful:

```text
ubuntu-target | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

This result is illustrative. Capture the actual output from your terminal.

![Test Ansible Ping](images/26-test-ansible-ping.png)

### 27. Install curl and git

From the `ansible/` directory:

```bash
ansible-playbook -i inventory.ini playbooks/install-package.yml
```

![Install Package](images/27-install-package.png)

### 28. Install Docker on an Ubuntu VM

```bash
ansible-playbook -i inventory.ini playbooks/install-docker.yml
ansible -i inventory.ini portfolio_servers -m command -a "docker --version"
ansible -i inventory.ini portfolio_servers -m command -a "docker compose version"
```

![Install Docker](images/28-install-docker.png)

The playbook installs Docker and enables the service. Ensure that the package names in the playbook match the Docker installation method used on your target VM.

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
├── app/
├── components/
├── data/
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

![Express API Server Started](images/29-api-server.png)

### 30. Create the Health Check Route

A health-check endpoint was added to the Express API to verify that the server is running and responding to HTTP requests.

**Endpoint:** `GET /api/health`

**Implementation:**

The route returns an HTTP `200 OK` status and a JSON response indicating that the API is operational.

**Test command:**

```bash
curl -i http://localhost:4000/api/health
```

**Expected response:**

```json
{
  "status": "ok",
  "message": "API is running"
}
```

Capture the terminal showing the `curl` command and the actual HTTP status and JSON response.

![API Health Check](images/30-api-health.png)

### 31. Create the Profile Route

A new endpoint, `GET /api/profile`, was added to the Express API to provide the main portfolio information in JSON format.

**Endpoint:** `GET /api/profile`

**Test command:**

```bash
curl -i http://localhost:4000/api/profile
```

**Expected result:** The API returns HTTP `200 OK` and a JSON object containing the portfolio owner's name, professional title, description, skills, projects, and GitHub profile URL.

Capture the terminal showing the request to `/api/profile` and the complete JSON response returned by the API.

![Profile API Response](images/31-api-profile.png)

### 32. Create the Projects Route

A new endpoint, `GET /api/projects`, was added to the Express API to return the list of projects displayed in the portfolio.

**Endpoint:** `GET /api/projects`

**Test command:**

```bash
curl -i http://localhost:4000/api/projects
```

**Expected result:** The API returns HTTP `200 OK` and a JSON array containing project information, including project names, descriptions, technologies, and repository links where available.

Capture the terminal showing the request to `/api/projects` and the JSON array returned by the API.

![Projects API Response](/images/32-api-projects.png)

### 33. Create the Skills Route

A new endpoint, `GET /api/skills`, was added to the Express API to return the technical skills displayed in the portfolio.

**Endpoint:** `GET /api/skills`

**Test command:**

```bash
curl -i http://localhost:4000/api/skills
```

**Expected result:** The API returns HTTP `200 OK` and a JSON array containing skill categories and their corresponding skills.

Capture the terminal showing the request to `/api/skills` and the JSON response returned by the API.

![Skills API Response](/images/33-api-skills.png)

### 34. Integrate the Projects API into Next.js

The Next.js frontend was modified to retrieve project data from the Express API instead of relying exclusively on local data.

A reusable API function, `getProjects()`, was created in `lib/api.ts`. It fetches project information from the `GET /api/projects` endpoint. The `components/Projects.tsx` component uses this function to display the project list and is reused on both the homepage (`app/page.tsx`) and the dedicated projects page (`app/projects/page.tsx`).

The dynamic project detail page (`app/projects/[project-name]/page.tsx`) also retrieves project information from the same API function to display individual project details.

Capture the browser displaying the Projects section with project cards populated from the Express API. For additional evidence, include the browser's Network tab showing the successful `/api/projects` request.

![Projects API Integration](/images/34-projects-integration.png)

**Result:** The projects are retrieved through a reusable API function, reducing duplicated code and separating the frontend presentation from the backend data source.

### 35. Integrate the Skills API into Next.js

The Next.js Skills component was modified to retrieve skills from the Express API instead of importing them directly from the local `data/skills.ts` file.

A reusable `getSkills()` function was added to `lib/api.ts`. It calls the `GET /api/skills` endpoint, and `components/Skills.tsx` renders the returned skills using the existing CSS classes.

The Skills component is wrapped in a React `Suspense` boundary to provide a loading fallback while the uncached API request is being processed.

**Test command:**

```bash
curl -i http://localhost:4000/api/skills
```

Capture the portfolio's Skills section in the browser, showing the skills returned by the Express API. For additional evidence, include the successful `/api/skills` request in the browser's Network tab.

![Skills API Integration](images/35-skills-integration.png)

**Result:** The Skills section now retrieves its data from the Express API through a reusable function, keeping data access separate from frontend presentation.