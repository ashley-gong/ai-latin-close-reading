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
  const [queryError, setQueryError] = useState(false);

  const handleSubmit = async () => {
    console.log(queryText);
    console.log(targetWord);
    setSubmittedText({ queryText, targetWord });
    setLoading(true);
    setDoneLoading(false);
    const dataToSend = { targetWord: targetWord, queryText: queryText, numberResults: numberResults };
    try {
      setLoading(true);
      const responseData = await query(dataToSend);
      setData(responseData);
      setDoneLoading(true);
      setLoading(false);
      setDisplayResults(true);
    } catch (error) {
      console.error("Error:", error);
      setQueryError(true);
      setLoading(false);
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

  const resultMessage = () => {
    if (loading) {
      return <div>Loading...</div> 
    } else {
      if (doneLoading) {
        return <div>Done! View results in single/query view.</div>
      } else if (queryError) {
        return <div>Failed to fetch! Double check your query and target word such that neither are empty and your target word appears in your query.</div>
      } 
    }
  }

  return (
    <div className="flex flex-row row-start-2 items-start sm:items-start gap-1 w-full">
      <div className="w-5/6">
        <PassageViewContent 
          querySent={doneLoading} 
          querySentence={queryText}>
            {submittedText && (
              <ResultsCard
                data={data}
                submittedText={submittedText}
                displayResults={displayResults}
                onToggleDisplay={() => setDisplayResults(!displayResults)}
                roundScore={roundScore}
              />
            )}
          </PassageViewContent>
      </div>
      <div className="w-1/6">
        <div className="flex flex-col md:flex-nowrap gap-y-4 pl-4">
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
              "Enter the phrase/sentence in which your target word appears."
            description="Highlight from left text for best results."
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
            description="Enter the word for which you want to find similar usages."
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
            placeholder="Number of Results"
            description="The default number (if this field is left empty) is 5. The maximum number is 30."
            radius="none"
            className="max-w-lg"
            value={numberResults}
            onClear={() => setNumberResults('')}
            onChange={(e) => setNumberResults(e.target.value)}
            isInvalid={Number(numberResults) > 30}
            errorMessage="Number of results cannot exceed 30."
          />
          <div className='flex flex-row gap-4'>
            <button 
              onClick={handleSubmit} 
              className="w-1/2 p-2 bg-blue-500 hover:bg-blue-300 text-white text-sm rounded"
            >
              Submit
            </button>
            <button 
              onClick={handleClear} 
              className="w-1/2 p-2 text-red-600 hover:text-red-900 text-sm"
            >
              Clear Query (and Results)
            </button>
          </div>
          {resultMessage()}
        </div>
      </div>
    </div>
  )
}