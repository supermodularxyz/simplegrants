⚠️⚠️⚠️  AS OF FEB 2024, this has been depcreated. Please see https://github.com/gitcoinco/simplegrants.xyz for the next build. ⚠️⚠️⚠️

# SimpleGrants 💰

A super modular, plug-and-play Web2 grants funding system.

## Contents 📄

- [Backend](./backend/)
- [Frontend](./frontend/)

## Main Goal/Objective 🎯

- Facilitate funding for any Web2 entities and more
- Super modular design that can be plugged into any payment gateway or fundraising platform
- Comprehensive documentations, tests, clean architecture, and easy forking

## About This Project ❓

This project is built based on this [Gitcoin Issue](https://gitcoin.co/issue/29568). Essentially, we want a modular Web2 grant funding system that can accept any payment providers or even plug in to another platform in a simple plug & play system.

## Features 💥

- Plug-and-play system for supported payment gateways
- Easy & quick deployment
- Analytics to track all important metrics such as grants with the highest amount raised, contributors, etc.
- Swagger API documentation for backend

## Navigating This Repository 🛠

This repository is broken down into two folders, `backend` & `frontend` and folder names are self explanatory. For further information on how to get everything set up, do check out the README in each of the folders!

## Installation & Setup 🧪

1. Clone the repository
2. Navigate to the `backend` folder and follow the installation and setup instructions in the [Backend README](./backend/README.md).
3. Navigate to the `frontend` folder and follow the installation and setup instructions in the [Frontend README](./frontend/README.md).

### Local Development 👨🏻‍💻

If you would like to run the services for local development, follow the steps below.

1. Firstly, ensure you install and setup everything according to the README in each folder as described above. You do not need to run any of the services yet.
2. If you are using Stripe as your payment provider, ensure that you have Stripe CLI setup & already logged in.
3. Once everything is setup, you may run the command below to instantly spin up all the required services.

```bash
# Update the .env accordingly for both frontend and backend
# Then, build & run everything
# This will automatically run seeds, migrations, and run the Stripe webhook listener
$ npm run start:dev
```

### Deployment Configuration 🚀

If you would like to deploy this application, there is a simple script that you can run to help speed up the process slightly.

1. Firstly, ensure you install and setup everything according to the README in each folder as described above. You do not need to run any of the services yet.
2. Once everything is setup, you may run the command below to instantly spin up all the required services. **Note: This assumes that you would be deploying everything in one server using Docker, rather than hosting on multiple platforms**.

```bash
# Update the .env accordingly for both frontend and backend
# Then, deploy everything in a single server
# This will automatically run seeds & migrations as needed
$ npm run start
```

3. Ensure that your payment provider webhooks are setup accordingly.
4. Because you are using Docker, it is very important to remember that the containers cannot speak to each other via `localhost`. That means that you should ideally setup NGINX (or whichever reverse proxy you use) to point to the services and change your environment variables to use the canonical URLs instead.

## Additional Notes 🧠

This project is intended for developers and entities who want to launch their own instance of this project and deploy it to their own platform.

For more information and detailed instructions, please refer to the README in each folder.
