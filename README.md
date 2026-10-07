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

## 6. GitHub SSH

An SSH key was created and added to GitHub.

```bash
ssh-keygen -t ed25519 -C "your@email.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```

SSH connection was tested:

```bash
ssh -T git@github.com
```

The repository was configured to use SSH:

```bash
git remote set-url origin git@github.com:Sen-Se1/devsecops-portfolio.git
git remote -v
```

![GitHub SSH](images/06-github-ssh.png)

---

# DevSecOps Portfolio

## 7. DevSecOps Portfolio

The Mini CV was improved into a small DevSecOps Portfolio.

### Improvements

- Added a navigation bar.
- Added About section.
- Added Skills section.
- Added Projects section.
- Added Experience section.
- Added Contact section.
- Improved the design and responsive layout.

![DevSecOps Portfolio](images/07-portfolio.png)

---

## 8. DevSecOps Skills

A DevSecOps Skills section was added with the main technologies used in the project.

Technologies:
- Git
- Docker
- Jenkins
- Kubernetes
- Ansible
- Terraform
- Argo CD

![DevSecOps Skills](images/08-skills.png)

---

## 9. Dynamic Projects

The Projects section is generated dynamically using JavaScript from an array of objects.

### JavaScript

```javascript
const projects = [
    {
        title: "Mini CV",
        description: "One-page CV developed using HTML5, CSS3 and JavaScript."
    },
    {
        title: "DevOps Lab",
        description: "Practical environment using Linux, Git, Docker and CI/CD."
    }
];
```

![Dynamic Projects](images/09-projects.png)

---

# Dockerization

## 10. Dockerfile

A Dockerfile was created to serve the portfolio using Nginx.

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 11. Docker Image

The Docker image was built with the name `cv-docker`.

```bash
docker build -t cv-docker .
docker images
```

![Docker image](images/10-docker-build.png)

---

## 12. Docker Container

The portfolio was started in a Docker container.

```bash
docker run -d --name cv-container -p 8080:80 cv-docker
docker ps
```

The portfolio was accessed from the physical machine:

```text
http://IP_ADDRESS:8080
```

![Docker container](images/11-docker-run.png)

---