pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')     // Docker Hub credentials ID
        RENDER_DEPLOY_URL = credentials('render-hook-url')        // Render Deploy Hook credential ID
        DOCKER_IMAGE = "xphenomenal/mern-app"                    // replace with your Docker Hub image name
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Cloning the repository...'
                git branch: 'main', url: 'https://github.com/Xphenomenal008/Netflixlike-webiste.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo '🧩 Installing backend dependencies...'
                bat 'cd backend && npm install --legacy-peer-deps'
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo '🧪 Running backend tests...'
                bat 'cd backend && npx jest --coverage'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo '🧩 Installing frontend dependencies...'
                bat 'cd frontend && npm install'
            }
        }

        stage('Run Frontend Tests') {
            steps {
                echo '🧪 Running frontend tests...'
                bat 'cd frontend && npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                bat "docker build -t %DOCKER_IMAGE% ."
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                echo '📤 Pushing Docker image to Docker Hub...'
                bat "echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin"
                bat "docker push %DOCKER_IMAGE%"
            }
        }

        stage('Deploy to Render') {
            steps {
                echo '🚀 Triggering Render deployment...'
                bat "curl -X POST %RENDER_DEPLOY_URL%"
            }
        }
    }

    post {
        success {
            echo '✅ Deployment pipeline completed successfully!'
        }
        failure {
            echo '❌ Deployment pipeline failed. Check console logs for details.'
        }
    }
}
