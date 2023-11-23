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
  COOLSMS_KEY,
  COOLSMS_SECRET,
  SENDER_PHONE_NUMBER,
  SMS_OTP_VALID_TIME
} = process.env;
