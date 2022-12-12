# Nestjs Boilerplate with Postgres SQL

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Setup database postgres:15.1

```bash
$ docker-compose -f database_postgres.yml up
```

## Running the app

```bash
$ cp .env.example .env

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Richard Do](https://github.com/ptit9x)

## License

Nest is [MIT licensed](LICENSE).
