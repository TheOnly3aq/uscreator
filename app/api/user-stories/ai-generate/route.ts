import { NextRequest, NextResponse } from "next/server";
import { UserStoryData } from "@/types/userStory";

/**
 * POST handler - generates user story or bug using OpenRouter AI
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (type !== "story" && type !== "bug") {
      return NextResponse.json(
        { error: "Type must be 'story' or 'bug'" },
        { status: 400 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = type === "story" 
      ? `You are an expert at creating user stories. Generate a user story based STRICTLY on the user's prompt. Return ONLY a valid JSON object with the following structure:
{
  "title": "string - a concise, descriptive title for the user story (e.g., 'User Preference Saving Feature')",
  "role": "string - the user role (e.g., 'user', 'admin', 'developer')",
  "action": "string - what the user wants to do (e.g., 'to save my preferences')",
  "benefit": "string - why the user wants this (e.g., 'I can have a personalized experience')",
  "background": "string - optional background/context information (can be empty string)",
  "additionalInfo": "string - optional additional information (can be empty string)",
  "acceptanceCriteria": ["array of strings - optional acceptance criteria"],
  "technicalInfo": ["array of strings - optional technical information"]
}

CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:
- Generate a concise, descriptive title (3-8 words) that summarizes the user story
- ONLY use information that is explicitly stated or clearly implied in the user's prompt
- DO NOT add details, features, or information that are not mentioned in the user's prompt
- DO NOT make assumptions or invent details that aren't in the prompt
- If the prompt doesn't provide information for a field, leave it as an empty string or empty array
- Keep the output minimal and focused - only extract what is actually in the prompt
- For acceptanceCriteria and technicalInfo: only include items if they are explicitly mentioned in the prompt, otherwise use empty arrays []
- Return ONLY the JSON object, no additional text or markdown formatting`
      : `You are an expert at creating bug reports. Generate a bug report based STRICTLY on the user's prompt. Return ONLY a valid JSON object with the following structure:
{
  "title": "string - a concise, descriptive title for the bug (e.g., 'Disabled Filter Redirects to Undefined Page')",
  "role": "string - the bug title/description (e.g., 'Users should be able to select the disabled filter without being redirected')",
  "action": "string - the scenario/steps to reproduce (can be markdown formatted with bullet points)",
  "benefit": "string - the expected result",
  "background": "string - the actual result (what actually happens)",
  "additionalInfo": "string - optional additional information (can be empty string)",
  "acceptanceCriteria": ["array of strings - optional acceptance criteria"],
  "technicalInfo": ["array of strings - optional technical information"]
}

CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:
- Generate a concise, descriptive title (3-8 words) that summarizes the bug
- ONLY use information that is explicitly stated or clearly implied in the user's prompt
- DO NOT add details, features, or information that are not mentioned in the user's prompt
- DO NOT make assumptions or invent details that aren't in the prompt
- If the prompt doesn't provide information for a field, leave it as an empty string or empty array
- Keep the output minimal and focused - only extract what is actually in the prompt
- The action field can contain markdown-formatted steps (e.g., "- Step 1\\n- Step 2") ONLY if steps are provided in the prompt
- For acceptanceCriteria and technicalInfo: only include items if they are explicitly mentioned in the prompt, otherwise use empty arrays []
- Return ONLY the JSON object, no additional text or markdown formatting`;

    const userPrompt = `Create a ${type === "story" ? "user story" : "bug report"} based STRICTLY on the following information. Do NOT add any details, features, or information that are not explicitly mentioned here:

${prompt}

Remember: Only extract and use information that is actually provided above. Leave fields empty if the information is not present.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "User Story Creator",
      },
      body: JSON.stringify({
        model: "anthropic/claude-haiku-4.5",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate user story" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }

    let parsedData: Partial<UserStoryData>;
    try {
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content, parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const userStoryData: UserStoryData = {
      type,
      title: parsedData.title || "",
      role: parsedData.role || "",
      action: parsedData.action || "",
      benefit: parsedData.benefit || "",
      background: parsedData.background || "",
      additionalInfo: parsedData.additionalInfo || "",
      acceptanceCriteria: Array.isArray(parsedData.acceptanceCriteria)
        ? parsedData.acceptanceCriteria.filter((item) => item && item.trim())
        : [],
      technicalInfo: Array.isArray(parsedData.technicalInfo)
        ? parsedData.technicalInfo.filter((item) => item && item.trim())
        : [],
    };

    return NextResponse.json({ data: userStoryData });
  } catch (error) {
    console.error("Error generating user story:", error);
    return NextResponse.json(
      { error: "Failed to generate user story" },
      { status: 500 }
    );
  }
}

