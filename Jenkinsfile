pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'devsecops-portfolio:latest'
        API_IMAGE = 'devsecops-api:latest'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'Activite-4',
                    url: 'https://github.com/Sen-Se1/devsecops-portfolio.git'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Frontend Tests') {
            steps {
                sh 'npm test -- --runInBand'
            }
        }

        stage('Install API Dependencies') {
            steps {
                dir('api') {
                    sh 'npm ci'
                }
            }
        }

        stage('API Tests') {
            steps {
                sh '''
                    set -eu

                    echo "Checking Docker..."
                    docker --version
                    docker compose version

                    echo "Starting PostgreSQL..."
                    docker compose up -d postgres

                    echo "Waiting for PostgreSQL..."
                    ready=false

                    for i in $(seq 1 30); do
                        if docker compose exec -T postgres pg_isready; then
                            ready=true
                            break
                        fi
                        sleep 2
                    done

                    if [ "$ready" != "true" ]; then
                        echo "ERROR: PostgreSQL is not ready."
                        exit 1
                    fi

                    echo "Ensuring the test database exists..."
                    docker compose exec -T postgres sh -c '
                        if ! psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
                            -tAc "SELECT 1 FROM pg_database WHERE datname = '\\''portfolio_test'\\''" \
                            | grep -q 1; then
                            psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
                                -c "CREATE DATABASE portfolio_test OWNER $POSTGRES_USER;"
                        fi
                    '

                    echo "Building the API test image..."
                    docker build \
                        -f api/Dockerfile.test \
                        -t devsecops-api-test:latest \
                        ./api

                    echo "Finding the Compose network..."
                    NETWORK=$(docker inspect \
                        "$(docker compose ps -q postgres)" \
                        --format '{{range $name, $value := .NetworkSettings.Networks}}{{$name}}{{end}}')

                    if [ -z "$NETWORK" ]; then
                        echo "ERROR: Could not determine the PostgreSQL Docker network."
                        exit 1
                    fi

                    echo "Running API tests..."
                    docker run --rm \
                        --network "$NETWORK" \
                        -e DATABASE_URL="postgresql://portfolio_user:portfolio_pass@postgres:5432/portfolio_test?schema=public" \
                        devsecops-api-test:latest \
                        sh -c 'npx prisma migrate deploy && npm test'
                '''
            }
        }
        
        stage('Build Next.js') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t "$FRONTEND_IMAGE" .
                    docker build -t "$API_IMAGE" ./api
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Frontend tests, API tests, Next.js build, and Docker image builds completed.'
        }

        failure {
            echo 'FAILURE: The pipeline failed. Check the stage logs to identify the problem.'
        }

        always {
            echo 'Jenkins pipeline execution finished.'
        }
    }
}