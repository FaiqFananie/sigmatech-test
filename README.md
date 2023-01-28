# BackendTest

## Environment
- Programming Language: JavaScript
- Web Framework: Express
- Database: Postgres
- ORM: Sequelize
- Unit Test: Jest
- Code Standarization: eslint

## Getting Started
1. Install all library NPM with `npm install`
2. Configure .env file at `.env.copy` rename it to `.env`
3. Migrate Table Database:
  - configure `config/config.json.copy` then rename it to `config.json`
  - Run Command `npm run migrate || npx sequelize-cli db:migrate` 

## Understand this workspace

- Postman Documentation: `Sigmatech-test.postman_collection.json`
- Postman Environment: `Sigmatech-test.postman_environment.json`
- Unit Test: `npm run test || npm run test:watch`
- Run Lint: `npm run lint`

## Run Server

`npm run start || npm run start:dev`

