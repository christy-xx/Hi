
/**
 * Checks if two Date objects fall on the same day, ignoring time.
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

/**
 * Given a date, returns the date of the Monday of that week.
 */
export const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    // day is 0 for Sunday, 1 for Monday, etc.
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
};

/**
 * Formats a date range for display in the week view header.
 */
export const formatWeekRange = (date: Date): string => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startMonth = start.toLocaleString('default', { month: 'long' });
    const endMonth = end.toLocaleString('default', { month: 'long' });

    if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    } else {
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
    }
};


/**
 * Parses a human-readable due date string into a Date object.
 * Makes assumptions about times (e.g., "Tonight" is 7 PM).
 */
export const parseDueDate = (dueDateStr: string): Date | null => {
    // Attempt to parse more specific date formats first (e.g., "Aug 29, 2025")
    // Append the current year if it's not present for robustness
    const year = new Date().getFullYear();
    let dateToParse = dueDateStr;
    if (!/\d{4}/.test(dateToParse)) {
        dateToParse += `, ${year}`;
    }

    const specificDate = new Date(dateToParse);
    if (!isNaN(specificDate.getTime())) {
        // It's a valid date string. Check if it was "tonight".
        if (dueDateStr.toLowerCase().includes('tonight')) {
            specificDate.setHours(19, 0, 0, 0); // 7:00 PM
        } else {
            specificDate.setHours(9, 0, 0, 0); // Default to 9:00 AM
        }
        return specificDate;
    }

    // Fallback to keyword-based parsing for simpler terms
    const now = new Date('2025-08-27T12:00:00Z'); // Use static date for consistency
    const lowerCaseDueDate = dueDateStr.toLowerCase();

    if (lowerCaseDueDate.includes('tonight')) {
        now.setHours(19, 0, 0, 0); // 7:00 PM today
        return now;
    }

    if (lowerCaseDueDate.includes('tomorrow')) {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0); // 9:00 AM tomorrow
        return tomorrow;
    }

    // Handle "This Friday", "Next Monday", etc.
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayMatch = daysOfWeek.find(day => lowerCaseDueDate.includes(day));
    if (dayMatch) {
        const targetDay = daysOfWeek.indexOf(dayMatch);
        const currentDay = now.getDay();
        let dayDifference = targetDay - currentDay;

        // If the day is in the past for the current week, assume it's next week
        if (dayDifference < 0) {
            dayDifference += 7;
        }

        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + dayDifference);
        targetDate.setHours(9, 0, 0, 0); // 9:00 AM on that day
        return targetDate;
    }

    return null; // Return null if the date string is not recognized
};
