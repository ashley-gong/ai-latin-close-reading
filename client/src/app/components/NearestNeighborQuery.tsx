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

  // Handle the submit button click
  const handleSubmit = async () => {
    setSubmittedText({ queryText, targetWord });
    setLoading(true);
    const dataToSend = { targetWord: targetWord, queryText: queryText }; // Replace with the actual data you want to send
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

  const handleSectionSelect = (currSection: string, currDocument: string) => {
    console.log(currDocument);
    setSectionIndex(Number(currSection));
    const currText = textFiles.find(text => text.value === currDocument);
    console.log(currText);
    if (currText) {
      setDocument(currText);
    }
    setQuerySent(true);
  }

  return (
    <div className="flex flex-row row-start-2 items-start sm:items-start gap-4 w-full">
      <div className="w-4/5">
        <PassageViewContent querySent={querySent} sectionIndex={sectionIndex} document={document} />
      </div>
      <div className="w-1/5">
        <div className="flex w-full flex-col md:flex-nowrap gap-4">
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
            <Card className="mt-4 p-4 bg-gray-100">
              <p><strong>Query:</strong> {submittedText.queryText}</p>
              <p><strong>Target Word:</strong> {submittedText.targetWord}</p>
              <Divider className="my-4" />
              <ul>
                { data.map((item, index) => (
                  <li key={index}>
                    <p className="text-sm">{item['token']} | {item['sentence']} | {item['document']}</p>
                    <p className='text-xs'>Similarity: {item['score']}</p>
                    {Number(item['section']) == sectionIndex ? 
                      <button onClick={() => { setQuerySent(false); setSectionIndex(-1);}} className='text-xs'>
                        Clear passage context
                      </button> :                     
                      <button onClick={() => handleSectionSelect(item['section'], item['document'])} className='text-xs'>
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