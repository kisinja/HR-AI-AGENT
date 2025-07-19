import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { hrQuickPrompts } from "./utils";

const App = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [threadId, setThreadId] = useState(Date.now().toString());
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);

  const BASE_URL = import.meta.env?.VITE_BACKEND_URL || "http://localhost:3001";

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!BASE_URL) {
      setResponse("Base url is missing!");
      return;
    }

    setLoading(true);
    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setConversation((prev) => [...prev, userMessage]);

    try {
      const res = await fetch(`${BASE_URL}/chat/${threadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const aiResponse = data.response || "No response";

      const aiMessage = {
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setResponse(aiResponse);
      setConversation((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error.message);
      const errorMessage = {
        role: "ai",
        content: "⚠️ Error communicating with AI Agent.",
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setResponse("");
    setThreadId(Date.now().toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-48 h-48 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[90vh] sm:h-[92vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-4 sm:p-6 flex items-center justify-between rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-sm"></div>
          <div className="flex items-center space-x-2 sm:space-x-4 relative z-10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/30 shadow">
              <span className="text-white font-bold text-sm sm:text-lg">
                🤖
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                HR AI Assistant
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm">
                Intelligent Human Resources Support
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
            <span className="text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/30">
              Beta v2.0
            </span>
            <button
              onClick={clearConversation}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-1 sm:p-2 rounded-md sm:rounded-lg border border-white/30 transition-all duration-200 group"
              title="Clear conversation"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-white group-hover:rotate-180 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Conversation History */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto space-y-3 sm:space-y-4 md:space-y-6 bg-gradient-to-b from-slate-50/50 to-white/30 pb-4 sm:pb-6">
          {conversation.length === 0 ? (
            <div className="text-center text-slate-700 h-full flex flex-col items-center justify-center px-2 sm:px-4">
              <div className="max-w-2xl space-y-4 sm:space-y-6 w-full">
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow">
                    <span className="text-2xl sm:text-3xl">🎯</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Welcome to HR Assistant
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg">
                    Your intelligent partner for recruitment, employee
                    engagement, policies, and more!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {hrQuickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(prompt.text)}
                      className="group bg-white/70 hover:bg-white/90 backdrop-blur-sm border border-indigo-200 hover:border-indigo-300 p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5 sm:hover:-translate-y-1"
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="text-xl sm:text-2xl group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-200">
                          {prompt.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide">
                            {prompt.category}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                            {prompt.text}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn text-sm`}
              >
                <div
                  className={`flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%] ${
                    msg.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                        : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                    }`}
                  >
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm backdrop-blur-sm border ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-300"
                        : "bg-white/80 text-slate-800 border-slate-200"
                    } ${
                      msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                    }`}
                  >
                    <ReactMarkdown
                    >
                      {msg.content}
                    </ReactMarkdown>
                    {msg.timestamp && (
                      <div
                        className={`text-[0.65rem] xs:text-xs mt-1 sm:mt-2 opacity-70 ${
                          msg.role === "user"
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%]">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white shadow-sm">
                  🤖
                </div>
                <div className="bg-white/80 backdrop-blur-sm text-slate-800 border border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex space-x-1 sm:space-x-2 items-center">
                    <div className="flex space-x-0.5 sm:space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-400 animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-400 animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-400 animate-bounce delay-200"></div>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 md:p-6 bg-white/50 backdrop-blur-sm border-t border-white/20">
          <div className="flex space-x-2 sm:space-x-3 md:space-x-4 items-end">
            <div className="flex-1">
              <textarea
                className="w-full border border-slate-200 focus:border-indigo-500 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-indigo-500/20 resize-none transition-all duration-200 placeholder-slate-400 text-sm sm:text-base"
                rows={2}
                placeholder="Ask about HR policies, recruitment strategies, employee relations..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
            </div>
            <button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow hover:shadow-md transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 min-w-[80px] sm:min-w-[100px]"
              onClick={handleSend}
              disabled={loading || !message.trim()}
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-xs sm:text-sm font-medium">Send</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mt-2 gap-1">
            <p className="text-[0.6rem] xs:text-xs text-slate-500">
              <span className="inline-flex items-center space-x-0.5 xs:space-x-1">
                <svg
                  className="w-2.5 h-2.5 xs:w-3 xs:h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  AI responses may need verification. Always confirm critical HR
                  decisions.
                </span>
              </span>
            </p>
            <div className="text-[0.6rem] xs:text-xs text-slate-400">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;