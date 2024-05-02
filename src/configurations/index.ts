import * as process from 'process';

export default () => ({
  serverPort: process.env.SERVER_PORT || 3000,
  database: {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },

  // JWT
  jwtSettings: {
    signingKey: process.env.JWT_SIGNING_KEY,
    accessTokenLifetime: process.env.JWT_ACCESS_TOKEN_LIFETIME || '5m',
    refreshTokenLifetime: process.env.JWT_REFRESH_TOKEN_LIFETIME || '30d',
  },
});
