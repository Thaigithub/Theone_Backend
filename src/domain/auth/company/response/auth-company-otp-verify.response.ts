export class AuthCompanyOtpVerifyResponse {
    isVerified: boolean;
    status: OtpStatus;
}

enum OtpStatus {
    OUT_OF_TIME = 'OUT_OF_TIME',
    WRONG_CODE = 'WRONG_CODE',
    NOT_FOUND = 'NOT_FOUND',
    VERIFIED = 'VERIFIED',
}
