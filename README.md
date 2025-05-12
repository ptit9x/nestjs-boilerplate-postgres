# Nestjs Boilerplate - with Postgres SQL

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

![Alt text](database.png "database design")

## Requirements

- [Docker >= 26](https://docs.docker.com/install)
- [Node >= 22](https://nodejs.org/en/download/)
- [Postgres SQL](https://www.postgresql.org/)

## Installation

```bash
npm install
```

## Setup develop environment and start app

```bash
docker compose -f docker-compose-dev.yml up --build
```

## Setup only database then start in the local

```bash
docker compose -f docker-compose-db.yml up --build
```

## Setup minio storage in the local

```bash
docker compose -f docker-compose-storage.yml up --build
```

## Running the app

```bash
cp .env.example .env

# Run migration database
npm run typeorm:run-migrations

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API documentation

http://localhost:8000/api

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

Config [Unit Test Report](https://stackoverflow.com/questions/24825860/how-to-get-the-code-coverage-report-using-jest) to HTML in package.json

```bash
"jest": {
    "collectCoverage": true,
    "coverageReporters": ["json", "html"],
}
```

## Stay in touch

- Author - [Richard Do](https://github.com/ptit9x)

## Using ruler (IDE rules automation)

Generate rules for IDE to use [Ruler](https://github.com/intellectronica/ruler)

Step: 
- Define rules in the AGENTS.md
- Use a modern IDE (VS Code, WebStorm) or an editor that integrates with your workspace.
- Run command 

```bash
ruler init 
```

- If you use Cursor, run it
```bash
ruler apply --agents cursor --no-mcp
```