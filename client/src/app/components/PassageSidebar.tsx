"use client";

interface Section {
  title: string;
  indexLabel: string;
  content: string;
}

interface SidebarProps {
  isDualView: boolean;
  textFiles: { label: string; value: string }[];
  selectedText: string;
  onTextChange: (value: string, label: string) => void;
  sections: Section[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  title: string;
  onToggleSidebar: () => void;
}

export default function PassageSidebar(
  { isDualView,
    textFiles, 
    selectedText, 
    onTextChange, 
    sections, 
    selectedIndex, 
    onSelectIndex, 
    title, 
    onToggleSidebar
  }: SidebarProps) {
  return (
    <aside className="flex flex-col w-1/5 mr-8 p-4">
      <h1 className="font-semibold text-xl mb-2">Select Text ({title})</h1>
      {isDualView && 
        <button onClick={onToggleSidebar} className="items-start mb-4 p-2 text-xs hover:text-blue-500">
          Switch to {title === "Left" ? "Right" : "Left"} Sidebar
        </button>
      }
      <div className="mb-4">
        <ul className="space-y-2">
          {textFiles.map((file) => (
            <li
              key={file.value}
              onClick={() => onTextChange(file.value, file.label)}
              className={`cursor-pointer p-2 ${
                selectedText === file.value ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {file.label}
            </li>
          ))}
        </ul>
      </div>
      <h3 className="font-semibold mb-2">Sections</h3>
      <ul className="space-y-2 bg-white p-4 shadow-md h-64 overflow-y-auto">
        {sections.map((section, index) => (
          <li
            key={index}
            className={`cursor-pointer p-2 ${
              selectedIndex === index ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => onSelectIndex(index)}
          >
            {section.indexLabel}
          </li>
        ))}
      </ul>
    </aside>
  )
}