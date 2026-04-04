import prisma from "@/lib/db";
import { inngest } from "../client";
import { indexCodebase } from "@/modules/ai/lib/rag";
import { getRepoFileContents } from "@/modules/auth/github/lib/github";

export const indexRepo = inngest.createFunction(
  { 
    id: "index-repo", 
    retries: 3 // Allow 3 attempts if the network drops
  },
  { event: "repository.connected" },
  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;

    // 1. Fetch File List
    const files = await step.run("fetch-github-files", async () => {
      const account = await prisma.account.findFirst({
        where: { userId, providerId: "github" },
      });

      if (!account?.accessToken) throw new Error("No GitHub access token found");

      return await getRepoFileContents(account.accessToken, owner, repo);
    });

    // 2. Chunked Indexing
    const BATCH_SIZE = 25;
    let totalIndexed = 0;

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

      // 🛡️ FIX: Use dynamic step IDs so Inngest can track progress
      const result = await step.run(`index-chunk-${batchNumber}`, async () => {
        const indexResult = await indexCodebase(`${owner}/${repo}`, batch);
        
        // 🛡️ FIX: If index fails (e.g. 0 embeddings), return 0 count instead of 
        // throwing. This lets the function finish instead of retrying forever.
        if (!indexResult || !indexResult.success) {
          console.warn(`⚠️ Batch ${batchNumber} failed or was empty.`);
          return { success: true, count: 0 };
        }
        return indexResult;
      });
	
	  totalIndexed += ((result as any).count || 0);
    }

    return { 
      success: true, 
      repo: `${owner}/${repo}`,
      filesProcessed: files.length, 
      vectorsStored: totalIndexed 
    };
  }
);

// import prisma from "@/lib/db";
// import { inngest } from "../client";


// import { indexCodebase } from "@/modules/ai/lib/rag";
// import { getRepoFileContents } from "@/modules/auth/github/lib/github";

// export const indexRepo = inngest.createFunction(
// 	{ id: "index-repo" },
// 	{ event: "repository.connected" },
// 	async ({ event, step }) => {
// 		const { owner, repo, userId } = event.data;

// 		const files = await step.run("fetch-files-index-codebase", async () => {
// 			const account = await prisma.account.findFirst({
// 				where: {
// 					userId: userId,
// 					providerId: "github",
// 				},
// 			});

// 			if (!account?.accessToken) {
// 				throw new Error("No GitHub access token found");
// 			}

// 			return await getRepoFileContents(
// 				account.accessToken,
// 				owner,
// 				repo
// 			);

		
// 		});

// 		await step.run("index-codebase", async () => {
// 		return await indexCodebase(`${owner}/${repo}`, files);
// 			// Index immediately and return only metadata
// 			// await indexCodebase(`${owner}/${repo}`, files);

// 			// return files.length;
// 		});

// 		return { success: true, indexedFiles: files.length };
// 	}
// );