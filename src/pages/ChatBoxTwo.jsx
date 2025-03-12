import React, { useContext } from "react";
import { IoFlash } from "react-icons/io5";
import { BiInfoCircle, BiMoon } from "react-icons/bi";
import SEOHelmet from "../engine/SEOHelmet";
import ChatBotInput from "../components/Chatbot/ChatBotInput";
import { BotContext } from "../context/BotContext"; // Import Bot Context
import { BotReference, tasks } from "../utils/dummies"; // Import Bot Context
import ThemeToggleButton from "../components/ThemeToggleButton";
import ChatInterface from "../components/Chatbot/ChatInterface"
const ChatBoxTwo = () => {
  const { selectedBotChat } = useContext(BotContext); // Use context

  return (
    <div className="relative flex flex-col md:flex-row gap-4 h-full">
      <SEOHelmet title="Defcomm Ai" />
      <div className="relative flex flex-col gap-4 h-full">
        {/* Header Section */}
        <div className="sticky top-0 z-50 flex justify-between items-center bg-oliveDark text-white p-4 text-sm font-medium dark:bg-oliveLight">
          <p className="px-3 truncate w-[60%]">{selectedBotChat}</p>

          {/* Dark Mode Toggle Button */}
          <ThemeToggleButton />
        </div>

        {/* Chat UI */}
        <div className="relative w-full flex flex-col bg-[#d0eb8e] dark:bg-oliveDark min-h-[70vh] pt-10 transition-all duration-300">
          {selectedBotChat ? (
            <ChatInterface />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto w-full flex flex-col items-center space-y-4 p-4 py-2">
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 mb-1 font-bold animate-fadeIn">
                  Hello, Defcomm!
                </p>
                <p className="text-sm md:text-xl lg:text-2xl my-2 animate-fadeIn dark:text-gray-300">
                  How can I help you today?
                </p>
                <p className="text-xs md:text-sm mt-5 mb-3 text-gray-700 dark:text-gray-400 font-medium animate-fadeIn">
                  Take a look at the tasks I can handle:
                </p>
              </div>

              {/* Task List */}
              <div className="grid grid-cols-responsive-sm gap-4 mx-auto w-[90%] max-w-[700px] animate-slideUp pb-10">
                {tasks.map((task, index) => (
                  <section
                    key={index}
                    className="bg-white dark:bg-gray-900 dark:text-gray-200 py-3 px-4 min-h-32 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <h3 className="font-bold text-lg">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  </section>
                ))}
              </div>
            </>
          )}

          <ChatBotInput />
        </div>
      </div>
      <div className="w-72 h-full bg-oliveLight min-h-[70vh]">
        {/* Header Section */}
        <div className="sticky top-0 z-50 flex justify-between items-center bg-oliveGreen text-gray-300 p-4 text-sm font-medium dark:bg-oliveLight">
          <p className="text-[18px] px-3 truncate w-[60%]">References</p>

          {/* Dark Mode Toggle Button */}
          <BiInfoCircle size={24} />
        </div>
        {
          BotReference?.map((item) => (
            <div className="p-2 w-[90%] h-40 bg-[#d0eb8e] mx-auto overflow-y-auto my-2">
              <div className="flex justify-between items-center bg-oliveGreen text-gray-300 text-sm font-medium dark:bg-oliveLight">
                <p className="p-2 rounded-full border border-oliveGreen">{item.id}</p>
                <p className="text-xs px-3 truncate w-[60%]">{item.title}</p>
              </div>
              <p>{item.content}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ChatBoxTwo;
