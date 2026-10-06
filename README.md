# DevSecOps Portfolio

## 1. Ubuntu Server and SSH

Ubuntu Server 26.04 was installed and SSH was configured.

```bash
sudo apt update
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh
```

![SSH configuration](images/01-ssh.png)

---
## 2. SSH Connection

The SSH connection was tested from the physical machine.

```bash
ssh username@IP_ADDRESS
```

![SSH connection](images/02-ssh-connection.png)

---
