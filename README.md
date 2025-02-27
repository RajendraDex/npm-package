# EntityFormCrafter-BE

EntityFormCrafter Backend is a Node.js-based backend project template designed to help you quickly set up a new project with all necessary configurations. It includes a CLI tool to generate a boilerplate with database, ORM, and other backend configurations.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Database Configuration](#database-configuration)
- [ORM Configuration](#orm-configuration)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Contributing](#contributing)
- [License](#license)

Features
CLI Tool: Quickly generate a new project with a simple command.

Database Support: PostgreSQL (default) with Knex.js as the ORM.

Modular Structure: Clean and organized project structure.

Environment Configuration: Easily manage environment variables using .env.

Linting and Formatting: Pre-configured ESLint and Prettier for code quality.

Testing: Jest for unit and integration testing.

Migrations: Database migration support using Knex.js.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js: Version 20 or higher.

npm: Node package manager.

PostgreSQL: Installed and running (if using the default database).

Installation
Install the CLI tool globally:

```bash
npm install -g siteweaver-service-layer
```bash

Create a new project:

```bash
siteweaver-service-layer create
Follow the prompts to configure your project:

Enter the project name.

Configure the database (name, host, port, username, password).

Choose the ORM (default: Knex.js).

Navigate to the project directory:

```bash
Copy
cd <project-name>
Install dependencies:

```bash
npm install
Usage
Start the Project
Build the project:

```bash
npm run build
Run the project:

```bash
npm start
Run Migrations
To apply database migrations:

```bash
npm run migrate:API
Development Mode
For development, use:

```bash
npm run dev
This will:

Stop any running instances.

Clean the dist folder.

Build the project.

Start the server in watch mode.

Project Structure
Copy
<project-name>/
├── dist/                  # Compiled TypeScript files
├── bin/                   # Binary executables
├── package/               # Project packaging scripts
├── templates/             # Templates for project generation
├── test/                  # Test files
├── log/                   # Log files
├── cmd/                   # Command line interface files
├── src/                   # Source files
│   ├── config/                # Database configurations and migrations
│   ├── app/                   # Main application files
│   ├── routes/                # Route definitions
│   ├── validations/           # Validation logic
│   ├── constant/              # Constant values
│   ├── middleware/            # Middleware functions
│   ├── services/              # Service layer
│   ├── factories/             # Factory functions
│   ├── repositories/          # Data access layer
│   ├── models/                # Database models
│   ├── db/                    # Database setup
│   ├── enums/                 # Enums used in the project
│   ├── interfaces/            # Interface definitions
│   ├── types/                 # Type definitions
│   ├── utils/                 # Utility functions
│   ├── graphql/               # GraphQL schema and resolvers
│   ├── generator/             # Code generation scripts
│   ├── helpers/               # Helper functions
│   └── app.bootstrap.ts       # Entry point for the application
├── .env                      # Environment variables
├── .gitignore                # git ignorefile
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation


Scripts
Script	Description
npm run typescript	Run the project in development mode using ts-node.
npm run build	Compile TypeScript files and run migrations.
npm start	Start the compiled application.
npm run dev	Stop, clean, build, and start the project in development mode.
npm run migrate:API	Run database migrations.
npm run test	Run tests using Jest.
npm run lint	Lint the codebase using ESLint.
npm run format	Format the codebase using Prettier.

Database Configuration
The project uses PostgreSQL by default. You can configure the database in the .env file:

env
Copy
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
ORM Configuration
The project uses Knex.js as the ORM. The configuration file is located at knexfile.ts. You can modify it to suit your needs.

Testing
The project includes Jest for testing. To run tests:

```bash
Copy
npm run test
Linting and Formatting
ESLint: Ensures code quality and consistency.

```bash
Copy
npm run lint
Prettier: Formats the codebase.

```bash
Copy
npm run format
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeature).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeature).

Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Author
Rajendra Rajendra
Email: rajendrap.dexbytes@gmail.com
