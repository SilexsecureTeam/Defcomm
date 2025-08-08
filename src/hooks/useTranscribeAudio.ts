import { useState } from "react";

export function useTranscribeAudio(apiKey: string) {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribe = async (file: File) => {
    setLoading(true);
    setError(null);
    setTranscript("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");
    formData.append("response_format", "text"); // You can also use 'json' or 'verbose_json'

    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Transcription failed: ${errorText}`);
      }

      const text = await response.text();
      setTranscript(text);
    } catch (err: any) {
      console.error("Transcription error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { transcript, loading, error, transcribe };
}
