"use client";

import { Card, Divider } from "@nextui-org/react";
import { textFiles } from "../../../utils/constants";

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
  sectionIndex: number;
  displayResults: boolean;
  onToggleDisplay: () => void;
  onSectionSelect: (section: string, document: string, sentence: string) => void;
  onClearContext: () => void;
  highlightTokenInSentence: (sentence: string, token: string) => (string | JSX.Element)[];
  roundScore: (score: number) => string;
}

export default function ResultsCard({
  data,
  submittedText,
  sectionIndex,
  displayResults,
  onToggleDisplay,
  onSectionSelect,
  onClearContext,
  highlightTokenInSentence,
  roundScore,
}: ResultsCardProps) {

  return (
    <div>
      { displayResults ? 
        // <Card className="" > "mt-4 p-4 bg-slate-100 rounded-none max-h-[70vh] overflow-y-auto">
        <Card className="bg-slate-100 p-4 max-w-[50vh] flex flex-col" shadow="none" radius="none">
          <button onClick={onToggleDisplay} className="text-sm text-blue-500 hover:text-gray-500 pb-4">
            {displayResults ? "Hide Results" : "Show Results"}
          </button>
          <p><strong>Query Context:</strong> {submittedText?.queryText}</p>
          <p><strong>Target Word:</strong> {submittedText?.targetWord}</p>
          <Divider className="my-4" />
          <ul>
            {data.map((item, index) => (
              <li key={index} className="pb-2">
                <p className="text-xs font-semibold py-1">
                  {textFiles.find(text => text.value === item['document'])?.label}: {item['section']}
                </p>
                <p className="text-sm">{highlightTokenInSentence(item.sentence, item.token)}</p>
                <p className="text-xs font-semibold pt-1">Similarity: {roundScore(item.score)}</p>
                { Number(item.section) === sectionIndex ? (
                  <button onClick={onClearContext} className="text-xs text-blue-500 hover:text-gray-500">
                    Clear passage context
                  </button>
                ) : (
                  <button
                    onClick={() => onSectionSelect(item.section, item.document, item.sentence)}
                    className="text-xs text-blue-500 hover:text-gray-500"
                  >
                    View in context
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Card>
        : 
        <button onClick={onToggleDisplay} className='text-sm text-blue-500 hover:text-gray-500'>
          Show Results
        </button>
      } 
    </div>
  );
}
