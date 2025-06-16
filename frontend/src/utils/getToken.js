export default function getToken() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            return parsedData.token || null;  // Safely return the token if it exists
        } catch (error) {
            console.error("Error parsing userData from localStorage:", error);
            return null;
        }
    }
    return null;
}
