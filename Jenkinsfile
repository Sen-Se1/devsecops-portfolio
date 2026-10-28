pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
        skipDefaultCheckout(true)
    }

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        API_TEST_IMAGE = 'devsecops-api-test:latest'
        TEST_DATABASE  = 'portfolio_test'
        GITLEAKS_IMAGE = 'ghcr.io/gitleaks/gitleaks:latest'
        SEMGREP_IMAGE  = 'semgrep/semgrep:latest'
        NPM_AUDIT_LEVEL = 'high'
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
                }
            }
        }

        stage('Gitleaks Secret Scan') {
            steps {
                sh '''
                    set -eu

                    docker run --rm \
                        -v "$WORKSPACE:/repo" \
                        -w /repo \
                        "$GITLEAKS_IMAGE" \
                        git --redact --verbose .
                '''
            }
        }

        stage('Semgrep SAST Scan') {
            steps {
                sh '''
                    set -eu

                    docker run --rm \
                        -v "$WORKSPACE:/src" \
                        -w /src \
                        "$SEMGREP_IMAGE" \
                        semgrep scan \
                        --config p/default \
                        --metrics=off \
                        --error \
                        .
                '''
            }
        }

        stage('NPM Audit (Dependencies)') {
            parallel {
                stage('Audit Frontend') {
                    steps {
                        sh '''
                            set -eu

                            npm audit --omit=dev --json > npm-audit-frontend.json || true

                            npm audit --omit=dev --audit-level="$NPM_AUDIT_LEVEL"
                        '''
                    }
                }

                stage('Audit API') {
                    steps {
                        dir('api') {
                            sh '''
                                set -eu

                                npm audit --omit=dev --json > npm-audit-api.json || true

                                npm audit --omit=dev --audit-level="$NPM_AUDIT_LEVEL"
                            '''
                        }
                    }
                }
            }

            post {
                always {
                    archiveArtifacts(
                        artifacts: 'npm-audit-frontend.json, api/npm-audit-api.json',
                        allowEmptyArchive: true
                    )
                }
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

                    echo "===== READ DATABASE CREDENTIALS ====="

                    DB_USER=$(docker compose exec -T postgres \
                        sh -c 'printf "%s" "$POSTGRES_USER"')

                    DB_PASS=$(docker compose exec -T postgres \
                        sh -c 'printf "%s" "$POSTGRES_PASSWORD"')

                    echo "Database user: $DB_USER"

                    echo "===== CREATE TEST DATABASE IF NEEDED ====="

                    if ! docker compose exec -T postgres \
                        psql -U "$DB_USER" -d postgres -tAc \
                        "SELECT 1 FROM pg_database WHERE datname='$TEST_DATABASE'" \
                        | grep -q 1; then

                        docker compose exec -T postgres \
                            psql -U "$DB_USER" -d postgres \
                            -c "CREATE DATABASE $TEST_DATABASE OWNER $DB_USER;"
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

                    # Do not echo the command: it contains the database password.
                    set +x

                    docker run --rm \
                        --network "$NETWORK" \
                        --user "$(id -u):$(id -g)" \
                        -e DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@postgres:5432/${TEST_DATABASE}?schema=public" \
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
                    sh 'docker compose down || true'
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

                    docker image inspect "$FRONTEND_IMAGE" > /dev/null
                    docker image inspect "$API_IMAGE" > /dev/null

                    docker images \
                        --filter "reference=devsecops-portfolio:${GIT_SHA}" \
                        --filter "reference=devsecops-api:${GIT_SHA}"
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

            Secret scan (Gitleaks) passed.
            SAST scan (Semgrep) passed.
            Dependency audit (npm audit) passed.
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