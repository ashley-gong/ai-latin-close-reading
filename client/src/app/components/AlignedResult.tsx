import { textFiles } from "../../../utils/constants";

interface Props {
  results: ResultItem[];
}

export default function AlignedResult(data: Props) {
  const splitByToken = (sentence: string, token: string) => {
    const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(\\b${escapedToken}\\b)`, 'i');
    const [before, match, after] = sentence.split(regex);   
    return [before, match, after];
  };

  const truncateWords = (text: string, count: number, fromStart = true) => {
    const words = text.trim().split(/\s+/);
    return fromStart ? words.slice(-count).join(' ') : words.slice(0, count).join(' ');
  };

  return (
    <div className="flex flex-col gap-2">
      { data.results.map((item, index) => (
          <div key={index} className="flex flex-row items-center py-2">
            <div className="flex text-xs font-semibold w-1/6">
              {textFiles.find((text) => text.value === item.document)?.label}: {item.section}
            </div>

            <div className="flex flex-row items-center w-5/6">
              <span className="truncate text-right w-1/2 pr-1 text-sm whitespace-nowrap">
                ...{truncateWords(splitByToken(item.sentence, item.token)[0] || '', 4, true)}
              </span>
              <div className="flex text-left w-1/2 items-center text-sm min-w-0">
                <span className="bg-blue-300 font-semibold whitespace-nowrap text-left text-sm">
                  {splitByToken(item.sentence, item.token)[1]}
                </span>
                <span className="truncate text-left pl-1 text-sm">
                  {truncateWords(splitByToken(item.sentence, item.token)[2] || '', 4, false)}
                </span>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}