"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { SavedAssessment } from "@/lib/cvss-types"

interface SavedAssessmentsProps {
  assessments: SavedAssessment[]
  onLoad: (assessment: SavedAssessment) => void
  onDelete: (id: string) => void
}

export default function SavedAssessments({ assessments, onLoad, onDelete }: SavedAssessmentsProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

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

  if (assessments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-mono text-green-400/80">No saved assessments yet.</p>
        <p className="font-mono text-green-400/60 text-sm mt-2">
          Save your current assessment to compare it with future evaluations.
        </p>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="bg-gray-700 rounded-lg p-4 pixelated-border flex flex-col md:flex-row justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-pixel text-green-400 mr-2">{assessment.name}</h3>
                  <Badge className={`font-mono text-xs ${getSeverityColor(assessment.scores.severity)}`}>
                    {assessment.scores.severity}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-mono text-green-400/80">Score: {assessment.scores.finalScore.toFixed(1)}</p>
                  <p className="font-mono text-green-400/60 text-sm">{formatDate(assessment.date)}</p>
                </div>
                <p className="font-mono text-green-400/60 text-xs mt-1 truncate">{assessment.vector}</p>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0 md:ml-4">
                <Button variant="outline" size="sm" className="pixelated-border" onClick={() => onLoad(assessment)}>
                  <FileText className="h-4 w-4 mr-1" /> Load
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="pixelated-border text-red-400 hover:text-red-300"
                  onClick={() => setDeleteId(assessment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-800 text-green-400 pixelated-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-pixel">Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription className="font-mono">
              Are you sure you want to delete this assessment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-pixel pixelated-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="font-pixel pixelated-border bg-red-600 hover:bg-red-500 text-white"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
