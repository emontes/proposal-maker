import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import profile from '@/data/profile.json';

// Validate API key before creating the client
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OpenAI API key is not configured');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Validate API key format
    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key format. The key should start with "sk-"' },
        { status: 401 }
      );
    }

    const { jobDescription, template } = await req.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const templates = {
      'ask-questions': `Generate a proposal for the following job description:
"${jobDescription}"

- Start with enthusiasm and an emoji
- Introduce ${profile.name} as a ${profile.profession} with expertise in ${profile.skills.join(', ')}
- Ask 2-3 relevant questions about the project
- End with a friendly call to action`,
      
      'standard': `Write a concise proposal for the job description:
"${jobDescription}"

- Highlight ${profile.name}'s skills in web development and automation
- Mention specific tools like ${profile.skills.join(', ')}
- Include relevant experience from portfolio: ${profile.portfolio.map(p => p.title).join(', ')}
- Close with a professional call to action`
    };

    const selectedTemplate = templates[template as keyof typeof templates] || templates.standard;

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: selectedTemplate }],
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 500,
      });

      const proposal = completion.choices[0]?.message?.content;

      if (!proposal) {
        throw new Error('No proposal was generated');
      }

      return NextResponse.json({ proposal });
    } catch (openaiError: any) {
      console.error('OpenAI API Error:', openaiError);
      
      // More specific error messages based on OpenAI error types
      if (openaiError.status === 401) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key. Please check your configuration.' },
          { status: 401 }
        );
      } else if (openaiError.status === 429) {
        return NextResponse.json(
          { error: 'OpenAI API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      } else if (openaiError.code === 'insufficient_quota') {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please check your billing status.' },
          { status: 402 }
        );
      }
      
      throw new Error(openaiError.message || 'Failed to generate proposal');
    }
  } catch (error: any) {
    console.error('Error in generateProposal:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: error.status || 500 }
    );
  }
}