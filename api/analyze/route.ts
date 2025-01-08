import { NextResponse } from 'next/server'

const BASE_API_URL = "https://api.langflow.astra.datastax.com"
const LANGFLOW_ID = "997701c0-5d41-4d72-889a-59ae545ef29e"
const APPLICATION_TOKEN = "AstraCS:LLTXTSpQLkbMmsrYHZoPZozu:967e589cac8f8222383fb00dfdb35923b664f554bbb0f3978d60e0f92cb75690"
const ENDPOINT = "social"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    
    const response = await fetch(`${BASE_API_URL}/lf/${LANGFLOW_ID}/api/v1/run/${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${APPLICATION_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input_value: message,
        output_type: "chat",
        input_type: "chat",
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}

