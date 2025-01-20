/**
 * Extracts the first word from a given company name.
 * @param companyName - The name of the company.
 * @returns The first word of the company name.
 */
export function getFirstWord(companyName: string): string {
    const words = companyName.split(' ');
    return words[0];
}
/**
 * Converts object keys from snake_case to camelCase.
 * @param obj - The object with keys to convert.
 * @returns A new object with camelCase keys.
 */
export function convertToCamelCase(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
        const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[camelCaseKey] = obj[key];
    }
    return newObj;
}
/**
 * Masks all but the last four digits of a phone number.
 * @param phoneNumber - The phone number to mask.
 * @returns The masked phone number.
 */
export function maskPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/.(?=.{4})/g, 'X');
}
/**
 * Converts a 12-hour time format string to a 24-hour format.
 * @param timeString - The time string in 12-hour format (e.g., "02:30 PM").
 * @returns The time string in 24-hour format (e.g., "14:30").
 */
export function convertTo24HourFormat(timeString: string): string {
    // Split the time string into time and modifier (AM/PM)
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    hours = hours === '12' ? '00' : hours;
    hours = modifier === 'PM' ? (parseInt(hours, 10) + 12).toString() : hours;
    return `${hours.padStart(2, '0')}:${minutes}`;
}
/**
 * Converts a 24-hour time format string to a 12-hour format.
 * @param timeString - The time string in 24-hour format (e.g., "14:30").
 * @returns The time string in 12-hour format (e.g., "02:30 PM").
 */
export function convertTo12HourFormat(timeString: string): string {
    let [hours, minutes] = timeString.split(':');
    const modifier = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    hours = (parseInt(hours, 10) % 12 || 12).toString();
    return `${hours.padStart(2, '0')}:${minutes} ${modifier}`;
}

/**
 * Formats a string by capitalizing the first letter and making the rest lowercase.
 * @param input - The string to format.
 * @returns The formatted string.
 * @returns null if the input is empty
 */
export function formatString(input: string): string {
    if (input === null) {
        return '';
    }
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
/**
 * Calculates and formats the expiry date based on a start date and duration in months.
 * @param startDate - The start date in string format.
 * @param durationMonths - The duration in months to add to the start date.
 * @returns The formatted expiry date in 'YYYY-DD-MM' format.
 */
export function calculateAndFormatExpiry(startDate: string, durationMonths: number): string {
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    return `${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, '0')}-${String(expiryDate.getDate()).padStart(2, '0')}`;
}
/**
 * Formats a date object into a 'YYYY-MM-DD' string.
 * @param date - The date object to format.
 * @returns The formatted date string.
 */
export function formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
/**
 * Formats a duration in months into a human-readable string.
 * @param durationInMonths - The duration in months to format.
 * @returns The formatted duration string in years and months.
 */
export function formatDuration(durationInMonths: number): string {
    const years = Math.floor(durationInMonths / 12);
    const months = durationInMonths % 12;
    let durationString = '';

    // Add years to the duration string if greater than 0
    if (years > 0) {
        durationString += `${years} year${years > 1 ? 's' : ''}`;
    }

    // Add months to the duration string if greater than 0
    if (months > 0) {
        if (years > 0) {
            durationString += ' ';
        }
        durationString += `${months} month${months > 1 ? 's' : ''}`;
    }

    return durationString;
}

/**
 * Compares two date strings in 'YYYY-MM-DD' format.
 * @param date1 - The first date string to compare.
 * @param date2 - The second date string to compare.
 * @returns -1 if date1 is earlier than date2, 1 if date1 is later than date2, 0 if they are equal.
 * @throws Will throw an error if the date format is invalid or if the date values are invalid.
 */
export function compareDates(date1: string, date2: string): number {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // Validate the format of both date strings
    if (!dateRegex.test(date1) || !dateRegex.test(date2)) {
        throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
    }
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    // Check if the date values are valid
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        throw new Error("Invalid date values");
    }
    // Compare the two dates
    if (d1 < d2) return -1; 
    if (d1 > d2) return 1;
    return 0;               
}

// Add this new function
export function parseDateMonth(input: string): { date: number, month: number } | null {
    if(!input) {
        return null;
    }
    const [date, month] = input.split('/').map(Number);
    return { date, month };
}

// Add this new function
export function isCurrentMonth(inputMonth: string): boolean {
    if(!inputMonth) {
        return false;
    }
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1 for 1-12
    return currentMonth === Number(inputMonth);
}


