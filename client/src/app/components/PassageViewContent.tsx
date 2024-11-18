"use client"

import { useState, useEffect } from "react";
import PassageView from "./PassageView";
import PassageSidebar from "./PassageSidebar";
import { textFiles } from '../../../utils/constants';
import { useTextSectionContext } from "../contexts/TextSectionContext";

interface Props {
  querySent: boolean;
  querySentence: string;
  children?: React.ReactNode;
}

export default function PassageViewContent({ querySent, querySentence, children } : Props) {
  const [isDualView, setIsDualView] = useState(querySent);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);

  const {
    leftText,
    setLeftText,
    leftSections,
    setLeftSections,
    rightText,
    setRightText,
    rightSections,
    setRightSections,
    loadSections,
  } = useTextSectionContext();

  useEffect(() => {
    loadSections(leftText.value, leftText.label)
      .then(setLeftSections)
      .catch(console.error);
  }, [leftText, loadSections, setLeftSections]);

  useEffect(() => {
    loadSections(rightText.value, rightText.label)
      .then(setRightSections)
      .catch(console.error);
  }, [loadSections, rightText, setRightSections]);

  const toggleSidebar = () => {
    setIsLeftSidebarVisible(!isLeftSidebarVisible);
  };

  const toggleDualView = () => {
    setIsDualView(!isDualView);
  };

  const swapTexts = () => {
    const currLeftText = leftText;
    const currLeftSections = leftSections;
    const currLeftIndex = leftIndex;
    const currRightText = rightText;
    const currRightSections = rightSections;
    const currRightIndex = rightIndex;
    setLeftText(currRightText);
    setLeftSections(currRightSections);
    setLeftIndex(currRightIndex);
    setRightText(currLeftText);
    setRightSections(currLeftSections);
    setRightIndex(currLeftIndex);
  }

  // TODO eventually have the main view be a tab selector, want cluster graphs too
  return (
    <div className="flex min-h-screen gap-2">

      {!isLeftSidebarVisible && isDualView && !querySent ? (
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
          isDualView={isDualView && !querySent}
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
        <div className="flex flex-col gap-2 items-center">
          <div className="row-start-1">
            <button onClick={toggleDualView} className="p-2 bg-gray-500 hover:bg-gray-400 text-white rounded">
              {isDualView ? "Switch to Single/Query View" : "Switch to Dual View"}
            </button>
          </div>
          {isDualView && !querySent && 
            <div className='row-start-2'>
              <button onClick={swapTexts} className="text-xs hover:text-blue-500">
                Swap Texts
              </button>
            </div> }     
        </div>
        <div className="flex w-full gap-8">
          <div className="flex-1">
            <PassageView 
              title={`${leftSections[leftIndex]?.title}: ${leftSections[leftIndex]?.indexLabel}`} 
              content={leftSections[leftIndex]?.content || ""} 
              highlight={querySentence}
            />
          </div>

          {/* {querySent &&
            <div className="flex-1">
              <PassageView 
                title={`${querySections.find(i => Number(i.indexLabel) === sectionIndex)?.title}: ${querySections.find(i => Number(i.indexLabel) === sectionIndex)?.indexLabel}`} 
                content={querySections.find(i => Number(i.indexLabel) === sectionIndex)?.content || ""} 
                highlight={resultSentence}
              />
            </div>
          } */}

          {querySent && !isDualView &&
            <div className="flex-1">
              {children}
            </div>
          }    

          {isDualView && 
            <div className="flex-1">
              <PassageView 
                title={`${rightSections[rightIndex]?.title}: ${rightSections[rightIndex]?.indexLabel}`} 
                content={rightSections[rightIndex]?.content || ""} 
                highlight=""
              />
            </div>
          }
        </div>
      </main>
    </div>
  );
}