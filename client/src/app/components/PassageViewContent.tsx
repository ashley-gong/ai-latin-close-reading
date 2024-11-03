"use client"

import { useState, useEffect } from "react";
import PassageView from "./PassageView";
import PassageSidebar from "./PassageSidebar";

interface Section {
  title: string;
  indexLabel: string;
  content: string;
}

export default function PassageViewContent() {
  const [isDualView, setIsDualView] = useState(false);
  const [leftText, setLeftText] = useState({ value: "caesar_gall1.txt", label: "Caesar Gallic Wars Book 1" });
  const [rightText, setRightText] = useState({ value: "catullus.txt", label: "Catullus" });
  const [leftSections, setLeftSections] = useState<Section[]>([]);
  const [rightSections, setRightSections] = useState<Section[]>([]);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);

  const textFiles = [
    { label: "Caesar Gallic Wars Book 1", value: "caesar_gall1.txt" },
    { label: "Caesar Gallic Wars Book 2", value: "caesar_gall2.txt" },
    { label: "Catullus", value: "catullus.txt" }
  ];

  const loadSections = async (textFile: string, textTitle: string): Promise<Section[]> => {
    const response = await fetch(`/${textFile}`);
    if (!response.ok) throw new Error("Failed to load file");
    
    const text = await response.text();
    const numberedSections = text.match(/\[\s*\d+\s*\][\s\S]*?(?=\[\s*\d+\s*\]|$)/g) || [];
    return numberedSections.map((section, i) => {
      const indexLabelMatch = section.match(/\[\s*(\d+)\s*\]/);
      const title = textTitle;
      const indexLabel = indexLabelMatch ? `${indexLabelMatch[1]}` : `${i + 1}`;
      const content = section; //.replace(/\[\s*\d+\s*\]/, "").trim();
      return { title, indexLabel, content };
    });
  };

  useEffect(() => {
    loadSections(leftText.value, leftText.label)
      .then(setLeftSections)
      .catch(console.error);
  }, [leftText]);

  useEffect(() => {
    loadSections(rightText.value, rightText.label)
      .then(setRightSections)
      .catch(console.error);
  }, [rightText]);


  const toggleSidebar = () => {
    setIsLeftSidebarVisible(!isLeftSidebarVisible);
  };

  const toggleDualView = () => {
    setIsDualView(!isDualView);
  };

  // TODO eventually have the main view be a tab selector, want cluster graphs too
  return (
    <div className="flex min-h-screen gap-4">

      {!isLeftSidebarVisible && isDualView? (
        <PassageSidebar
          isDualView={isDualView}
          textFiles={textFiles}
          selectedText={rightText.value}
          onTextChange={(value: string, label: string) => setRightText({ value, label })}
          sections={rightSections}
          selectedIndex={rightIndex}
          onSelectIndex={setRightIndex}
          title="Right"
          onToggleSidebar={toggleSidebar}
        />
      ) : (
        <PassageSidebar
          isDualView={isDualView}
          textFiles={textFiles}
          selectedText={leftText.value}
          onTextChange={(value: string, label: string) => setLeftText({ value, label })}
          sections={leftSections}
          selectedIndex={leftIndex}
          onSelectIndex={setLeftIndex}
          title="Left"
          onToggleSidebar={toggleSidebar}
        />
      )}

      <main className="flex flex-col items-center space-y-4 w-2/3">
        <button onClick={toggleDualView} className="p-2 bg-gray-500 hover:bg-gray-400 text-white rounded">
          {isDualView ? "Switch to Single View" : "Switch to Dual View"}
        </button>
        <div className="flex w-full gap-8">
          <div className={isDualView ? 'flex-1' : 'w-full'}>
            <PassageView title={`${leftSections[leftIndex]?.title}: ${leftSections[leftIndex]?.indexLabel}`} content={leftSections[leftIndex]?.content || ""} />
          </div>

          {isDualView && 
            <div className="flex-1">
              <PassageView title={`${rightSections[rightIndex]?.title}: ${rightSections[rightIndex]?.indexLabel}`} content={rightSections[rightIndex]?.content || ""} />
            </div>
          }
        </div>
      </main>
    </div>
  );
}