import { onFailure } from "../../utils/notifications/OnFailure";

let authToken =

"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI4M2YyYTM1MC1hN2MyLTQyY2YtODQ0Ny0xOGRjMGI3Y2JiNDgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0MDY4NjE1OSwiZXhwIjoxNzQxMjkwOTU5fQ.x9NM69_tMHYijdBWLLr_pamlS2OQ8X2o02C9JNRl7mk";
// Getter for the current auth token
export const getAuthToken = () => authToken;

// Setter to update the auth token dynamically
export const setAuthToken = (newToken) => {
  authToken = newToken;
};

// Create a meeting with the current token
export const createMeeting = async () => {
  try {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
      method: "POST",
      headers: {
        Authorization: getAuthToken(),
        "Content-Type": "Bearer application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage =
        errorData?.message || "Failed to create meeting. Please try again later.";
      onFailure({ message: "Failed to generate meeting ID.", error: errorMessage });
      throw new Error(errorMessage);
    }

    const { roomId } = await res.json();
    return roomId;
  } catch (error) {
    onFailure({ message: "An error occurred while creating the meeting.", error: error.message });
    console.error("Error in createMeeting:", error);
    throw error; // Re-throw for further handling if necessary
  }
};
