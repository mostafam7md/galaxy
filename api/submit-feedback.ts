import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "contentful-management";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, rating, comment } = req.body;

    // Validate required fields
    if (!name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, rating, and comment are required",
      });
    }

    // Validate rating
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    // Get environment variables (these are set in Vercel dashboard)
    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";

    if (!managementToken || !spaceId) {
      console.error("Missing Contentful configuration");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Create Contentful management client
    const client = createClient({
      accessToken: managementToken,
    });

    // Get space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);

    // Create the feedback entry
    const entry = await environment.createEntry("feedback", {
      fields: {
        name: { "en-US": name },
        email: { "en-US": email || "" },
        rating: { "en-US": rating },
        comment: { "en-US": comment },
        createdAt: { "en-US": new Date().toISOString() },
        approved: { "en-US": false },
      },
    });

    console.log("Feedback submitted successfully:", entry.sys.id);

    return res.status(200).json({
      success: true,
      message: "Thank you! Your feedback has been submitted successfully.",
      entryId: entry.sys.id,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback. Please try again later.",
    });
  }
}
