**Language:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-Hant.md) | [日本語](README.ja.md)

# @sixtdreamnight/companion-engine

**Conversation companion engine — profiles, relationships, memory, safety, and message pipelines.**

Powers [Yumema](https://github.com/dreamnight16/Yumema).

[![npm version](https://img.shields.io/npm/v/@sixtdreamnight/companion-engine.svg)](https://www.npmjs.com/package/@sixtdreamnight/companion-engine)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![TypeScript](https://img.shields.io/badge/%3C/%3E-TypeScript-3178C6.svg)](https://www.typescriptlang.org/)

---

## Installation

```bash
npm install @sixtdreamnight/companion-engine
```

## Quick Start

```typescript
import {
  createAIProvider,
  loadConfig,
  loadProfile,
  processMessage,
  processMessageStream,
} from "@sixtdreamnight/companion-engine";
import "dotenv/config";

const config = await loadConfig();
const profile = await loadProfile();
if (!profile) throw new Error("Missing data/profile.json");
const model = await createAIProvider(config.ai);
const context = { model, config, profile };

// Standard pipeline
const reply = await processMessage("user-1", "Hello!", context);
console.log(reply);

// Streaming pipeline (token-level)
for await (const chunk of processMessageStream("user-1", "Hello!", context)) {
  process.stdout.write(chunk);
}
```

## API Overview

| Module | Description |
|--------|-------------|
| **Config** | Load and manage app configuration, profiles, environment variables |
| **Pipeline** | 5-stage message pipeline with streaming support + persistent checkpoints |
| **Personality** | Character engine — mood, topic suggestion, emotional support, session management |
| **Emotion** | Stateful emotion model — 7 emotions with probabilistic transitions |
| **Relationship** | Affection system, relationship stages, confession/breakup, affection decay, multi-character |
| **Memory** | Short-term / long-term memory, summarization, forgetting curve, semantic search |
| **Safety** | Regex safety by default, optional injected LLM/composite checker, profile validation |
| **Scheduler** | Cron-based background task scheduler |
| **Search** | Web search and conversation history search |
| **Checkpointer** | Persistent session state (JSON default) |
| **Embedding** | Text vectorization for semantic memory (TF-IDF default) |
| **Validation** | Zod runtime schema validation |
| **MBTI** | Conversation-based MBTI inference |
| **Card Import** | SillyTavern V1/V2/V3 + Character.AI character card import |

## Key Features (v0.5.0)

- **Persistent sessions**: `JsonCheckpointer` survives process restarts
- **Streaming pipeline**: `processMessageStream()` token-level async generator
- **Emotion model**: 7-state emotional system with intensity tracking
- **Affection decay**: Gradual affection loss after 7 days of inactivity
- **Multi-character relationships**: Each character gets independent state
- **Semantic memory**: `TfIdfEmbeddingProvider` for vector-based retrieval
- **Zod validation**: Runtime type validation for Profile and AppConfig
- **LLM safety checker**: Optional LLM-based safety layer
- **MBTI inference**: Personality type detection from conversation
- **C.AI import**: Character.AI export format support

## Configuration & Secrets

Configuration is loaded from a `.env` file in the data root. See
[`.env.example`](./.env.example) for the full list of supported variables and
copy it to `.env` to get started.

> **Security caveat:** `writeEnvFile()` persists the AI API key (and other
> secrets) to `.env` in **plaintext**. Any process or Electron extension with
> filesystem/`process.env` access can read it. For production, prefer OS
> keychain encryption via `electron.safeStorage` (used automatically by
> `protectSecret`/`revealSecret` in `src/config.ts`) rather than storing
> sensitive values in `.env`.

## Peer Dependencies

- `@ai-sdk/anthropic` ^3.0.0
- `@ai-sdk/openai` ^3.0.0
- `ai` ^6.0.0
- `dotenv` ^17.0.0
- `node-cron` ^3.0.0
- `zod` ^3.0.0

Full API docs: [API_REFERENCE.md](API_REFERENCE.md)

### Error boundaries

Provider and backup-model failures are logged and converted to a neutral
generation fallback. Memory and post-processing failures do not discard an
already generated reply; the stream and non-stream pipelines record the failed
stage and continue with the available result. Configuration and provider
construction errors from `loadConfig()` or `createAIProvider()` remain
explicit errors for the caller to handle.

## License

GPL-3.0 — see [LICENSE](./LICENSE).

---

<div align="center">

**Language / 语言 / 言語**

[**English**](README.md) | [**简体中文**](README.zh-CN.md) | [**繁體中文**](README.zh-Hant.md) | [**日本語**](README.ja.md)

</div>
