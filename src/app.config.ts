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
    REDIS_HOST,
    REDIS_PORT,
    MAIL_HOST,
    MAIL_SYSTEM,
    MAIL_REFRESH_TOKEN,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    KAKAO_VERIFY_URL,
    NAVER_VERIFY_URL,
    APPLE_OAUTH_RESTAPI,
    JWT_SECRET_KEY,
    COOLSMS_KEY,
    COOLSMS_SECRET,
    SENDER_PHONE_NUMBER,
    SMS_OTP_VALID_TIME,
    ASSET_S3_BUCKET,
    ASSET_S3_URL_EXPIRATION,
    AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    ASSET_S3_CLIENT_PUBLIC_URL,
    JWT_ACCESS_TOKEN_EXPIRE_HOURS,
    OTP_VERIFICATION_VALID_TIME,
    PORTONE_API_KEY,
    PORTONE_API_SECRET,
    PORTONE_HOST,
    FIRE_BASE_PROJECT_ID,
    FIRE_BASE_PRIVATE_KEY,
    FIRE_BASE_CLIENT_EMAIL,
} = process.env;
