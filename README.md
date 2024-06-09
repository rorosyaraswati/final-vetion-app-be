# Authentication Project with Express.js and MySQL

This is a JavaScript project that utilizes Express.js as the backend framework and MySQL as the database. The project focuses on implementing authentication features, including user registration, login, and access token management.

## Installation

To use this project, follow these installation steps:

1. Clone this repository using your favorite code editor.
2. Make sure you have `npm` installed on your computer.
3. Perform database migration using Sequelize with the following commands:
   `npx sequelize-cli db:create`
   `npx sequelize-cli db:migrate`
4. Run the application using Node.js with the following command:
`node server`
5. The server will run in the localhost with the port 3000, open http://localhost:3000 to view it in your browser.

## Guide to Setting Up a Database with MySQL Workbench and Integrating with MySQL GCP

1. Preparing a Local Database with MySQL Workbench:
   - Ensure you have MySQL Workbench installed on your computer.
   - Create a new local database using MySQL Workbench.
2. Integrating the Local Database with MySQL GCP:
   - Obtain the Public IP Address of your MySQL instance on Google Cloud Platform (GCP).
   - Enter this Public IP Address as the Hostname in MySQL Workbench to connect your local database to MySQL GCP.
3. Configuring the Connection:
   - Ensure that the Public IP Address of your computer is added in the "Connections" section of your MySQL instance configuration on GCP.
   - Go to the MySQL instance page on GCP, and add your computer's Public IP Address in the Authorized Networks section.
