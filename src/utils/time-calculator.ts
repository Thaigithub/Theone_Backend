export function getTimeDifferenceInMinutes(time: Date): number {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - time.getTime();
    return timeDifference / (1000 * 60);
}
