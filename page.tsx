'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    question: string;
    analysis: string;
    timestamp: string;
  } | null>(null)

  const handleAnalyze = async () => {
    if (!input.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()
      const analysisText = data.outputs?.[0]?.outputs?.[0]?.results?.message?.text || 'Could not generate analysis'

      setResult({
        question: input,
        analysis: analysisText,
        timestamp: new Date().toLocaleString(),
      })
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">📊 Social Media Content Analyzer</h1>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">
              Get AI-powered insights about your social media content strategy.
              Ask questions about what content to post, when to post, and how to improve engagement.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Textarea
                placeholder="E.g., Should I post Static images or carousels for coding content?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[100px] mb-4"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !input.trim()}
                >
                  {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isAnalyzing ? 'Analyzing...' : '🔍 Analyze'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={isAnalyzing || (!input && !result)}
                >
                  🔄 Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">🤔 Your Question</h3>
                    <p className="text-gray-700">{result.question}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">📊 Analysis Results</h3>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{result.analysis}</ReactMarkdown>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 pt-4 border-t">
                    Analysis generated at: {result.timestamp}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <footer className="text-center mt-8 text-sm text-gray-500">
          Built with Next.js | Powered by LangFlow
        </footer>
      </div>
    </main>
  )
}

