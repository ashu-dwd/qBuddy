import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cardData } from "../utils/cardData";
import { axiosInstance } from "../utils/axiosInstance";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get data from localstorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const data = localStorage.getItem("userData");
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Failed to parse userData from localStorage", error);
      }
    };

    loadUserData();

    const handleStorageChange = (e) => {
      if (e.key === "userData") {
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Get teacher data
  useEffect(() => {
    if (userData) {
      const selectedTeacher = cardData.find(
        (teacher) => teacher.id === userData.selectedRole
      );
      setTeacher(selectedTeacher);
    }
  }, [userData]);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => prev + transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputValue]);

  const getResponseFromBackend = () => {
    setIsTyping(true);
    axiosInstance
      .post("/chat/generate", {
        userMessage: inputValue,
        ROLE: teacher?.id,
      })
      .then((response) => {
        console.log("Response from backend:", response.data.generatedResponse);

        const newMessage = {
          id: Date.now(),
          text: response.data.generatedResponse,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        //console.log(messages);

        setIsTyping(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsTyping(false);
      });
  };

  const handleSend = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      await getResponseFromBackend();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div
      className={`h-screen flex flex-col ${
        isDarkMode ? "bg-black" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b px-4 py-4 sm:px-6 ${
          isDarkMode ? "bg-black border-gray-200" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-black" : "bg-gray-800"
              }`}
            >
              <img
                src={teacher?.image}
                alt="teacher"
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div>
              <h1
                className={`text-lg font-light ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {teacher?.name}
              </h1>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-600 hover:text-black hover:bg-gray-100"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              <i
                className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} text-lg`}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        className={`flex-1 overflow-y-auto px-4 py-4 sm:px-6 ${
          isDarkMode ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? isDarkMode
                        ? "bg-black text-white rounded-br-md"
                        : "bg-gray-800 text-white rounded-br-md"
                      : isDarkMode
                      ? "bg-gray-100 text-black rounded-bl-md"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200"
                  }`}
                >
                  {message.sender === "bot" ? (
                    <ReactMarkdown
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <div className="relative group">
                              {/* Copy Button */}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    String(children).trim()
                                  );
                                }}
                                className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                              >
                                Copy
                              </button>

                              {/* Syntax Highlighter */}
                              <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code
                              className={`bg-gray-200 px-1 rounded text-sm ${
                                className || ""
                              }`}
                              {...props}
                            >
                              {String(children)}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <div
                  className={`px-4 py-3 rounded-2xl rounded-bl-md ${
                    isDarkMode
                      ? "bg-gray-100 text-black"
                      : "bg-white text-gray-800 shadow-sm border border-gray-200"
                  }`}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div
        className={`border-t px-4 py-4 sm:px-6 ${
          isDarkMode ? "bg-black border-gray-200" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type a message..."}
                className={`w-full px-4 py-3 pr-20 rounded-2xl border-0 focus:outline-none focus:ring-2 resize-none text-sm leading-relaxed transition-all duration-200 whitespace-pre-wrap ${
                  isDarkMode
                    ? "bg-gray-50 focus:ring-black focus:bg-white"
                    : "bg-gray-100 focus:ring-gray-600 focus:bg-white"
                } ${isListening ? "bg-red-50 focus:bg-red-50" : ""}`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                rows={1}
                style={{
                  minHeight: "48px",
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
                disabled={isListening}
              />

              <button
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-12 bottom-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isListening
                    ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                    : recognition
                    ? isDarkMode
                      ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                      : "bg-gray-300 text-gray-600 hover:bg-gray-400"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!recognition}
                title={
                  !recognition
                    ? "Speech recognition not supported"
                    : isListening
                    ? "Stop listening"
                    : "Start voice input"
                }
              >
                <i
                  className={`fas ${
                    isListening ? "fa-stop" : "fa-microphone"
                  } text-sm`}
                ></i>
              </button>

              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isListening}
                className={`absolute right-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  inputValue.trim() && !isListening
                    ? isDarkMode
                      ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                      : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
          </div>

          <p
            className={`text-xs mt-2 text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {recognition
              ? "Press Enter to send • Shift + Enter for new line • Click mic for voice input"
              : "Press Enter to send • Shift + Enter for new line"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
