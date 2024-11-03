// plan: box component displaying passage, sidebar of preloaded texts
import { Card, CardBody, CardHeader } from "@nextui-org/react"

interface PassageViewProps {
  title: string;
  content: string;
}

export default function PassageView({title, content}: PassageViewProps) {
  return (
    <div>
      <Card className="bg-slate-100 px-1 py-4 max-w-[50vh] flex flex-col" shadow="none" radius="none">
        <CardHeader>
          <h4 className="font-bold text-large">{title}</h4>
        </CardHeader>
        <CardBody className="overflow-y-auto whitespace-pre-wrap">
          <p className="text-m">{content}</p>
        </CardBody>
      </Card>
    </div>
  )
}