/**
 * error-utils.js
 * Utility for parsing technical errors into user-friendly messages.
 */

export const getFriendlyErrorMessage = (error) => {
    // If it's a string, return it
    if (typeof error === 'string') return error;

    // Axios Error Handling
    if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Backend usually sends { message: "..." }
        if (data?.message) return data.message;

        switch (status) {
            case 400:
                return "The request was invalid. Please check your data.";
            case 401:
                return "Your session has expired. Please log in again.";
            case 403:
                return "You do not have permission to perform this action.";
            case 404:
                return "The requested resource was not found.";
            case 500:
                return "A server error occurred. Please try again later.";
            default:
                return `An error occurred (Status: ${status}).`;
        }
    }

    // Network Errors
    if (error?.message === "Network Error") {
        return "Unable to connect to the server. Please check your internet connection.";
    }

    // Generic fallback
    return error?.message || "An unexpected error occurred. Please try again.";
};
