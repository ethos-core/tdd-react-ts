function validateDate(date: Date): void {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }
}

function getDateParts(date: Date) {
    return {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString().padStart(2, "0"),
        day: date.getDate().toString().padStart(2, "0"),
    }
}

const TOKEN_MAP = {
    YYYY: 'year',
    MM: 'month',
    DD: 'day',
}

export function formatDate(
    date: Date,
    format: string = "YYYY/MM/DD"
  ): string {
    validateDate(date);
    const parts = getDateParts(date);
  
    return Object.entries(TOKEN_MAP).reduce(
      (result, [token, key]) => result.replace(token, parts[key]),
      format
    );
  }

export function formatRelativeDate(date: Date): string {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    const now = Date.now();
    const diffMs = now - date.getTime();

    if (diffMs < 0) {
        return formatDate(date);
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return "たった今";
    }

    if (diffMinutes < 60) {
        return `${diffMinutes}分前`;
    }

    if (diffHours < 24) {
        return `${diffHours}時間前`;
    }

    if (diffDays < 7) {
        return `${diffDays}日前`;
    }

    return formatDate(date);
}