import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const {
  PORT,
  ORIGIN,
  DATABASE_URL,
  NODE_ENV,
  APP_SECRET,
  HOST,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_NAME,
  REDIS_HOST,
  REDIS_PORT,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_FROM,
  JWT_SECRET_KEY,
  ASSET_S3_BUCKET,
  ASSET_S3_URL_EXPIRATION,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  ASSET_S3_CLIENT_PUBLIC_URL,
} = process.env;
