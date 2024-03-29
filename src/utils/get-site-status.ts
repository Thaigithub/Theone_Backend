import { SiteStatus } from '@prisma/client';
export enum SitePeriodStatus {
    PREPARE = 'PREPARE',
    PROCEEDING = 'PROCEEDING',
    END = 'END',
    REVIEWING = 'REVIEWING',
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
}

export function getSiteStatus(status: SiteStatus, startDate: Date, endDate: Date): SitePeriodStatus {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (startDate && endDate && status === SitePeriodStatus.APPROVED) {
        if (now < startDate) return SitePeriodStatus.PREPARE;
        if (startDate <= now && now <= endDate) return SitePeriodStatus.PROCEEDING;
        if (endDate < now) return SitePeriodStatus.END;
    }

    return SitePeriodStatus[status];
}
