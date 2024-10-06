// import { createGoogleGenerativeAI } from "@ai-sdk/google";
import apiResponse from "@/helpers/apiResponse";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
    console.log("apiKey", apiKey);

    if (!apiKey) {
      throw new Error(
        "API key is missing. Set it as GOOGLE_GENERATIVE_AI_API_KEY."
      );
    }
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const model = google("gemini-1.5-pro-latest");
    const text = await generateText({
      model,
      prompt,
      maxTokens: 150,
    });
    console.log(text.text);

    // apiResponse(true, "few suggested message", 200, text.text);
    Response.json({ text: text.text }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      Response.json({ error: error.message }, { status: 500 });
    }
  }
}

// export default async function GET() {
//   try {
//     const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!; // Ensure the API key is set

//     if (!apiKey) {
//       throw new Error(
//         "API key is missing. Set it as GOOGLE_GENERATIVE_AI_API_KEY."
//       );
//     }

//     // Assuming the SDK automatically uses the API key from environment variables
//     const model = google("gemini-1.5-pro-latest");

//     const encoder = new TextEncoder();
//     const stream = new ReadableStream({
//       async start(controller) {
//         const textStream = await generateText({
//           model, // Pass the model instance
//           prompt: "Write a vegetarian lasagna recipe for 4 people.",
//           maxTokens: 150, // Limit output to 150 tokens
//           stream: true, // If streaming option is supported
//         });

//         // Handle each chunk of the stream
//         for await (const chunk of textStream) {
//           controller.enqueue(encoder.encode(chunk.text));
//         }

//         // Close the stream
//         controller.close();
//       },
//     });

//     return new Response(stream, {
//       headers: { "Content-Type": "text/plain" },
//       status: 200,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   }
// }

// //
