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