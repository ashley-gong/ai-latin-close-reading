"use client"

import { Textarea, Input } from "@nextui-org/react";

export default function NearestNeighborQuery() {
  return (
    <div className="flex w-[40vh] flex-col md:flex-nowrap gap-4">
      <Textarea 
        isMultiline
        size="lg"
        label="Query"
        placeholder="Enter your nearest neighbor query"
        className="max-w-lg"
        radius="none"
        variant="bordered"
      />
      <Input 
        isClearable
        size="lg"
        type="text"
        variant="underlined"
        placeholder="Target word"
        radius="none"
        onClear={() => console.log("cleared")}
        className="max-w-lg"
      />
    </div>
  )
}