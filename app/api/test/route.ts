import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "API is working!" if you can read this.' }],
      model: 'gpt-3.5-turbo',
      max_tokens: 10,
    });

    return NextResponse.json({ 
      status: 'success',
      message: completion.choices[0]?.message?.content || 'No response',
      model: completion.model
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ 
      status: 'error',
      error: error.message 
    }, { 
      status: error.status || 500 
    });
  }
}