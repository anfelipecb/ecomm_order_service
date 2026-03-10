pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:${env.PATH}"
        IMAGE_NAME = 'ecomm-order-service'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
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

        stage('Container Build') {
            steps {
                script {
                    def gitCommit = env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : 'unknown'
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-git-${gitCommit}"
                }
                echo "Building Docker image ${IMAGE_NAME}:${env.IMAGE_TAG}"
                sh "docker build -t ${IMAGE_NAME}:${env.IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Container Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKER_CREDENTIALS_ID,
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_PASS'
                )]) {
                    sh 'echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin'
                    sh """
                        docker tag ${IMAGE_NAME}:${env.IMAGE_TAG} \$DOCKERHUB_USER/${IMAGE_NAME}:${env.IMAGE_TAG}
                        docker tag ${IMAGE_NAME}:latest \$DOCKERHUB_USER/${IMAGE_NAME}:latest
                        docker push \$DOCKERHUB_USER/${IMAGE_NAME}:${env.IMAGE_TAG}
                        docker push \$DOCKERHUB_USER/${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploy stage - placeholder for Kubernetes deployment (Phase 5)"
                echo "Image: ${IMAGE_NAME}:${env.IMAGE_TAG}"
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}
