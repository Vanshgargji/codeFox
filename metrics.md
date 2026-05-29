# 📈 CodeFox Retrieval Benchmark

## Semantic Code RAG Evaluation

The retrieval layer was evaluated using repository-level semantic search queries against indexed code embeddings stored in Pinecone.

### Results

| Metric | Test 1 (8 Queries) | Test 2 (7 Queries) | Test 3 (5 Queries) |
|----------|----------|----------|----------|
| Hit Rate | 100% ✅ | 100% ✅ | 80% |
| Recall | 100% | 95.2% | 56.7% |
| Precision | 28.6% | 30.6% | 17.1% |
| Avg Query Latency | 2.13s | 2.33s | 2.50s |
| Avg Embedding Latency | 898ms | 904ms | 980ms |

## Summary

- Repository indexing performed using Pinecone vector embeddings.
- Retrieval pipeline supports Semantic Code Search for Pull Request Reviews.
- Achieved up to **100% Hit Rate** and **95.2% Recall**.
- Average retrieval latency remained around **2.32 seconds**.
- Retrieval results are used as context for Gemini-powered PR review generation.

## Evaluation Screenshot

![Metrics Dashboard](./metrics.png)