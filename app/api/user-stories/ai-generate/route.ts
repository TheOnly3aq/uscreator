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

    // Create system prompt with clear instructions
    const systemPrompt = type === "story" 
      ? `You are an expert at creating user stories. Generate a user story based on the user's prompt. Return ONLY a valid JSON object with the following structure:
{
  "role": "string - the user role (e.g., 'user', 'admin', 'developer')",
  "action": "string - what the user wants to do (e.g., 'to save my preferences')",
  "benefit": "string - why the user wants this (e.g., 'I can have a personalized experience')",
  "background": "string - optional background/context information (can be empty string)",
  "additionalInfo": "string - optional additional information (can be empty string)",
  "acceptanceCriteria": ["array of strings - optional acceptance criteria"],
  "technicalInfo": ["array of strings - optional technical information"]
}

Important:
- Fill in role, action, and benefit based on the user's prompt
- If the prompt doesn't provide enough information, make reasonable assumptions
- Keep acceptanceCriteria and technicalInfo as arrays (can be empty arrays)
- Return ONLY the JSON object, no additional text or markdown formatting`
      : `You are an expert at creating bug reports. Generate a bug report based on the user's prompt. Return ONLY a valid JSON object with the following structure:
{
  "role": "string - the bug title/description (e.g., 'Users should be able to select the disabled filter without being redirected')",
  "action": "string - the scenario/steps to reproduce (can be markdown formatted with bullet points)",
  "benefit": "string - the expected result",
  "background": "string - the actual result (what actually happens)",
  "additionalInfo": "string - optional additional information (can be empty string)",
  "acceptanceCriteria": ["array of strings - optional acceptance criteria"],
  "technicalInfo": ["array of strings - optional technical information"]
}

Important:
- Fill in role (title), action (scenario/steps), benefit (expected result), and background (actual result) based on the user's prompt
- If the prompt doesn't provide enough information, make reasonable assumptions
- The action field can contain markdown-formatted steps (e.g., "- Step 1\\n- Step 2")
- Keep acceptanceCriteria and technicalInfo as arrays (can be empty arrays)
- Return ONLY the JSON object, no additional text or markdown formatting`;

    const userPrompt = `Create a ${type === "story" ? "user story" : "bug report"} based on this: ${prompt}`;

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "User Story Creator",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
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
        temperature: 0.7,
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

    // Parse the JSON response
    let parsedData: Partial<UserStoryData>;
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Validate and format the response
    const userStoryData: UserStoryData = {
      type,
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

