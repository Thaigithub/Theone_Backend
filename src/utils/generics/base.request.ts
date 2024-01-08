import { IsObject } from 'class-validator';
import { Request } from 'express';

export class AccountIdExtensionRequest extends Request {
    @IsObject()
    user: { accountId: number };
}
