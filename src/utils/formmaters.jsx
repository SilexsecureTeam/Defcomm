import { toast } from "react-toastify";


import DOMPurify from "dompurify";

export const parseHtml = (inputString) => {
  if (typeof inputString !== "string") return "";
  
  // Sanitize input to prevent XSS attacks
  const sanitizedString = DOMPurify.sanitize(inputString, { ALLOWED_TAGS: [] });

  // Preserve line breaks (`\n`) by replacing them with `<br />`
  return sanitizedString.replace(/\n/g, "  \n"); // Markdown uses "  \n" for new line
};


export const extractErrorMessage = (error) => {
  const getString = (data) => {
    return typeof data === "string" ? data : JSON.stringify(data);
  };

  if (error?.response?.data?.message) {
    return getString(error.response.data.message);
  } 

  if (error?.response?.data?.error) {
    return getString(error.response.data.error);
  } 

  if (error?.response?.error) {
    return getString(error.response.error);
  } 

  return getString(error?.message || "An unknown error occurred");
};


export const FormatError = (error, setError, message) => {
  console.log(error);
  if (error instanceof Error && !error?.response?.data) {
    setError({
      message: message,
      error: error.message,
    });
    console.log("normal erro");
  } else if (error?.response?.data) {
    const errorsFromResponse = error?.response?.data?.errors;
    let errorMessage = "";
    if (errorsFromResponse) {
      Object.keys(errorsFromResponse).map((currentErrorKey) => {
        const currentError = errorsFromResponse[currentErrorKey];
        errorMessage = errorMessage + currentError[0] + "\n";
      });
      console.log("api error");
    } else if (error?.response?.data?.response) {
      console.log("axios erro");
      errorMessage = error?.response?.data?.response;
    } else if (
      error?.response?.data?.message &&
      !error?.response?.data?.errors
    ) {
      errorMessage = error?.response?.data?.message;
    } else {
      errorMessage = "Something went wrong";
    }

    setError({
      message: message,
      error: errorMessage,
    });
  } else {
    setError({
      message: "Unknown",
      error: "Something went wrong",
    });
  }
};

export const formatResponse = (response, setDatum, responseType) => {
  const key = Object.keys(responseKeys).find(
    (current) => responseKeys[current] === responseType
  );

  return setDatum(response.data[key]);
};

// Get the names of the months in an array
export const monthNames = [
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

export function getThreeMonths() {
  // Create a Date object for the current date
  const currentDate = new Date();

  // Get the current month (0-11 where 0 is January and 11 is December)
  const currentMonth = currentDate.getMonth();

  // Calculate the previous two months and handle wrapping around the year
  const previousMonth1 = (currentMonth - 1 + 12) % 12; // Still safe, but redundant
  const previousMonth2 = (currentMonth - 2 + 12) % 12; // Still safe, but redundant

  // More simplified approach:
  // const previousMonth1 = (currentMonth - 1) % 12;
  // const previousMonth2 = (currentMonth - 2) % 12;

  // Get the names of the current month and the two previous months
  const months = [
    monthNames[previousMonth2],
    monthNames[previousMonth1],
    monthNames[currentMonth],
  ];

  return months;
}

export function toCamelCase(str) {
  return str
    .toLowerCase() // Convert the entire string to lowercase
    .split(" ") // Split the string into an array of words
    .map(
      (
        word,
        index // Map over each word
      ) =>
        index === 0 // If it's the first word, keep it lowercase
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize first letter of other words
    )
    .join(""); // Join the words back into a single string
}

export function generateDateRange() {
  const today = new Date();
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);

  // Format dates as "Month Day, Year"
  const formattedStartDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedEndDate = oneWeekLater.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${formattedStartDate} - ${formattedEndDate}.`;
}


export const FormatTextToUppecase = (text) => text ? `${text[0].toUpperCase()}${text?.slice(1, text.length)}` : 'No Text'

export const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    return `${name.slice(0, 3)}****@${domain}`;
  };

 export const maskPhone = (phone) => `${phone.substring(0,5)}******`;
