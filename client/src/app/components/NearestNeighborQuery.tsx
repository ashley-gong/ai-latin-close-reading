"use client"

import { useState } from 'react';
import { Textarea, Input, Card, Divider } from "@nextui-org/react";
import { query } from '../../../utils/api';
import PassageViewContent from './PassageViewContent';
import { textFiles } from '../../../utils/constants';


export default function NearestNeighborQuery() {
  const [queryText, setQueryText] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [submittedText, setSubmittedText] = useState<{ queryText: string; targetWord: string } | null>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(-1);
  const [querySent, setQuerySent] = useState(false);
  const [document, setDocument] = useState({ value: "", label: "" });
  const [sentence, setSentence] = useState('');

  const handleSubmit = async () => {
    setSubmittedText({ queryText, targetWord });
    setLoading(true);
    const dataToSend = { targetWord: targetWord, queryText: queryText };
    try {
      setLoading(true);
      const responseData = await query(dataToSend);
      setData(responseData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSelect = (currSection: string, currDocument: string, currSentence: string) => {
    setSectionIndex(Number(currSection));
    setSentence(currSentence);
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
    return score.toFixed(3);
  }

  return (
    <div className="flex flex-row row-start-2 items-start sm:items-start gap-4 w-full">
      <div className="w-4/5">
        <PassageViewContent 
          querySent={querySent} 
          sectionIndex={sectionIndex} 
          document={document}
          sentence={sentence}
        />
      </div>
      <div className="w-1/5">
        <div className="flex w-full flex-col md:flex-nowrap gap-4">
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
            placeholder="Enter your nearest neighbor query"
            className="max-w-lg"
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
          <button 
            onClick={handleSubmit} 
            className="p-2 bg-gray-500 hover:bg-gray-400 text-white rounded"
          >
            Submit
          </button>
          {loading ? <div>Loading...</div> : submittedText && (
            <Card className="mt-4 p-4 bg-gray-100 rounded-none">
              <p><strong>Query:</strong> {submittedText.queryText}</p>
              <p><strong>Target Word:</strong> {submittedText.targetWord}</p>
              <Divider className="my-4" />
              <ul>
                { data.map((item, index) => (
                  <li key={index} className='pb-2'>
                    <p className='text-xs font-semibold pt-1'>Text: {item['document']}</p>
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
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}