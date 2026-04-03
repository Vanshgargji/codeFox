import { pineconeIndex } from "@/lib/pinecone";

import { embed } from "ai";
import { google } from "@ai-sdk/google";


export async function generateEmbedding(text: string) {
  // 1. Guard against undefined or empty content
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn("⚠️ Skipping embedding: Content is empty or undefined");
    return null; 
  }

  try {
    console.log("🧠 Generating embedding...");

    const result = await embed({
      model: google.textEmbedding("gemini-embedding-001"),
      value: text.replace(/\n/g, ' '), // Clean up newlines for better vector quality
    });

    // 2. Safely extract the embedding
    // Vercel AI SDK usually puts it in 'embedding'. 
    // We use optional chaining and a fallback to null.
    const embedding = result?.embedding;

    // 3. Safety check before accessing .length
    if (!embedding || !Array.isArray(embedding)) {
      console.error("❌ Provider did not return a valid embedding array");
      return null;
    }

    console.log("✅ Embedding generated, length:", embedding.length);
    return embedding;

  } catch (error) {
    console.error("❌ Critical Error during embedding:", error);
    // Return null instead of throwing so the rest of your files can still be indexed
    return null; 
  }
}
// export async function generateEmbedding(text: string) {
// 	const { embedding } = await embed({
// 		model: google.textEmbedding("gemini-embedding-001"),
// 		value: text,
// 		providerOptions: {
// 			google: {
// 				outputDimensionality: 3072,
// 				taskType: "SEMANTIC_SIMILARITY",
// 			},
// 		},
// 	});

// 	return embedding;
// }

export async function indexCodebase(
	repoId: string,
	files: { path: string; content: string }[]
) {
	const vectors = [];

	for (const file of files) {
		const content = `File: ${file.path}\n\n${file.content}`;
		const truncatedContent = content.slice(0, 8000);

		try {
			const embedding = await generateEmbedding(truncatedContent);
			vectors.push({
				id: `${repoId}-${file.path.replace(/\//g, "_")}`,
				values: embedding,
				metadata: {
					repoId,
					filePath: file.path,
					content: truncatedContent,
				},
			});
		} catch (error) {
			console.error(`Failed to embed ${file.path}:`, error);
		}

		  return {
    success: true,
    vectorsStored: vectors.length,
  };
	}

	if (vectors.length > 0) {
		const batchSize = 100;

		for (let i = 0; i < vectors.length; i += batchSize) {
			const batch = vectors.slice(i, i + batchSize);
			await pineconeIndex.upsert({ records: batch });	
			console.log("Upserting to Pinecone...");
		}
	}

	console.log("Indexing completed");
}

export async function retrieveContext(
	query: string,
	repoId: string,
	topK: number = 5
) {
	const embedding = await generateEmbedding(query);

	const results = await pineconeIndex.query({
		vector: embedding,
		filter: { repoId },
		topK,
		includeMetadata: true,
	});

	return results.matches
		.map((match) => match.metadata?.content as string)
		.filter(Boolean);
}