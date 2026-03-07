import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LiveKitAssistant = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for messages from the iframe (LiveKit frontend)
    const handleMessage = (event) => {
      console.log("📩 Message received from iframe:", event.origin, event.data);

      // Allow messages from deployed URL or localhost for development
      const allowedOrigins = [
        "https://livekit-vercel-delta.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://livekit-frontend-mck7.onrender.com",
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn("⚠ Message from untrusted origin:", event.origin);
        return;
      }

      // When call ends, navigate back
      if (
        event.data?.type === "call-ended" ||
        event.data?.type === "disconnected"
      ) {
        console.log("✅ LiveKit call ended, navigating back");
        navigate("/start"); // Navigate to start page instead of going back
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{ width: "100%", textAlign: "center", margin: "32px 0 24px 0" }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#2d3748",
            letterSpacing: "1px",
            margin: 0,
            padding: 0,
          }}
        >
          LiveKit Assistant
        </h1>
      </div>
      <div
        style={{
          width: "90vw",
          maxWidth: "1200px",
          height: "80vh",

          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <iframe
          src="http://localhost:3000/"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          allow="microphone; "
          title="LiveKit Assistant"
        ></iframe>
      </div>
    </div>
  );
};

export default LiveKitAssistant;
