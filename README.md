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