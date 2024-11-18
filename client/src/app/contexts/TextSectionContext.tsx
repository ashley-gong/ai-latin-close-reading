"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface Section {
  title: string;
  indexLabel: string;
  content: string;
}

interface TextSectionContextProps {
  leftText: { value: string; label: string };
  setLeftText: (value: { value: string; label: string }) => void;
  rightText: { value: string; label: string };
  setRightText: (value: { value: string; label: string }) => void;
  leftSections: Section[];
  setLeftSections: (sections: Section[]) => void;
  rightSections: Section[];
  setRightSections: (sections: Section[]) => void;
  querySections: Section[];
  setQuerySections: (sections: Section[]) => void;
  loadSections: (textFile: string, textTitle: string) => Promise<Section[]>;
}

const TextSectionContext = createContext<TextSectionContextProps | undefined>(undefined);

export const TextSectionProvider = ({ children }: { children: ReactNode }) => {
  const [leftText, setLeftText] = useState({ value: "caesar_gall1.txt", label: "Caesar Gallic Wars Book 1" });
  const [rightText, setRightText] = useState({ value: "catullus.txt", label: "Catullus" });
  const [leftSections, setLeftSections] = useState<Section[]>([]);
  const [rightSections, setRightSections] = useState<Section[]>([]);
  const [querySections, setQuerySections] = useState<Section[]>([]);

  const loadSections = useCallback(async (textFile: string, textTitle: string): Promise<Section[]> => {
    const response = await fetch(`/${textFile}`);
    if (!response.ok) throw new Error("Failed to load file");
    const text = await response.text();
    const numberedSections = text.match(/\[\s*\d+\s*\][\s\S]*?(?=\[\s*\d+\s*\]|$)/g) || [];
    return numberedSections.map((section, i) => {
      const indexLabelMatch = section.match(/\[\s*(\d+)\s*\]/);
      const title = textTitle;
      const indexLabel = indexLabelMatch ? `${indexLabelMatch[1]}` : `${i + 1}`;
      const content = section;
      return { title, indexLabel, content };
    });
  }, []);

  return (
    <TextSectionContext.Provider
      value={{
        leftText,
        setLeftText,
        rightText,
        setRightText,
        leftSections,
        setLeftSections,
        rightSections,
        setRightSections,
        querySections,
        setQuerySections,
        loadSections,
      }}
    >
      {children}
    </TextSectionContext.Provider>
  );
};

export const useTextSectionContext = () => {
  const context = useContext(TextSectionContext);
  if (!context) {
    throw new Error("useTextSectionContext must be used within a TextSectionProvider");
  }
  return context;
};
