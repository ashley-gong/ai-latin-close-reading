// plan: box component displaying passage, sidebar of preloaded texts
import { Card, CardBody, CardHeader } from "@nextui-org/react"

interface PassageViewProps {
  title: string;
  content: string;
  highlight: string;
}

export default function PassageView({title, content, highlight}: PassageViewProps) {

  const processStringCompare = (part: string) => {
    return part.replace(/\[\d+\]|\d+|\n/g, '').toLowerCase();
  }
  
  const highlightSentenceInPassage = (sentence: string, passage: string) => {
    if (sentence === "") {
      return passage;
    }
    const rawSentence = sentence.replace(/ \/ /g, '\n');
    const escapedSentence = rawSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSentence})`, 'gi');
    const parts = passage.split(regex); 
    return parts.map((part, index) =>
      processStringCompare(part) === processStringCompare(rawSentence) ? (
        <span key={index} className="bg-blue-200">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div>
      <Card className="bg-slate-100 px-1 py-4 max-w-[50vh] flex flex-col" shadow="none" radius="none">
        <CardHeader>
          <h4 className="font-bold text-large">{title}</h4>
        </CardHeader>
        <CardBody className="overflow-y-auto whitespace-pre-wrap">
          <p className="text-m">{highlightSentenceInPassage(highlight, content)}</p> 
          {/* highlightSentenceInPassage(highlight, content) */}
        </CardBody>
      </Card>
    </div>
  )
}