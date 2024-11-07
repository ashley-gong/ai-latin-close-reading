"use client"

import { useState } from 'react';
import { Textarea, Input, Card, Divider } from "@nextui-org/react";
import { query } from '../../../utils/api';


export default function NearestNeighborQuery() {
  const [queryText, setQueryText] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [submittedText, setSubmittedText] = useState<{ queryText: string; targetWord: string } | null>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
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
        onChange={(e) => setQueryText(e.target.value)} // Update state
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
        onChange={(e) => setTargetWord(e.target.value)} // Update state
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
              <li key={index} className="text-sm">Similarity: 0.9 | {item} </li>))
            }
          </ul>
        </Card>
      )}
    </div>
  )
}