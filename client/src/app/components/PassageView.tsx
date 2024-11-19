"use client"

import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { useState } from "react";

interface PassageViewProps {
  title: string;
  content: string;
  highlight: string;
}

export default function PassageView({title, content, highlight}: PassageViewProps) {

  const [isScrollable, setIsScrollable] = useState(false);

  const processStringCompare = (part: string) => {
    const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escapedPart.replace(/\[\d+\]|\d+|\n+|\s+/g, '').toLowerCase();
  }
  
  const highlightSentenceInPassage = (sentence: string, passage: string) => {
    if (sentence === "") {
      return passage;
    }
    const rawSentence = sentence.replace(/ \/ /g, '\n');
    const escapedSentence = rawSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSentence})`, 'gi');
    const parts = passage.split(regex); 
    return parts.map((part, index) =>
      processStringCompare(part) === processStringCompare(rawSentence) ? (
        <span key={index} className="bg-blue-200">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div>
      <Card 
        className={isScrollable ? 
          "bg-slate-100 px-1 py-3 max-w-[62vh] max-h-[70vh] overflow-y-auto flex flex-col" 
          : "bg-slate-100 px-1 py-3 max-w-[62vh] flex flex-col"
        } 
        shadow="none" 
        radius="none"
      >
        <CardHeader className="flex flex-col gap-2 items-start">
          <h4 className="font-bold text-large">{title}</h4>
          <button onClick={() => setIsScrollable(!isScrollable)}
            className="text-xs text-gray-500 hover:text-blue-500"
          >
            { isScrollable ? "Remove Scroll" : "Make Scrollable" }
          </button>
        </CardHeader>
        <CardBody className="overflow-y-auto whitespace-pre-wrap">
          <p className="text-m">{highlightSentenceInPassage(highlight, content)}</p> 
        </CardBody>
      </Card>
    </div>
  )
}