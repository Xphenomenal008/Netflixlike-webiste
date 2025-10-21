# MERN App CI/CD Pipeline with Jenkins, Docker & Render

This project demonstrates a **complete CI/CD pipeline** for a MERN stack application using **Jenkins**, **Docker**, and **Render** for deployment. It automates building, testing, dockerizing, and deploying the app every time you push code to GitHub.

---

## 🔹 Pipeline Overview

The pipeline is defined in the `Jenkinsfile` located in the **root of the project**. Here's what happens automatically:

1. **Code Checkout**
   - Jenkins pulls the latest code from the GitHub repository.

2. **Install Dependencies & Run Tests**
   - Installs all Node.js dependencies.
   - Runs any tests (optional — won’t fail if tests are not defined).

3. **Build Docker Image**
   - Builds a Docker image of the MERN application using the `Dockerfile`.

4. **Push Docker Image to Docker Hub**
   - Jenkins logs in to Docker Hub using credentials stored securely in Jenkins.
   - Pushes the Docker image to your Docker Hub repository.

5. **Deploy to Render**
   - Triggers a Render deploy hook to automatically redeploy the latest version of your app.

---

## 🔹 Jenkinsfile Key Sections

```groovy
environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')   // Docker Hub login credentials
    RENDER_DEPLOY_URL = credentials('render-hook-url')      // Render deploy hook secret
    DOCKER_IMAGE = "yourdockerhubusername/mern-app"         // Docker image name
}
