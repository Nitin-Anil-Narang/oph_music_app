function formatDateAndAdjustMonth(isoDate) {
    const dateObj = new Date(isoDate);

    // Subtract one month
    dateObj.setMonth(dateObj.getMonth() - 1);

    // Format the date as DD MMM, YYYY
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  }
  export function formatDateTime(isoDate) {
    const dateObj = new Date(isoDate);

    // Format date as DD Month, YYYY
    const dateOptions = { day: "2-digit", month: "long", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", dateOptions);

    // Format time as HH:MM AM/PM
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = dateObj.toLocaleTimeString("en-US", timeOptions);

    // Combine date and time
    return `${formattedDate} - ${formattedTime}`;
  }

  export default formatDateAndAdjustMonth