import React, { useState } from "react";
import { setLocalData } from "../utils/localstorage";
import { useUserContext } from "../contexts/user.context";
import ChatInterface from "./ChatInterface";
import { cardData } from "../utils/cardData";

const CardsPage = () => {
  const [showChat, setShowChat] = useState(false);

  const { userInfo } = useUserContext();

  const handleViewProfile = (id) => {
    console.log(`Viewing profile for ${id}`);
    setLocalData("userData", { userInfo, selectedRole: id });
    setShowChat(true);
  };

  if (showChat) {
    return <ChatInterface />;
  }

  return (
    <>
      <div className="min-h-screen bg-black py-8 px-4 sm:py-12 sm:px-6 lg:px-8 h-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4">
              Our Teachers
            </h1>
            <div className="w-16 h-px bg-white mx-auto mb-6"></div>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {cardData.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
              >
                {/* Image Section */}
                <div className="relative h-80 sm:h-96 overflow-hidden">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${person.name}&size=400&background=000&color=fff`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8">
                  {/* Name and Title */}
                  <div className="mb-4">
                    <h2 className="text-2xl sm:text-3xl font-light text-black mb-2">
                      {person.name}
                    </h2>
                    {/* <p className="text-gray-600 text-lg font-medium">
                      {person.title}
                    </p> */}
                  </div>

                  {/* Location
                  <div className="flex items-center text-gray-500 mb-4">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span className="text-sm">{person.location}</span>
                  </div> */}

                  {/* Description */}
                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    {person.description}
                  </p>

                  {/* Skills
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-800 mb-3 uppercase tracking-wide">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {person.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div> */}

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewProfile(person.id)}
                    className="w-full py-3 sm:py-4 bg-black text-white text-base font-light rounded-lg transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 active:transform active:scale-95"
                  >
                    <span className="flex items-center justify-center">
                      <i className="fas fa-message mr-2"></i>
                      Chat with {person.name}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {/* <div className="text-center mt-16">
            <p className="text-gray-500 text-sm">
              Want to join our team?
              <span className="text-white ml-1 hover:underline cursor-pointer">
                Get in touch
              </span>
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default CardsPage;
