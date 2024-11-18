"use client";

import { Accordion, AccordionItem, Card, Divider } from "@nextui-org/react";
import { textFiles } from "../../../utils/constants";
import { useEffect, useState } from "react";
import { useTextSectionContext } from "../contexts/TextSectionContext";
import PassageView from "./PassageView";

interface ResultItem {
  document: string;
  section: string;
  sentence: string;
  token: string;
  score: number;
}

interface ResultsCardProps {
  data: ResultItem[];
  submittedText: { queryText: string; targetWord: string } | null;
  displayResults: boolean;
  onToggleDisplay: () => void;
  highlightTokenInSentence: (sentence: string, token: string) => (string | JSX.Element)[];
  roundScore: (score: number) => string;
}

export default function ResultsCard({
  data,
  submittedText,
  displayResults,
  onToggleDisplay,
  highlightTokenInSentence,
  roundScore,
}: ResultsCardProps) {

  const [sectionInContext, setSectionInContext] = useState(false);
  const [resultSentence, setResultSentence] = useState('');
  const [sectionIndex, setSectionIndex] = useState(-1);
  const [document, setDocument] = useState({ value: "", label: "" });
  const { querySections, setQuerySections, loadSections } = useTextSectionContext();

  useEffect(() => {
    loadSections(document.value, document.label)
    .then(setQuerySections)
    .catch(console.error);
  }, [document.value, document.label, loadSections, setQuerySections]);

  const handleSectionSelect = (currSection: string, currDocument: string, currSentence: string) => {
    setSectionIndex(Number(currSection));
    setResultSentence(currSentence);
    const currText = textFiles.find(text => text.value === currDocument);
    if (currText) {
      setDocument(currText);
    }
  }

  const cardClass = sectionInContext 
    ? "bg-slate-100 p-4 max-w-[50vh] max-h-[100vh] overflow-y-auto flex flex-col" 
    : "bg-slate-100 p-4 max-w-[50vh] flex flex-col" ;

  return (
    <div>
      { displayResults ? 
        // <Card className="" > "mt-4 p-4 bg-slate-100 rounded-none max-h-[70vh] overflow-y-auto">
        <Card className={cardClass} shadow="none" radius="none">
          <button onClick={onToggleDisplay} className="text-sm text-blue-500 hover:text-gray-500 pb-4">
            {displayResults ? "Hide Results" : "Show Results"}
          </button>
          <p><strong>Query Context:</strong> {submittedText?.queryText}</p>
          <p><strong>Target Word:</strong> {submittedText?.targetWord}</p>
          <Divider className="my-4" />
          <Accordion selectionMode="multiple">
            {data.map((item, index) => (
              <AccordionItem
                key={index}
                title={ // Number(item['section']) !== sectionIndex &&
                  <p className="text-xs font-semibold py-1">
                    {textFiles.find(text => text.value === item['document'])?.label}: {item['section']}
                  </p>
                }
                subtitle={ // Number(item['section']) !== sectionIndex &&
                  <div>
                    <p className="text-sm">{highlightTokenInSentence(item.sentence, item.token)}</p>
                    <p className="text-xs font-semibold pt-1">Similarity: {roundScore(item.score)}</p>
                  </div>
                }
                onPress={() => {handleSectionSelect(item.section, item.document, item.sentence); setSectionInContext(true)}}
                onBlur={() => {setSectionIndex(-1); setSectionInContext(false)}}
            >
              <PassageView 
                title={`${querySections.find(i => Number(i.indexLabel) === sectionIndex)?.title}: ${querySections.find(i => Number(i.indexLabel) === sectionIndex)?.indexLabel}`} 
                content={querySections.find(i => Number(i.indexLabel) === sectionIndex)?.content || ""} 
                highlight={resultSentence}
              />
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
        : 
        <button onClick={onToggleDisplay} className='text-sm text-blue-500 hover:text-gray-500'>
          Show Results
        </button>
      } 
    </div>
  );
}
