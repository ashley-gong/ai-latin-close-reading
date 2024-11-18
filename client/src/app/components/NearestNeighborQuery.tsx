"use client"

import { useState } from 'react';
import { Textarea, Input } from "@nextui-org/react";
import { query } from '../../../utils/api';
import PassageViewContent from './PassageViewContent';
import ResultsCard from './ResultsCard';


export default function NearestNeighborQuery() {
  const [queryText, setQueryText] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [submittedText, setSubmittedText] = useState<{ queryText: string; targetWord: string } | null>(null);
  const [displayResults, setDisplayResults] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [numberResults, setNumberResults] = useState('');

  const handleSubmit = async () => {
    setSubmittedText({ queryText, targetWord });
    setLoading(true);
    setDoneLoading(false);
    const dataToSend = { targetWord: targetWord, queryText: queryText, numberResults: numberResults };
    try {
      setLoading(true);
      const responseData = await query(dataToSend);
      setData(responseData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setDoneLoading(true);
      setDisplayResults(true);
    }
  };

  const handleClear = () => {
    setQueryText('');
    setTargetWord('');
  };

  // const handleSectionSelect = (currSection: string, currDocument: string, currSentence: string) => {
  //   setSectionIndex(Number(currSection));
  //   setResultSentence(currSentence);
  //   const currText = textFiles.find(text => text.value === currDocument);
  //   if (currText) {
  //     setDocument(currText);
  //   }
  // }

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
    <div className="flex flex-row row-start-2 items-start sm:items-start w-full">
      <div className="w-4/5">
        <PassageViewContent 
          querySent={doneLoading} 
          querySentence={queryText}>
            {loading ? <div>Loading...</div> : submittedText && (
              <ResultsCard
                data={data}
                submittedText={submittedText}
                displayResults={displayResults}
                onToggleDisplay={() => setDisplayResults(!displayResults)}
                highlightTokenInSentence={highlightTokenInSentence}
                roundScore={roundScore}
              />
            )}
          </PassageViewContent>
      </div>
      <div className="w-1/5">
        <div className="flex w-full flex-col md:flex-nowrap gap-y-4">
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
        </div>
      </div>
    </div>
  )
}