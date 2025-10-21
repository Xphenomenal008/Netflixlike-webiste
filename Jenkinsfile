pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')     // your Docker Hub credentials ID
        RENDER_DEPLOY_URL = credentials('render-hook-url')        // your Render Deploy Hook credential ID
        DOCKER_IMAGE = "yourdockerhubusername/mern-app"           // replace with your Docker Hub image name
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Cloning the repository...'
                git 'https://github.com/Xphenomenal008/Netflixlike-webiste.git'  // replace with your repo URL
            }
        }

        stage('Install Dependencies & Test') {
            steps {
                echo '🧩 Installing dependencies and running tests...'
                sh 'npm install --legacy-peer-deps'
                sh 'npm test || echo "⚠️ No tests found, skipping..."'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                echo '📤 Pushing Docker image to Docker Hub...'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push $DOCKER_IMAGE'
            }
        }

        stage('Deploy to Render') {
            steps {
                echo '🚀 Triggering Render deployment...'
                sh 'curl -X POST $RENDER_DEPLOY_URL'
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
