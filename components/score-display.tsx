import { Badge } from "@/components/ui/badge"

interface ScoreDisplayProps {
  score: number
  severity: string
}

export default function ScoreDisplay({ score, severity }: ScoreDisplayProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-black"
      case "Low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="text-6xl font-pixel text-green-400 mb-2">{score.toFixed(1)}</div>
      <Badge className={`font-pixel text-sm px-3 py-1 ${getSeverityColor(severity)} pixelated-border`}>
        {severity}
      </Badge>
    </div>
  )
}
