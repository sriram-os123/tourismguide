import { useState, useRef, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDsbduV9o8-3N0es0fM-wwcqG43yaKNRjc`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className="container-fluid bg-light vh-100 d-flex flex-column">
      {/* Header */}
      <header className="text-center py-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 1024 1024"
        >
          <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
        </svg>
        <h6 className="display-4 text-primary">Chatbot for Tourism & Travel</h6>
      </header>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-grow-1 overflow-auto border rounded p-3 mb-4 bg-white"
      >
        {chatHistory.length === 0 ? (
          <div className="h-100 d-flex align-items-center justify-content-center text-center">
            <div className="p-4 border rounded bg-light">
              <p>
                This chatbot can answer common travel queries, suggest
                personalized itineraries, and even offer emergency assistance in
                case of cancellations or delays
              </p>
              <p className="text-primary">
                Just type your question below and press Enter or click Send!
              </p>
              <p>-Developed by Karthikeya Parthiv & Sriram</p>
            </div>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`mb-3 text-${
                chat.type === "question" ? "end" : "start"
              }`}
            >
              <div
                className={`d-inline-block p-3 rounded border bg-${
                  chat.type === "question"
                    ? "primary text-white"
                    : "light text-dark"
                }`}
              >
                <ReactMarkdown>{chat.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {generatingAnswer && (
          <div className="text-start">
            <div className="d-inline-block bg-light p-3 rounded animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={generateAnswer} className="bg-white p-3 border rounded">
        <div className="d-flex gap-2">
          <textarea
            required
            className="form-control flex-grow-1"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            rows="2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                generateAnswer(e);
              }
            }}
          ></textarea>
          <button
            type="submit"
            className={`btn btn-primary ${generatingAnswer ? "disabled" : ""}`}
            disabled={generatingAnswer}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
