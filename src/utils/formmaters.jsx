import { toast } from "react-toastify";

export const handleOnChange = (e, setDetails) => {
  const { name, value } = e.target;

  setDetails((prev) => {
    return { ...prev, [name]: value };
  });
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`; // Add leading zero for single-digit seconds
};

export const highlightKeyword = (sentence, keyword) => {
  const regex = new RegExp(`\\b${keyword.name}\\b`, "gi");

  return sentence.replace(
    regex,
    `<span class="${keyword.color} font-bold cursor-pointer hover:underline ">${keyword.name}</span>`
  );
};
export const FormatPrice = (price, removecode = false) => {
  return `${!removecode ? '' : ''}${price.toLocaleString(navigator.language, {
    minimumFractionDigits: 0, // Fixed the typo here
  })}`;
};

export const FormatNumber = (price) => {
  return `${price.toLocaleString(navigator.language, {
    minmumFractionDigits: 0,
  })}`;
};

export const FormatPriceInUsd = (price) => {
  return `USD ${price.toLocaleString(navigator.language, {
    minmumFractionDigits: 0,
  })}`;
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

export const setSelectedData = (dataList, setData, value) => {
  if (!value) {
    setData(dataList[0]);
    return;
  } else if (value) {
    const newData = dataList.find((currentData) => (currentData.name = value));
    if (newData) {
      setData(newData);
      return;
    } else {
      setData(dataList[0]);
      return;
    }
  }
};

export const getImageURL = (e, setStateFunctionUrl, setDetails) => {
  const { name } = e.target;
  const file = e.target.files[0]; //filelist is an object carrying all details of file, .files[0] collects the value from key 0 (not array), and stores it in file

  if (file && (file.size > (1024 * 1024))) {
    const maxSizeMB = ((1024 * 1024) / (1024 * 1024)).toFixed(2); // Convert file size limit to MB
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // Convert uploaded file size to MB

    // Truncate long file names to 20 characters for better UI readability
    const truncatedFileName = file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name;


    toast.error(`File size of "${truncatedFileName}" exceeds the limit of ${maxSizeMB} MB. The uploaded file is ${fileSizeMB} MB. Please select a smaller file.`);
    
    return null;
  }
  if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
    // You can also perform additional actions with the valid file
    const generatedUrl = URL.createObjectURL(file);
    if (setStateFunctionUrl) {
      setStateFunctionUrl(generatedUrl);
    }
    setDetails((prev) => {
      return { ...prev, [name]: file };
    });
  } else {
    // Handle invalid file type
    alert("Please select a valid JPEG or PNG file.");
  }
};
export const getDocument = (e, setDetails) => {
  const { name } = e.target;
  const file = e.target.files[0]; //filelist is an object carrying all details of file, .files[0] collects the value from key 0 (not array), and stores it in file
  if (file && (file.size > (1024 * 1024))) {
    const maxSizeMB = ((1024 * 1024) / (1024 * 1024)).toFixed(2); // Convert file size limit to MB
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // Convert uploaded file size to MB

    // Truncate long file names to 20 characters for better UI readability
    const truncatedFileName = file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name;


    toast.error(`File size of "${truncatedFileName}" exceeds the limit of ${maxSizeMB} MB. The uploaded file is ${fileSizeMB} MB. Please select a smaller file.`);
    
    return null;
  }

    console.log(file)
  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (file && validTypes.includes(file.type)) {
    // You can also perform additional actions with the valid file
    const generatedUrl = URL.createObjectURL(file);
    setDetails(file);
  } else {
    // Handle invalid file type
    alert("Please select a valid JPEG or PNG file.");
  }

};

export const onTextChange = (e, details, setDetails) => {
  const { name, value } = e.target;
  setDetails({ ...details, [name]: value });
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