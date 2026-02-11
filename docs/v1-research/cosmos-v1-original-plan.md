# 🌌 COSMOS — Code & Open-Source Machine Operating System

## Reimagining the iPad as a First-Class Developer Workstation

**Version:** 0.1.0-alpha  
**Target Device:** iPad Air M3 (8GB unified memory, 10-core GPU, 16-core Neural Engine)  
**License:** Apache 2.0  
**Status:** Requirements Complete → Architecture Phase

---

## 1. Executive Vision

Cosmos transforms the iPad Air M3 from a consumption device into a sovereign development workstation — capable of running local LLMs, executing code, managing full-stack projects, and orchestrating AI agents — all without depending on cloud services.

**The thesis:** Apple's M3 chip in the iPad Air is the same silicon class powering MacBooks. The only barrier is software. Cosmos removes that barrier.

**Inflection Point:** We are at the convergence of three forces:
1. **Hardware parity** — iPad M3 matches MacBook Air M3 in compute
2. **Open-source AI** — Quantized models (Qwen3 4B, Llama 3.2 3B, Phi-4 mini) run in 8GB RAM
3. **Sideloading unlocked** — EU DMA + TrollStore + AltStore PAL mean native apps without Apple gatekeeping

---

## 2. Hardware Reality Check — iPad Air M3

| Spec | Value | Implication |
|------|-------|-------------|
| CPU | 8-core (4P + 4E) | Compiles code fast, runs interpreters |
| GPU | 10-core Metal 3 | MLX/llama.cpp inference acceleration |
| Neural Engine | 16-core | CoreML model acceleration |
| RAM | 8GB unified | **Hard constraint** — max ~6.5GB usable for models |
| Storage | 128GB–1TB | Model storage, VM images |
| USB-C | USB 3.2 Gen 2 (10Gbps) | External drives, peripherals |
| Display | 11" Liquid Retina, 2360x1640 | Split-view coding viable |
| Connectivity | Wi-Fi 6E, Bluetooth 5.3 | SSH to cloud, BLE for IoT |

### Memory Budget for Local LLMs (8GB total)

| Allocation | RAM |
|-----------|-----|
| iPadOS + system daemons | ~1.5GB |
| Cosmos app (SwiftUI shell) | ~300MB |
| Available for inference | **~6.2GB** |
| Q4 quantized 3B model | ~2GB |
| Q4 quantized 7B model | ~4.5GB |
| Q4 quantized 8B model | ~5.5GB (tight) |

**Verdict:** Comfortably runs 3B-4B coding models. Can squeeze a 7B Q4 model. 8B is possible but will swap.

---

## 3. Architecture — Five Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 4: COSMOS UI — SwiftUI native iPad app       │
│  (Project OS, Scrum, Agent Dashboard, Chat)         │
├─────────────────────────────────────────────────────┤
│  Layer 3: AGENT ORCHESTRATION                       │
│  (Task planning, code gen, review, test, deploy)    │
├─────────────────────────────────────────────────────┤
│  Layer 2: AI RUNTIME                                │
│  (llama.cpp + MLX-Swift, model management,          │
│   OpenAI-compat API server, RAG pipeline)           │
├─────────────────────────────────────────────────────┤
│  Layer 1: DEV ENVIRONMENT                           │
│  (Terminal, Git, compilers, editors, SSH,            │
│   package management, file system access)           │
├─────────────────────────────────────────────────────┤
│  Layer 0: iPAD LIBERATION                           │
│  (TrollStore/AltStore, entitlements, JIT,           │
│   filesystem access, background execution)          │
└─────────────────────────────────────────────────────┘
```

---

## 4. Layer 0 — iPad Liberation

### 4.1 Current State (Feb 2026)

**Critical finding:** There is NO full jailbreak for iPad Air M3 (M-series chips). The checkm8 bootrom exploit only covers A8-A11 chips. For M3, we operate within the sideloading + entitlements paradigm.

### 4.2 Liberation Strategy

| Method | What it enables | Risk | Status |
|--------|----------------|------|--------|
| **TrollStore 2** | Permanent app signing, extended entitlements | Low | ✅ Works on iPadOS 17.0 (check M3 compat) |
| **AltStore PAL** (EU) | Sideloading marketplace | None | ✅ Available in EU |
| **AltStore** (non-EU) | 7-day re-signing, 3 app limit | Low | ✅ Works everywhere |
| **Enterprise signing** | Year-long certs, no App Store | Medium | ✅ With $299/yr dev account |
| **StikDebug JIT** | Enable JIT for UTM, emulators | Low | ✅ App Store app |
| **Full jailbreak** | Root access, SSH, Cydia | High | ❌ Not available for M3 |

### 4.3 Key Entitlements to Acquire via TrollStore

- `com.apple.private.security.no-sandbox` — filesystem access
- `dynamic-codesigning` — JIT compilation (critical for llama.cpp Metal)
- `com.apple.private.memorystatus` — prevent background kill
- `com.apple.private.network.server` — run local HTTP servers

### 4.4 Action Items — Layer 0

1. Determine exact iPadOS version on the M3 iPad Air
2. Verify TrollStore 2 compatibility for that version
3. If TrollStore unavailable: use AltStore + StikDebug for JIT
4. Build custom IPA with extended entitlements for Cosmos shell
5. Document the liberation pathway as a reproducible guide

---

## 5. Layer 1 — Development Environment

### 5.1 Terminal & Shell Stack

| Component | Solution | Notes |
|-----------|----------|-------|
| **Primary Terminal** | a-Shell (native ARM64) | Python, C, C++, JS, Git, Unix tools, natively compiled |
| **Linux Environment** | iSH Shell (Alpine Linux) | x86 emulation, full apk package manager |
| **VM Environment** | UTM SE / UTM (with JIT) | Full ARM64 Linux VMs, Debian/Ubuntu |
| **SSH Client** | Blink Shell | Mosh support, tmux, SSH keys |
| **Code Editor** | Runestone / built-in Cosmos editor | Syntax highlighting, LSP support |

### 5.2 Development Toolchains (via a-Shell + iSH)

**Available natively in a-Shell:**
- Python 3.x with pip
- C/C++ compilers
- JavaScript (QuickJS)
- Lua, Perl
- Git (lg2)
- TeX/LaTeX (texlive 2025)
- ffmpeg, ImageMagick
- Unix: grep, awk, sed, curl, ssh, scp

**Available via iSH (Alpine Linux):**
- Node.js, npm
- Ruby, Go (via apk)
- Rust (limited, x86 emulation is slow)
- Docker (NO — requires kernel features)
- Full apt/apk package ecosystem

**Available via UTM (Linux VM):**
- Full Ubuntu/Debian ARM64
- Docker & containers
- Any Linux software
- GPU passthrough: NOT available (QEMU limitation)

### 5.3 Recommended Dev Stack for Cosmos

```
Primary coding:     a-Shell (fast, native ARM64)
Package management: iSH (Alpine apk for broader ecosystem)  
Heavy workloads:    UTM VM with Debian ARM64 (full Linux)
Remote fallback:    Blink Shell → SSH to cloud/home server
Code editing:       Cosmos built-in editor (SwiftUI + TreeSitter)
```

### 5.4 Git Workflow on iPad

```
a-Shell:  lg2 clone/push/pull (native, fast)
iSH:     full git with all features
Cosmos:   integrated Git UI (SwiftUI) calling lg2 underneath
GitHub:   REST API integration for PRs, issues, actions
```

---

## 6. Layer 2 — AI Runtime

### 6.1 Inference Engine Selection

Based on research, the optimal strategy for 8GB iPad Air M3:

| Engine | Performance | iOS Support | Recommendation |
|--------|------------|-------------|----------------|
| **llama.cpp** | ~150 tok/s (short context) | ✅ Compiles for iOS, Metal backend | **Primary engine** |
| **MLX** | ~230 tok/s (sustained) | ⚠️ macOS-only (no iOS build) | Future (when Apple ports to iOS) |
| **MLX-Swift** | Native Swift bindings | ⚠️ Experimental iOS support | **Secondary — monitor closely** |
| **MLC-LLM** | ~190 tok/s, lower TTFT | ✅ iOS support via TVM | **Backup engine** |

**Decision: llama.cpp as primary, MLC-LLM as backup.**

### 6.2 Model Recommendations for 8GB RAM

| Model | Size (Q4) | Use Case | Expected tok/s |
|-------|-----------|----------|----------------|
| **Qwen3-4B-Q4** | ~2.5GB | General coding, reasoning | ~25-35 |
| **Phi-4-mini-Q4** | ~2.3GB | Coding, math, reasoning | ~30-40 |
| **Llama-3.2-3B-Q4** | ~1.8GB | Fast general purpose | ~40-50 |
| **DeepSeek-Coder-1.3B-Q8** | ~1.4GB | Code completion, fast | ~60-80 |
| **Qwen2.5-Coder-7B-Q4** | ~4.5GB | Best coding quality (tight fit) | ~15-20 |
| **StarCoder2-3B-Q4** | ~1.8GB | Code-specific | ~40-50 |

**Default loadout:**
- **Fast mode:** DeepSeek-Coder-1.3B (autocomplete, inline suggestions)
- **Quality mode:** Qwen3-4B or Phi-4-mini (complex reasoning, architecture)
- **Max quality:** Qwen2.5-Coder-7B-Q4 (when RAM allows, single-task focus)

### 6.3 Local API Server

Cosmos runs an OpenAI-compatible API server locally on the iPad:

```
http://localhost:8080/v1/chat/completions
http://localhost:8080/v1/completions  
http://localhost:8080/v1/models
http://localhost:8080/v1/embeddings
```

This means ANY tool expecting OpenAI API (Continue.dev, Copilot alternatives, custom agents) can connect to the local model.

### 6.4 Hybrid Inference Strategy

```
┌──────────────────────┐
│   User Request       │
└──────┬───────────────┘
       │
  ┌────▼────┐
  │ Router  │──── Simple/fast → Local 1.3B model
  │         │──── Complex → Local 4B model  
  │         │──── Very complex → Cloud API (opt-in)
  │         │──── Embedding → Local embedding model
  └─────────┘
```

Cloud APIs (optional, user-controlled):
- Anthropic Claude API
- OpenRouter (access to any model)
- Groq (fast inference)
- Together.ai
- Self-hosted (user's own server)

### 6.5 RAG Pipeline (Local Knowledge)

```
Documents → Chunking → Local embedding model → SQLite-vec → Retrieval → LLM
```

- **Embedding model:** all-MiniLM-L6-v2 (ONNX, ~80MB)
- **Vector store:** SQLite with sqlite-vec extension (native, no server)
- **Chunking:** TreeSitter-aware code chunking + markdown/text chunking
- **Index:** Per-project knowledge bases

---

## 7. Layer 3 — Agent Orchestration

### 7.1 Agent Architecture

Cosmos uses a multi-agent system where specialized agents collaborate on development tasks:

```
┌─────────────────────────────────────────┐
│           COSMOS CONDUCTOR              │
│  (Task decomposition, agent routing,    │
│   context management, memory)           │
├────────┬────────┬────────┬──────────────┤
│Architect│ Coder │Reviewer│  DevOps      │
│ Agent   │ Agent │ Agent  │  Agent       │
├────────┼────────┼────────┼──────────────┤
│Designer │ Test  │  Doc   │  Research    │
│ Agent   │ Agent │ Agent  │  Agent       │
└────────┴────────┴────────┴──────────────┘
```

### 7.2 Agent Definitions

**Conductor (Orchestrator)**
- Receives user intent
- Decomposes into subtasks
- Routes to specialized agents
- Manages shared context/memory
- Resolves conflicts between agents

**Architect Agent**
- System design, file structure
- API design, database schema
- Technology selection
- Architecture decision records (ADRs)

**Coder Agent**
- Writes code based on specs
- Implements features
- Fixes bugs
- Refactors existing code
- Uses local model for generation

**Reviewer Agent**  
- Code review with specific criteria
- Security analysis
- Performance suggestions
- Style/convention enforcement

**Test Agent**
- Generates unit tests
- Integration test scaffolding
- Identifies edge cases
- Runs tests and reports results

**Designer Agent**
- UI/UX wireframes (SVG/HTML)
- Component specifications
- Accessibility audit
- Design system management

**DevOps Agent**
- CI/CD pipeline configuration
- Docker/deployment configs
- Environment management
- Monitoring setup

**Doc Agent**
- README generation
- API documentation
- Architecture docs
- Inline code documentation

**Research Agent**
- Web search for solutions
- Library/framework comparison
- Best practice lookups
- Vulnerability scanning

### 7.3 Agent Communication Protocol

```json
{
  "from": "conductor",
  "to": "coder_agent",
  "task_id": "COSMOS-42",
  "type": "code_generation",
  "context": {
    "project": "cosmos-api-server",
    "files": ["src/server.swift", "src/routes.swift"],
    "requirements": "Add /v1/embeddings endpoint",
    "constraints": ["Must use async/await", "Max 200 lines"],
    "rag_context": ["<retrieved relevant code snippets>"]
  },
  "priority": "high",
  "deadline": "2026-02-12T10:00:00Z"
}
```

### 7.4 Agent Execution Environment

Each agent runs as a structured prompt against the local LLM (or cloud API):

```
System: You are the {agent_name} for Project Cosmos.
Your role: {agent_description}
Project context: {rag_retrieved_context}
Current codebase state: {file_tree + relevant files}
Task: {specific_task}
Output format: {structured_output_spec}
```

Agents can:
- Read/write files (via a-Shell/iSH)
- Run commands (compile, test, lint)
- Search the web (via API)
- Query the RAG pipeline
- Communicate with other agents via the Conductor

---

## 8. Layer 4 — Cosmos UI (SwiftUI iPad App)

### 8.1 App Structure

```
┌─────────────────────────────────────────────────────────┐
│  Cosmos — iPad App                                       │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  Sidebar     │  Main Content Area                       │
│              │                                          │
│  📁 Projects │  ┌─────────────────────────────────┐     │
│  🤖 Agents   │  │  Code Editor (TreeSitter)       │     │
│  💬 Chat     │  │  OR                             │     │
│  📋 Board    │  │  Agent Chat Interface           │     │
│  🔧 Terminal │  │  OR                             │     │
│  📊 Dash     │  │  Scrum Board                    │     │
│  ⚙️ Settings │  │  OR                             │     │
│              │  │  Terminal View                   │     │
│              │  │  OR                             │     │
│              │  │  Model Manager                   │     │
│              │  └─────────────────────────────────┘     │
│              │                                          │
│              │  ┌─────────────────────────────────┐     │
│              │  │  Bottom Panel (collapsible)      │     │
│              │  │  Terminal / Logs / Agent Status   │     │
│              │  └─────────────────────────────────┘     │
└──────────────┴──────────────────────────────────────────┘
```

### 8.2 Key Views

1. **Project Explorer** — file tree, Git status, search
2. **Code Editor** — syntax highlighting, LSP, AI autocomplete
3. **Agent Chat** — natural language → agent orchestration
4. **Scrum Board** — Kanban columns, sprint management
5. **Terminal** — embedded a-Shell / iSH terminal
6. **Model Manager** — download, swap, benchmark local models
7. **Dashboard** — agent activity, resource usage, project metrics
8. **Settings** — API keys, model config, theme, keybindings

### 8.3 Tech Stack for the App

| Component | Technology |
|-----------|-----------|
| UI Framework | SwiftUI + Swift 6 |
| Code Editor | TreeSitter (syntax), custom SwiftUI editor |
| Terminal | a-Shell framework embedded / PTY |
| LLM Runtime | llama.cpp compiled as Swift Package |
| Vector DB | SQLite + sqlite-vec |
| Local Storage | SwiftData / Core Data |
| Networking | URLSession (API calls) |
| Git | libgit2 via Swift bindings |
| IPC | Local HTTP server + WebSocket |

---

## 9. Project Management — Scrum Structure

### 9.1 Roles (AI-Augmented Solo Dev)

| Role | Who/What | Responsibility |
|------|----------|----------------|
| **Product Owner** | You (Human) | Vision, priorities, acceptance |
| **Scrum Master** | Conductor Agent | Sprint planning, blocker detection |
| **Dev Team** | Human + AI Agents | Implementation |
| **Researcher** | Research Agent | Technical spikes, feasibility |
| **Designer** | Designer Agent | UI/UX specs, wireframes |
| **QA** | Test + Reviewer Agents | Quality assurance |

### 9.2 Sprint Structure

- **Sprint length:** 1 week
- **Ceremonies:** (can be AI-facilitated)
  - Monday: Sprint Planning (Conductor proposes, human approves)
  - Daily: Stand-up summary from agents (auto-generated)
  - Friday: Sprint Review + Retro (Conductor summarizes)

### 9.3 Backlog — MVP Epics

| Epic | Priority | Sprint Target |
|------|----------|---------------|
| **E0: iPad Liberation** | P0 | Sprint 1 |
| **E1: Local LLM Runtime** | P0 | Sprint 1-2 |
| **E2: Terminal Integration** | P0 | Sprint 1-2 |
| **E3: Basic Chat UI** | P1 | Sprint 2-3 |
| **E4: Code Editor** | P1 | Sprint 3-4 |
| **E5: Agent Framework** | P1 | Sprint 3-5 |
| **E6: RAG Pipeline** | P2 | Sprint 4-5 |
| **E7: Scrum Board** | P2 | Sprint 5-6 |
| **E8: Model Manager** | P2 | Sprint 5-6 |
| **E9: Open Source Launch** | P2 | Sprint 7 |

---

## 10. Sprint 1 Detailed Plan

### Week 1: Foundation

**Goal:** Get llama.cpp running on iPad, basic terminal, first chat with local model.

#### Stories

**S1.1: Liberation Setup** (2 pts)
- [ ] Document iPadOS version on target iPad Air M3
- [ ] Install TrollStore 2 or AltStore
- [ ] Enable JIT via StikDebug
- [ ] Verify extended entitlements work

**S1.2: llama.cpp iOS Build** (5 pts)
- [ ] Fork llama.cpp
- [ ] Create Xcode project with Metal backend enabled
- [ ] Compile for iPad ARM64
- [ ] Test basic inference with Llama-3.2-3B-Q4
- [ ] Benchmark: measure tok/s, memory usage, thermal

**S1.3: Terminal Bootstrap** (3 pts)  
- [ ] Install a-Shell from App Store
- [ ] Install iSH Shell
- [ ] Configure Python, Git, Node.js
- [ ] Test file system interop between apps

**S1.4: Basic Chat Shell** (3 pts)
- [ ] SwiftUI app scaffold
- [ ] Embed llama.cpp as Swift Package
- [ ] Basic chat interface (input → model → response)
- [ ] Model loading from local storage

**S1.5: Local API Server** (5 pts)
- [ ] HTTP server in Swift (Vapor or raw NIO)
- [ ] OpenAI-compatible `/v1/chat/completions`
- [ ] `/v1/models` endpoint
- [ ] Test with curl from a-Shell

---

## 11. Open Source Strategy

### 11.1 Repository Structure

```
cosmos/
├── README.md
├── LICENSE                    # Apache 2.0
├── CONTRIBUTING.md
├── docs/
│   ├── architecture.md
│   ├── liberation-guide.md    # iPad setup guide
│   ├── model-guide.md         # Which models, how to download
│   ├── agent-spec.md          # Agent protocol specification
│   └── api-reference.md       # Local API docs
├── cosmos-app/                # SwiftUI iPad app
│   ├── Package.swift
│   ├── Sources/
│   │   ├── App/               # App entry, navigation
│   │   ├── Chat/              # Chat UI
│   │   ├── Editor/            # Code editor
│   │   ├── Terminal/          # Terminal integration
│   │   ├── Agents/            # Agent framework
│   │   ├── LLM/               # llama.cpp wrapper
│   │   ├── RAG/               # Vector search, embeddings
│   │   ├── Board/             # Scrum board
│   │   └── Models/            # Data models, SwiftData
│   └── Tests/
├── cosmos-cli/                # CLI tools for terminal use
│   ├── cosmos-chat             # Chat from terminal
│   ├── cosmos-agent            # Run agents from CLI
│   └── cosmos-serve            # Start API server
├── models/                    # Model configs (not weights)
│   ├── recommended.json
│   └── profiles/              # Per-model configs
├── agents/                    # Agent prompt templates
│   ├── conductor.md
│   ├── coder.md
│   ├── reviewer.md
│   └── ...
└── scripts/
    ├── setup-ipad.sh          # Liberation automation
    ├── download-model.sh      # Model downloader
    └── benchmark.sh           # Performance benchmarking
```

### 11.2 Contribution Model

- **Phase 1 (Sprints 1-7):** Solo development, public repo, accept issues
- **Phase 2 (Post-MVP):** Open contributions, CONTRIBUTING.md, issue templates
- **Phase 3 (Community):** Discord server, RFC process for major features

### 11.3 Legal Considerations

| Concern | Approach |
|---------|----------|
| App License | Apache 2.0 (permissive) |
| Model Weights | Not included — user downloads from HuggingFace |
| llama.cpp | MIT License — compatible |
| Model Licenses | Document per-model (Llama: Meta license, Qwen: Apache, Phi: MIT) |
| Jailbreak Tools | Not distributed — linked as external resources |
| Apple TOS | Sideloading is legal; jailbreaking is legal in most jurisdictions |

---

## 12. Future Vision (Post-MVP)

### 12.1 Near-term (3-6 months)
- MLX-Swift integration when Apple ports to iOS
- Multi-model routing (fast model + quality model)
- Plugin system for custom agents
- GitHub/GitLab deep integration
- Voice coding via Whisper.cpp (local speech-to-code)

### 12.2 Medium-term (6-12 months)
- iPad-to-iPad collaboration (peer-to-peer)
- Hardware tinkering: USB-C → Arduino/RPi communication
- CoreML model training on-device (fine-tuning small models)
- Bluetooth LE → IoT device programming
- Metal compute shaders for custom ML pipelines

### 12.3 Long-term (1-2 years)
- Full IDE experience rivaling VS Code
- Native Asahi Linux dual-boot (when M3 support lands)
- Distributed inference across multiple iPads
- iPad as edge AI deployment target
- Education platform: "Learn to code with AI, on iPad"

---

## 13. Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| No jailbreak for M3 | Limits filesystem/JIT access | High | TrollStore + AltStore + entitlements |
| 8GB RAM too small | Can't run useful models | Medium | Aggressive quantization, model selection, streaming |
| Apple kills sideloading | Can't install Cosmos | Low | EU DMA protections, AltStore PAL |
| llama.cpp iOS perf | Slower than expected | Medium | Benchmark early, fallback to cloud hybrid |
| App Store rejection | Can't distribute | N/A | Sideload-only distribution, open source |
| Thermal throttling | Sustained inference causes slowdown | High | Batch inference, thermal monitoring, adaptive quality |

---

## 14. Success Metrics

| Metric | Target |
|--------|--------|
| Local LLM inference | >20 tok/s sustained on 4B model |
| Time to first response | <2 seconds |
| Agent task completion | >70% of coding tasks succeed |
| RAM stability | No OOM crashes during inference |
| Battery life during inference | >2 hours continuous |
| Cold start (app launch → chat ready) | <10 seconds |
| Community | 100 GitHub stars in first month |

---

## Appendix A: Research Links

- [llama.cpp](https://github.com/ggml-org/llama.cpp) — Primary inference engine
- [MLX](https://github.com/ml-explore/mlx) — Apple's ML framework
- [mlx-lm](https://github.com/ml-explore/mlx-lm) — LLM wrapper for MLX
- [iSH](https://github.com/ish-app/ish) — Linux shell for iOS
- [a-Shell](https://apps.apple.com/us/app/a-shell/id1473805438) — Native Unix terminal
- [UTM](https://github.com/utmapp/UTM) — Virtual machines for iOS
- [TrollStore](https://github.com/opa334/TrollStore) — Permanent signing
- [iPad Linux](https://ipadlinux.org/) — Linux on iPad resource hub
- [sqlite-vec](https://github.com/asg017/sqlite-vec) — Vector search for SQLite
- [TreeSitter](https://tree-sitter.github.io/) — Parsing for code editors

---

*Cosmos: Because every developer deserves a universe in their hands.*
