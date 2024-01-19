export function getTimeDifferenceInMinutes(time: Date): number {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - time.getTime();
    return timeDifference / (1000 * 60);
}

export function getTimeDifferenceInMonths(startDate: Date, endDate: Date) {
    const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return Math.ceil(days / 30);
}

export function getTimeDifferenceInYears(startDate: Date, endDate: Date) {
    const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return Math.ceil(days / 365);
}
