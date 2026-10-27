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

