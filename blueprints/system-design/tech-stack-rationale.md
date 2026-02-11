# Tech Stack Rationale

Why each technology was chosen for Cosmos.

---

| Technology | Chosen Over | Key Reasons |
|-----------|-------------|-------------|
| **Next.js 15** | Remix, Vite+React | SSR for mobile perf, API routes, RSC, Vercel deploy, largest ecosystem |
| **Monaco Editor** | CodeMirror 6, Ace | Same as VS Code, best IntelliSense, multi-model, MIT, `@monaco-editor/react` |
| **ReactFlow** | JointJS, GoJS, Rete.js | Purpose-built for node UIs, MIT, 20k+ stars, touch-friendly, shadcn integration |
| **Fabric.js** | Konva, Paper.js, PixiJS | Object model (select/move/resize), JSON serialization, touch events, MIT |
| **Yjs (CRDT)** | ShareDB (OT), Automerge | Offline-first, Monaco/ReactFlow bindings, awareness protocol, MIT |
| **xterm.js** | Terminal.js | Same as VS Code terminal, WebGL renderer, MIT |
| **shadcn/ui** | MUI, Chakra, Ant Design | Copy-paste (no runtime dep), Radix primitives, Tailwind, dark mode |
| **Zustand** | Redux, Jotai, MobX | Minimal boilerplate, works outside React, ~1KB, middleware support |
| **PostgreSQL** | MySQL, MongoDB, SQLite | JSONB columns, full-text search, Supabase managed option, industry standard |
| **Custom AI Router** | LangChain, Vercel AI SDK | ~200 lines, no heavy deps, full control, LLM-agnostic, no lock-in |
| **Recharts + D3** | Chart.js, Plotly | Recharts: React-native declarative; D3: low-level power. Both MIT |
| **Tesseract.js** | Cloud OCR APIs | Client-side (no server round-trip), Apache 2.0, fallback for native API |

## License Compliance

All dependencies are MIT, ISC, Apache 2.0, or PostgreSQL licensed. **No GPL/AGPL/SSPL contamination.** Full commercial use permitted.

## Trade-offs Accepted

1. **Monaco bundle size (~2MB)** — accepted because editor quality is the product's core
2. **Fabric.js not as fast as PixiJS** — acceptable for UI design use case (<1000 objects)
3. **Custom AI Router vs LangChain** — less features but zero supply chain risk and full control
