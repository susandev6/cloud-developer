# cloud-developer
content for Udacity's cloud developer nanodegree

# Udacity Project - Refactor Udagram app into Microservices and Deploy

### Introduction
This project is to refactor the monolitic application from previous lesson into .

### Main parts
The project is located at course-03/exercises/ and it has 4 directories:
1. udacity-c3-deployment - contains docker and kubernetes config files.
2. udacity-c3-frontend - contains the frontend ionic application code.
3. udacity-c3-restapi-feed - contains the backend restapi code for the feed part.
4. udacity-c3-restapi-user - contains the backend restapi code for the user part.

In addition, there are 4 screenshots:
1. Docker_hub_images - docker hub images screenshot.
2. Kubectl_get_pod - shows all the running container.
3. Travis_CI_success_1 and Travis_CI_success_2 - show the travis CI successful build and deployment.
4. AWS_cloudwatch - shows the AWS cloudwatch screenshot.

The travis.yml file is located in the root directory of the project.

### How to run
1. Have all dependencies ready.
2. Checkout the code.
3. Update all config files.
4. Run docker-compose on the yaml file in Deployments/docker.
5. The application is accessable through browser.

### Dependencies
An S3 bucket and an RDS Postgres instance are needed to be provisioned before running the application.
