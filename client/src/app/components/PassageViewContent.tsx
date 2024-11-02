"use client"

import { useState, useEffect } from "react";
import PassageView from "./PassageView";

export default function EditablePassageContainer() {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch the text file directly from the public directory
    fetch("/caesar_gall1.txt")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load file");
        }
        return response.text();
      })
      .then((text) => {
        const lines = text.split("\n");
        console.log(lines[0])
        setTitle(lines[0].toUpperCase()); // Use the first line as the title in all caps

        // Extract numbered sections
        const numberedSections = text.match(/\[\s*\d+\s*\][^\[]+/g) || [];
        setSections(numberedSections);
      })
      .catch((error) => console.error("Error loading file:", error));
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sections.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sections.length) % sections.length);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-1/4 mr-8 p-4">
        <p className="font-bold mb-4">{title}</p>
        
        {/* Toggle Button for Dropdown */}
        <button
          onClick={toggleDropdown}
          className="w-full p-2 bg-gray-500 text-white rounded mb-2"
        >
          {isDropdownOpen ? "Hide Sections" : "Show Sections"}
        </button>

        {/* Dropdown List */}
        {isDropdownOpen && (
          <ul className="space-y-2 bg-white p-4 rounded shadow-md h-64 overflow-y-auto">
            {sections.map((_, index) => (
              <li
                key={index}
                className={`cursor-pointer p-2 rounded ${
                  currentIndex === index ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                }}
              >
                {index + 1}
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="flex flex-col items-center space-y-4">
        <PassageView title={title} content={sections[currentIndex] || ""} />

        <div className="flex space-x-4 mt-4">
          <button onClick={handlePrevious} className="p-2 bg-gray-300 rounded">Previous</button>
          <button onClick={handleNext} className="p-2 bg-gray-300 rounded">Next</button>
        </div>
      </main>
    </div>
  );
}