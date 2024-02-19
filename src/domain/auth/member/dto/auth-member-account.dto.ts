import { Account } from '@prisma/client';
export type AccountDTO = {
    id: number;
    type: Account['type'];
};
