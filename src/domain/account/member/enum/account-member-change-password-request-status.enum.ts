export enum AccountMemberChangePasswordRequestStatus {
    SUCCESS = 'SUCCESS',
    PASSWORD_NOT_MATCH = 'PASSWORD_NOT_MATCH',
    OTP_NOT_FOUND = 'OTP_NOT_FOUND',
    OTP_OUT_OF_TIME = 'OTP_OUT_OF_TIME',
    OTP_WRONG_CODE = 'OTP_WRONG_CODE',
}
