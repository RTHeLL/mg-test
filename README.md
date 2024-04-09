## Запуск необходимых модулей в Docker

В папке `docker` создать `.env` файл и заполнить его по примеру из файла `.env.example`.

Запустить докер контейнеры:

```bash
docker compose -f docker/docker-compose.yml up -d
```

## Установка зависимостей

```bash
$ npm install
```

## Настройка переменных окружения

В корневой папке проекта создать файл `.env` и заполнить его по примеру из файла `.env.example`.

## Миграции

### Приложение `auth`

```bash
sequelize db:migrate --url postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME> --migrations-path ./src/modules/auth/migrations
```

### Приложение `users`

```bash
sequelize db:migrate --url postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME> --migrations-path ./src/modules/users/migrations
```

## Запуск

#### Development

```bash
npm run start
```

#### Watch mode

```bash
npm run start:dev
```
 