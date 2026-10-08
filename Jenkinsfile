pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Sen-Se1/devsecops-portfolio.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('devsecops-portfolio-next') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Next.js') {
            steps {
                dir('devsecops-portfolio-next') {
                    sh 'npm run build'
                }
            }
        }
    }
}