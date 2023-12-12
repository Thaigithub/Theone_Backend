export function getPeriod(startDate: Date, endDate: Date) {
    // Calculate the difference in years
    let yearDiff = endDate.getFullYear() - startDate.getFullYear();

    // Calculate the difference in months
    let monthDiff = endDate.getMonth() - startDate.getMonth();

    // Adjust the year difference if the end month is less than the start month
    if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
    }

    return { years: yearDiff, months: monthDiff };
}
