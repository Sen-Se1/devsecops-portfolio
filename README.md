# DevSecOps Portfolio

A modern portfolio website showcasing DevOps skills and projects, built with Next.js and deployed using Ansible automation.

## 📋 Overview

This portfolio demonstrates DevOps expertise through:
- A responsive Next.js application showcasing skills and projects
- Automated deployment using Ansible playbooks
- CI/CD pipeline with Jenkins
- Containerization with Docker and Nginx

## 🛠️ Technologies Used

### Frontend
- **Next.js 16.4.0** - React framework for production-ready applications
- **React 19.3.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework

### DevOps & Deployment
- **Ansible** - Configuration management and deployment automation
- **Docker** - Containerization
- **Nginx** - Reverse proxy and web server
- **PM2** - Process manager for Node.js applications
- **Jenkins** - Continuous Integration/Continuous Deployment
- **Git** - Version control

## 📁 Project Structure

```
devsecops-portfolio/
├── app/                    # Next.js application (App Router)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── projects/           # Project routes
├── components/             # Reusable UI components
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Projects.tsx
│   └── Skills.tsx
├── data/                   # Data files for projects and skills
│   ├── projects.ts
│   └── skills.ts
├── images/                 # Screenshots and media
├── public/                 # Static assets
├── portfolio-deploy/       # Ansible deployment scripts
│   ├── ansible.cfg         # Ansible configuration
│   ├── site.yml            # Main playbook
│   ├── inventory/          # Target server configuration
│   │   └── hosts.ini
│   ├── group_vars/         # Variables for all hosts
│   │   └── all.yml
│   └── roles/              # Ansible roles
│       ├── app/            # Application deployment
│       ├── common/         # Common system setup
│       ├── nginx/          # Nginx configuration
│       └── nodejs/         # Node.js and PM2 setup
├── Jenkinsfile             # CI/CD pipeline definition
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md
```

## 🚀 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Sen-Se1/devsecops-portfolio.git
   cd devsecops-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 🔧 Deployment with Ansible

The portfolio can be deployed to a target server using the Ansible playbooks in the `portfolio-deploy/` directory.

### Prerequisites
- Ansible installed on your control machine
- SSH access to the target server
- Target server running Ubuntu/Debian

### Configuration

1. Update `portfolio-deploy/group_vars/all.yml`:
   ```yaml
   app_repo: "https://github.com/your-username/your-repo.git"
   app_version: "main"  # or specific branch/tag
   app_dir: "/opt/portfolio"
   app_user: "deploy"
   app_port: 3000
   node_major: 20
   server_name: "your-domain.com"
   ```

2. Update `portfolio-deploy/inventory/hosts.ini`:
   ```ini
   [web]
   your-server ansible_host=your-server-ip ansible_user=your-ssh-user
   ```

### Run Deployment

```bash
# From the portfolio-deploy directory
ansible-playbook -i inventory/hosts.ini site.yml
```

### What the Deployment Does

The Ansible playbook (`site.yml`) executes these roles in order:

1. **common** - Sets up the server:
   - Updates apt cache
   - Installs essential packages (git, curl, build-essential)
   - Creates application user and directory

2. **nodejs** - Installs Node.js and PM2:
   - Adds NodeSource repository
   - Installs Node.js
   - Installs PM2 globally

3. **app** - Deploys the application:
   - Clones the Git repository
   - Installs npm dependencies
   - Builds the Next.js application
   - Starts the application with PM2

4. **nginx** - Configures Nginx as a reverse proxy:
   - Installs Nginx
   - Deploys custom Nginx configuration
   - Enables the site and disables default
   - Validates and starts Nginx service

## 🔄 CI/CD Pipeline

The project includes a Jenkinsfile for automated building:

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'Next-CV',
                    url: 'https://github.com/Sen-Se1/devsecops-portfolio.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build Next.js') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

## 📸 Screenshots

Screenshots of the portfolio can be found in the `images/` directory.

## 📞 Contact

For questions or collaboration opportunities, please reach out through the contact form on the portfolio website.

## 📄 License

This project is open source and available under the MIT License.