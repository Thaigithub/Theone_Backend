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
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  KAKAO_VERIFY_URL,
  NAVER_VERIFY_URL,
  APPLE_OAUTH_RESTAPI,
  JWT_SECRET_KEY
} = process.env;
