@Library('ecomm-shared-lib') _

pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:${env.PATH}"
        IMAGE_NAME = 'ecomm-order-service'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Detect Environment') {
            steps {
                script { detectEnvironment() }
            }
        }

        stage('Build') {
            steps {
                echo "Building order service..."
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                echo "Running unit tests..."
                sh 'npm test -- --ci --passWithNoTests'
            }
        }

        stage('Security Scan') {
            steps {
                echo "Running security scan (npm audit)..."
                sh 'npm audit --audit-level=high || true'
            }
        }

        stage('Container Build & Push') {
            when {
                expression { env.PIPELINE_ENV != 'build' }
            }
            steps {
                script { env.APP_VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim() }
                buildAndPushDockerImage(env.IMAGE_NAME, env.DOCKER_CREDENTIALS_ID)
            }
        }

        stage('Approve Production Deploy') {
            when {
                expression { env.PIPELINE_ENV == 'prod' }
            }
            steps {
                approveProdDeploy()
            }
        }

        stage('Deploy') {
            when {
                expression { env.PIPELINE_ENV != 'build' }
            }
            steps {
                echo "Deploy to ${env.PIPELINE_ENV} - placeholder for Kubernetes (Phase 5)"
                echo "Full image: ${env.FULL_IMAGE}"
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}
