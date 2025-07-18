# Welcome to Helical Web

Helical Web is a web interface created to allow users of the Helical package for bioinformatics to interact with Helical applications in an environment that requires no tuning and comes installed with all the tools and packages you may need for your Helical experiments.

## Prerequisites
- Docker Desktop (for building and hosting the Docker containers)
- HuggingFace token (for accessing the datasets and some other tools from the HuggingFace library)

## Instructions
1. Clone this Github repository to your desired location. You can click on the green Code button on the top of the repository home page to get the link, and then use the following command to clone the repostiory:
```shell
git clone https://github.com/priyankvyas/helical-frontend-application.git
```
2. Once the repository is cloned, navigate to the cloned directory and open a terminal there.
3. Log in to your HuggingFace account and create a new access token and store it in a file called .env in the root of your project directory with the following line:
```
HF_TOKEN=<Your token>
```
4. Ensure that Docker Desktop is running.
5. In the root of the project directory, use the following command to build the Docker containers:
```shell
docker-compose up --build
```
6. Let the containers finish building. Once they are up and running, you will be able to see a helical-frontend stack in the Docker Desktop app with two containers, frontend-1 and backend-1 running.
7. Access the web application through your web browser at http://localhost:3000.