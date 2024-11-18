"use client"

import { useState } from 'react';
import { Textarea, Input } from "@nextui-org/react";
import { query } from '../../../utils/api';
import PassageViewContent from './PassageViewContent';
import ResultsCard from './ResultsCard';
import { highlightTokenInSentence } from '../../../utils/utils';


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
    console.log("loading");
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
      console.log("done");
    }
  };

  const handleClear = () => {
    setQueryText('');
    setTargetWord('');
    setLoading(false);
    setDoneLoading(false);
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
            {submittedText && (
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
              className="w-1/2 p-2 bg-blue-500 hover:bg-blue-300 text-white rounded"
            >
              Submit
            </button>
            <button 
              onClick={handleClear} 
              className="w-1/2 p-2 text-red-600 hover:text-red-900"
            >
              Clear Query (and Results)
            </button>
          </div>
          {loading ? <div>Loading...</div> : (doneLoading && <div>Done!</div>)}
        </div>
      </div>
    </div>
  )
}