import { OpenAI } from "openai";
import { NextResponse } from "next/server"; // Import NextResponse
import profiles from "@/data/profile.json";
import templates from "@/data/templates.json";

// Validate API key before creating the client
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key is not configured");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { jobDescription, template, profileId, returnPromptOnly } = await req.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    if (!profileId) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    const selectedProfile = profiles.profiles.find((p) => p.id === profileId);

    if (!selectedProfile) {
      return NextResponse.json(
        { error: `Profile with ID "${profileId}" not found` },
        { status: 404 }
      );
    }

    const selectedTemplate =
      templates[template as keyof typeof templates] || templates.standard;

    const skills = selectedProfile.skills.join(", ");
    const portfolioItems = selectedProfile.portfolio
      .map(
        (project) =>
          `• **${project.title}**: ${project.description} (${project.link})`
      )
      .join("\n");

    const initialText = `
Give me a cover letter for a job in Upwork. This is my profile:

- **Name**: ${selectedProfile.name}
- **Profession**: ${selectedProfile.profession}
- **Profile URL**: ${selectedProfile.profileUrl}
- **Summary**: ${selectedProfile.summary}
- **Skills**: ${skills}
- **Portfolio**:
${portfolioItems}

The job description is:
${jobDescription}
`;

    const processedTemplate =
      initialText +
      selectedTemplate.template
        .replace("${profile.name}", selectedProfile.name)
        .replace("${profile.profession}", selectedProfile.profession)
        .replace("${profile.profileUrl}", selectedProfile.profileUrl)
        .replace("${profile.summary}", selectedProfile.summary)
        .replace(
          "${profile.skills.join(', ')}",
          selectedProfile.skills.join(", ")
        )
        .replace(
          "${profile.portfolio.map(p => p.title).join(', ')}",
          selectedProfile.portfolio.map((p) => p.title).join(", ")
        );

    if (returnPromptOnly) {
      return NextResponse.json({ processedTemplate });
    }

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: processedTemplate }],
        model: "gpt-4",
        temperature: 0.7,
        max_tokens: 500,
      });

      const proposal = completion.choices[0]?.message?.content;

      if (!proposal) {
        throw new Error("No proposal was generated");
      }

      return NextResponse.json({ proposal });
    } catch (openaiError: any) {
      console.error("OpenAI API Error:", openaiError);

      if (openaiError.status === 401) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key. Please check your configuration." },
          { status: 401 }
        );
      } else if (openaiError.status === 429) {
        return NextResponse.json(
          { error: "OpenAI API rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }

      throw new Error(openaiError.message || "Failed to generate proposal");
    }
  } catch (error: any) {
    console.error("Error in generateProposal:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: error.status || 500 }
    );
  }
}
