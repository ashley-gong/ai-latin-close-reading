"use client"

import { useState } from 'react';
import { Textarea, Input } from "@nextui-org/react";
import { query } from '../../../utils/api';
import PassageViewContent from './PassageViewContent';
import { textFiles } from '../../../utils/constants';
import ResultsCard from './ResultsCard';


export default function NearestNeighborQuery() {
  const [queryText, setQueryText] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [submittedText, setSubmittedText] = useState<{ queryText: string; targetWord: string } | null>(null);
  const [displayResults, setDisplayResults] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(-1);
  const [querySent, setQuerySent] = useState(false);
  const [document, setDocument] = useState({ value: "", label: "" });
  const [resultSentence, setResultSentence] = useState('');
  const [numberResults, setNumberResults] = useState('');

  const handleSubmit = async () => {
    setSubmittedText({ queryText, targetWord });
    setLoading(true);
    const dataToSend = { targetWord: targetWord, queryText: queryText, numberResults: numberResults };
    try {
      setLoading(true);
      const responseData = await query(dataToSend);
      setData(responseData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setDisplayResults(true);
    }
  };

  const handleClear = () => {
    setQueryText('');
    setTargetWord('');
  };

  const handleSectionSelect = (currSection: string, currDocument: string, currSentence: string) => {
    setSectionIndex(Number(currSection));
    setResultSentence(currSentence);
    const currText = textFiles.find(text => text.value === currDocument);
    if (currText) {
      setDocument(currText);
    }
    setQuerySent(true);
  }

  const highlightTokenInSentence = (sentence: string, token: string) => {
    const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(\\b${escapedToken}\\b)`, 'gi');
    const parts = sentence.split(regex);   
    return parts.map((part, index) =>
      part.toLowerCase() === token.toLowerCase() ? (
        <span key={index} className="bg-blue-300">{part}</span>
      ) : (
        part
      )
    );
  };

  const roundScore = (score: number) => {
    const upperBoundedScore = score > 1 ? 1 : score;
    const lowerBoundedScore = upperBoundedScore < 0 ? 0 : upperBoundedScore;
    return lowerBoundedScore.toFixed(3);
  }

  return (
    <div className="flex flex-row row-start-2 items-start sm:items-start gap-4 w-full">
      <div className="w-4/5">
        <PassageViewContent 
          querySent={querySent} 
          sectionIndex={sectionIndex} 
          document={document}
          resultSentence={resultSentence}
          querySentence={queryText}>
            {submittedText && (
              <ResultsCard
                data={data}
                submittedText={submittedText}
                sectionIndex={sectionIndex}
                displayResults={displayResults}
                onToggleDisplay={() => setDisplayResults(!displayResults)}
                onSectionSelect={handleSectionSelect}
                onClearContext={() => {
                  setQuerySent(false);
                  setSectionIndex(-1);
                }}
                highlightTokenInSentence={highlightTokenInSentence}
                roundScore={roundScore}
              />
            )}
          </PassageViewContent>
      </div>
      <div className="w-1/5">
        <div className="flex w-full flex-col md:flex-nowrap gap-4">
          <h1 className="font-semibold text-xl">Contextual Nearest Neighbors Queries</h1>
          <p className='text-xs'>
            Model: 
            <a href='https://arxiv.org/pdf/2009.10053' 
              className='hover:text-blue-500'
              target="_blank" 
              rel="noopener noreferrer"
            > LatinBERT </a> 
            (Bamman and Burns 2020)
          </p>
          <Textarea 
            isMultiline
            size="lg"
            label="Query"
            placeholder=
              "Enter the phrase/sentence in which your target word appears. (Highlight from left text for best results."
            className="max-w-lg text-sm"
            radius="none"
            variant="bordered"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
          <Input 
            isClearable
            size="lg"
            type="text"
            variant="underlined"
            placeholder="Target word"
            radius="none"
            className="max-w-lg"
            value={targetWord}
            onClear={() => setTargetWord('')}
            onChange={(e) => setTargetWord(e.target.value)}
          />
          <Input 
            isClearable
            size="lg"
            type="text"
            variant="underlined"
            placeholder="# of Results (Default is 5)"
            radius="none"
            className="max-w-lg"
            value={numberResults}
            onClear={() => setNumberResults('')}
            onChange={(e) => setNumberResults(e.target.value)}
          />
          <div className='flex flex-row gap-4'>
            <button 
              onClick={handleSubmit} 
              className="w-1/2 p-2 bg-gray-500 hover:bg-gray-400 text-white rounded"
            >
              Submit
            </button>
            <button 
              onClick={handleClear} 
              className="w-1/2 p-2 hover:text-red-600"
            >
              Clear Query
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            null
          )}
          {/* {loading ? <div>Loading...</div> : (submittedText && displayResults ?
            (<Card className="mt-4 p-4 bg-slate-100 rounded-none max-h-[70vh] overflow-y-auto">
              <button onClick={() => setDisplayResults(false)} className='text-sm text-blue-500 hover:text-gray-500 pb-4'>
                Hide Results
              </button>
              <p><strong>Query Context:</strong> {submittedText.queryText}</p>
              <p><strong>Target Word:</strong> {submittedText.targetWord}</p>
              <Divider className="my-4" />
              <ul>
                { data.map((item, index) => (
                  <li key={index} className='pb-2'>
                    <p className='text-xs font-semibold py-1'>
                      {textFiles.find(text => text.value === item['document'])?.label}: {item['section']}
                    </p>
                    <p className="text-sm">{highlightTokenInSentence(item['sentence'], item['token'])}</p>
                    <p className='text-xs font-semibold pt-1'>Similarity: {roundScore(item['score'])}</p>
                    {Number(item['section']) == sectionIndex ? 
                      <button onClick={() => { setQuerySent(false); setSectionIndex(-1); }} className='text-xs text-blue-500 hover:text-gray-500'>
                        Clear passage context
                      </button> :                     
                      <button 
                        onClick={() => handleSectionSelect(item['section'], item['document'], item['sentence'])} 
                        className='text-xs text-blue-500 hover:text-gray-500'
                      >
                        View in context
                      </button>
                    }
                  </li>))
                }
              </ul>
            </Card>) :
            <button onClick={() => setDisplayResults(true)} className='text-sm text-blue-500 hover:text-gray-500'>
              Show Results
            </button>
            )} */}
        </div>
      </div>
    </div>
  )
}