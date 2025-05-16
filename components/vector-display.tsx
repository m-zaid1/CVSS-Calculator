"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface VectorDisplayProps {
  vector: string
}

export default function VectorDisplay({ vector }: VectorDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(vector)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="relative">
      <div className="font-mono text-sm bg-gray-700 p-3 rounded overflow-x-auto pixelated-border">
        <code className="text-green-400 break-all">{vector}</code>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 pixelated-border"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
}
