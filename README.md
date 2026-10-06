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

## 3. Docker Installation

Docker was installed on the Ubuntu Server.

```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable docker
sudo systemctl start docker
docker --version
```

![Docker installation](images/03-docker.png)

---

## 4. Jenkins Installation


Jenkins was deployed as a Docker container.

```bash
docker pull jenkins/jenkins:lts-jdk21
```

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk21
```

Check the container:

```bash
docker ps
```

Get the initial Jenkins password:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Jenkins was accessed from the physical machine:

```text
http://IP_ADDRESS:8080
```

![Jenkins](images/04-jenkins.png)

---

## 5. Mini CV

A one-page CV was created using HTML5, CSS3 and JavaScript.

The project was managed with Git and published on GitHub.

![Mini CV](images/05-mini-cv.png)

**GitHub:** `https://github.com/Sen-Se1/devsecops-portfolio`

---

