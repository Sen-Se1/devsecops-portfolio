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