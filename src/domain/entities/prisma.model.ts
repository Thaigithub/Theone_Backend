/*
  This enum class is used to identify what's model will be injected to prisma
*/
export enum PrismaModel {
  ACCOUNT = 'account',
  AUTHENTICATION_PROVIDER = 'authenticationProvider',
  TEAM = 'team',
  OTP_PROVIDER = 'otpProvider',
  FILE = 'file',
  MEMBER = 'member',
}
