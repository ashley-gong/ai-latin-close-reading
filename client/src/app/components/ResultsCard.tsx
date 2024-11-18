"use client";

import { Accordion, AccordionItem, Card, Divider, Tab, Tabs } from "@nextui-org/react";
import { textFiles } from "../../../utils/constants";
import { useState } from "react";
import { useTextSectionContext } from "../contexts/TextSectionContext";
import PassageView from "./PassageView";
import AlignedResult from "./AlignedResult";

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

  const [isScrollable, setIsScrollable] = useState(false);
  const [itemStates, setItemStates] = useState<Record<string, Section>>({});
  const { loadSections } = useTextSectionContext();

  const handleAccordionToggle = async (section: string, document: string, index: number) => {
    if (!itemStates[index]?.content) {
      const currText = textFiles.find((text) => text.value === document);
      if (currText) {
        const loadedSections = await loadSections(currText.value, currText.label);
        const sectionContent = loadedSections.find((sec) => sec.indexLabel === section)?.content || "";

        setItemStates((prev) => ({
          ...prev,
          [index]: {
            title: currText.label,
            indexLabel: section,
            content: sectionContent,
          },
        }));
      }
    }
  };

  const cardClass = isScrollable ? 
    "bg-slate-100 p-4 max-w-[50vh] max-h-[70vh] overflow-y-auto flex flex-col" 
    : "bg-slate-100 p-4 max-w-[50vh] flex flex-col" ;

  const cardButtons = 
    displayResults ?
      <div className='flex flex-row gap-4 justify-center'>
        <button onClick={onToggleDisplay} className="text-sm text-blue-500 hover:text-gray-500 pb-4">
          Hide Results
        </button>
        <button onClick={() => setIsScrollable(!isScrollable)}
          className="text-sm text-blue-500 hover:text-gray-500 pb-4">
          { isScrollable ? "Remove Scroll" : "Make Scrollable" }
        </button>
      </div>
    : 
    <button onClick={onToggleDisplay} className="text-sm text-blue-500 hover:text-gray-500 pb-4">
      Show Results
    </button>


  return (
    <div>
      { displayResults ? 
        <Card className={cardClass} shadow="none" radius="none">
          {cardButtons}
          <p><strong>Query Context:</strong> {submittedText?.queryText}</p>
          <p><strong>Target Word:</strong> {submittedText?.targetWord}</p>
          <Divider className="my-4" />
          <Tabs aria-label="Options" variant="underlined">
            <Tab key="results" title="Full Results">
              <Accordion selectionMode="multiple">
                {data.map((item, index) => (
                  <AccordionItem
                    key={index}
                    title={ // Number(item['section']) !== sectionIndex &&
                      <p className="text-xs font-semibold py-1">
                        {textFiles.find(text => text.value === item.document)?.label}: {item.section}
                      </p>
                    }
                    subtitle={ // Number(item['section']) !== sectionIndex &&
                      <div>
                        <p className="text-sm">{highlightTokenInSentence(item.sentence, item.token)}</p>
                        <p className="text-xs font-semibold pt-1">Similarity: {roundScore(item.score)}</p>
                      </div>
                    }
                    textValue={`${textFiles.find(text => text.value === item.document)?.label}: ${item.section}`}
                    onPress={() => handleAccordionToggle(item.section, item.document, index)}
                  >
                    {itemStates[index]?.content ? (
                      <PassageView
                        title={`${itemStates[index].title}: ${item.section}`}
                        content={itemStates[index].content}
                        highlight={item.sentence}
                      />
                    ) : (
                      <p>Loading content...</p>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </Tab>
            <Tab key="aligned" title="Aligned Results">
              <AlignedResult results={data} />
            </Tab>
          </Tabs>
        </Card>
        : 
        <button onClick={onToggleDisplay} className='text-sm text-blue-500 hover:text-gray-500'>
          Show Results
        </button>
      } 
    </div>
  );
}
