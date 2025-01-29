export function formatTime(minutes: number): string {
    const formattedMinutes = +minutes?.toFixed(0) || 0;
  
    if (formattedMinutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(formattedMinutes / 60);
        const remainingMinutes = formattedMinutes % 60;

        return `${hours}h ${remainingMinutes}m`;
    }
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}