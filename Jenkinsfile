pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        API_TEST_IMAGE = 'devsecops-api-test:latest'
        TEST_DATABASE  = 'portfolio_test'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'Activite-4',
                    url: 'https://github.com/Sen-Se1/devsecops-portfolio.git'
            }
        }

        stage('Get Git SHA') {
            steps {
                script {
                    env.GIT_SHA = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()

                    env.FRONTEND_IMAGE =
                        "devsecops-portfolio:${env.GIT_SHA}"

                    env.API_IMAGE =
                        "devsecops-api:${env.GIT_SHA}"

                    echo "Git SHA: ${env.GIT_SHA}"
                    echo "Frontend image: ${env.FRONTEND_IMAGE}"
                    echo "API image: ${env.API_IMAGE}"
                }
            }
        }

        stage('Gitleaks Secret Scan') {
            steps {
                sh '''
                    set -eu

                    echo "===== GITLEAKS SECRET SCAN ====="

                    docker run --rm \
                        -v "$WORKSPACE:/repo" \
                        -w /repo \
                        ghcr.io/gitleaks/gitleaks:latest \
                        git --redact --verbose .
                '''

                echo 'Gitleaks scan completed successfully.'
            }
        }
        
        stage('Check Environment') {
            steps {
                sh '''
                    set -eu

                    echo "===== NODE.JS ====="
                    node --version
                    npm --version

                    echo "===== DOCKER ====="
                    docker --version
                    docker compose version

                    echo "===== GIT ====="
                    git --version

                    echo "===== DOCKER ACCESS ====="
                    docker info >/dev/null
                    echo "Docker daemon is accessible."
                '''
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Frontend Tests') {
            steps {
                sh '''
                    npm test -- \
                      --runInBand \
                      --ci \
                      --reporters=default \
                      --reporters=jest-junit
                '''
            }

            post {
                always {
                    junit(
                        testResults: 'junit.xml',
                        allowEmptyResults: true
                    )
                }
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

                    echo "===== START POSTGRESQL ====="

                    docker compose up -d postgres

                    echo "===== WAIT FOR POSTGRESQL ====="

                    ready=false

                    for i in $(seq 1 30); do
                        if docker compose exec -T postgres pg_isready; then
                            ready=true
                            break
                        fi

                        sleep 2
                    done

                    if [ "$ready" != "true" ]; then
                        echo "ERROR: PostgreSQL did not become ready."
                        docker compose logs postgres
                        exit 1
                    fi

                    echo "===== READ DATABASE USER ====="

                    DB_USER=$(docker compose exec -T postgres \
                        sh -c 'printf "%s" "$POSTGRES_USER"')

                    echo "Database user: $DB_USER"

                    echo "===== CREATE TEST DATABASE IF NEEDED ====="

                    if ! docker compose exec -T postgres \
                        psql -U "$DB_USER" -d postgres -tAc \
                        "SELECT 1 FROM pg_database WHERE datname='portfolio_test'" \
                        | grep -q 1; then

                        docker compose exec -T postgres \
                            psql -U "$DB_USER" -d postgres \
                            -c "CREATE DATABASE portfolio_test OWNER $DB_USER;"
                    fi

                    echo "===== BUILD API TEST IMAGE ====="

                    docker build \
                        -f api/Dockerfile.test \
                        -t "$API_TEST_IMAGE" \
                        ./api

                    echo "===== DETERMINE DOCKER NETWORK ====="

                    POSTGRES_CONTAINER=$(docker compose ps -q postgres)

                    if [ -z "$POSTGRES_CONTAINER" ]; then
                        echo "ERROR: PostgreSQL container was not found."
                        exit 1
                    fi

                    NETWORK=$(docker inspect "$POSTGRES_CONTAINER" \
                        --format '{{range $name, $value := .NetworkSettings.Networks}}{{$name}}{{end}}')

                    if [ -z "$NETWORK" ]; then
                        echo "ERROR: Could not determine Docker network."
                        exit 1
                    fi

                    echo "Using Docker network: $NETWORK"

                    echo "===== PREPARE JUNIT REPORT DIRECTORY ====="

                    mkdir -p "$WORKSPACE/api/test-results"

                    echo "===== RUN API MIGRATIONS AND TESTS ====="

                    docker run --rm \
                        --network "$NETWORK" \
                        --user "$(id -u):$(id -g)" \
                        -e DATABASE_URL="postgresql://${DB_USER}:portfolio_pass@postgres:5432/${TEST_DATABASE}?schema=public" \
                        -e JEST_JUNIT_OUTPUT_DIR=/app/test-results \
                        -e JEST_JUNIT_OUTPUT_NAME=junit.xml \
                        -v "$WORKSPACE/api/test-results:/app/test-results" \
                        "$API_TEST_IMAGE" \
                        sh -c 'npx prisma migrate deploy && npm test -- --reporters=default --reporters=jest-junit'
                '''
            }

            post {
                always {
                    junit(
                        testResults: 'api/test-results/junit.xml',
                        allowEmptyResults: true
                    )
                }
            }
        }

        stage('Build Next.js') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    echo "Building ${env.FRONTEND_IMAGE}"

                    docker.build(
                        env.FRONTEND_IMAGE,
                        '.'
                    )
                }
            }
        }

        stage('Build API Docker Image') {
            steps {
                script {
                    echo "Building ${env.API_IMAGE}"

                    docker.build(
                        env.API_IMAGE,
                        './api'
                    )
                }
            }
        }

        stage('Verify Docker Images') {
            steps {
                sh '''
                    set -eu

                    echo "===== VERIFY GIT SHA ====="

                    if [ -z "$GIT_SHA" ]; then
                        echo "ERROR: Git SHA is empty."
                        exit 1
                    fi

                    echo "Git SHA: $GIT_SHA"

                    echo "===== VERIFY FRONTEND IMAGE ====="

                    EXPECTED_FRONTEND="devsecops-portfolio:$GIT_SHA"

                    docker image inspect "$EXPECTED_FRONTEND" >/dev/null

                    echo "Frontend image exists: $EXPECTED_FRONTEND"

                    echo "===== VERIFY API IMAGE ====="

                    EXPECTED_API="devsecops-api:$GIT_SHA"

                    docker image inspect "$EXPECTED_API" >/dev/null

                    echo "API image exists: $EXPECTED_API"

                    echo "===== VERIFY IMAGE TAGS ====="

                    if [ "$FRONTEND_IMAGE" != "$EXPECTED_FRONTEND" ]; then
                        echo "ERROR: Frontend tag does not match Git SHA."
                        exit 1
                    fi

                    if [ "$API_IMAGE" != "$EXPECTED_API" ]; then
                        echo "ERROR: API tag does not match Git SHA."
                        exit 1
                    fi

                    echo "===== VERIFIED IMAGES ====="

                    docker image ls \
                        --format '{{.Repository}}:{{.Tag}}' \
                        | grep -F -x "$EXPECTED_FRONTEND"

                    docker image ls \
                        --format '{{.Repository}}:{{.Tag}}' \
                        | grep -F -x "$EXPECTED_API"

                    echo "SUCCESS: Both Docker images are verified."
                '''
            }
        }
    }

    post {
        success {
            echo """
            ==========================================
            PIPELINE SUCCESS!
            ==========================================
            Git SHA: ${env.GIT_SHA}
            Frontend image: ${env.FRONTEND_IMAGE}
            API image: ${env.API_IMAGE}

            Frontend tests completed.
            API tests completed.
            Next.js build completed.
            Docker images built and verified.
            ==========================================
            """
        }

        failure {
            echo '''
            ==========================================
            PIPELINE FAILURE!
            ==========================================
            Check the failed stage in Jenkins Console Output.
            ==========================================
            '''
        }

        always {
            echo 'Jenkins pipeline execution finished.'
        }
    }
}