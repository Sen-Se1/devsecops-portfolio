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

Save the screenshot as:

`images/44-vagrant-ansible-automation.png`

Add the screenshot to this README:

![Complete Vagrant and Ansible automation](images/43-vagrant-ansible-automation.png)

**Result:** Vagrant and Ansible work together to automate VM provisioning, Docker installation, and portfolio deployment. The goal is to launch the complete workflow using a single `vagrant up` command.