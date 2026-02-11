import { useState, useCallback } from "react";

const CANVAS_MODES = [
  { id: "code", icon: "📝", label: "Code", desc: "Monaco Editor with touch enhancements, pencil annotations, inline AI", color: "#3b82f6" },
  { id: "design", icon: "🎨", label: "Design", desc: "Figma-like visual canvas → generates real code. Pencil wireframing.", color: "#a855f7" },
  { id: "flow", icon: "🔗", label: "Workflow", desc: "ReactFlow node editor for data pipelines, automation, ML flows", color: "#22c55e" },
  { id: "data", icon: "📊", label: "Data", desc: "Table browser, chart builder, SQL console, data profiling", color: "#f59e0b" },
  { id: "board", icon: "📋", label: "Board", desc: "Kanban/Scrum board with AI agent status tracking", color: "#ec4899" },
];

const TECH_STACK = [
  { layer: "Framework", tech: "Next.js 15", license: "MIT", icon: "⚡" },
  { layer: "Code Editor", tech: "Monaco Editor", license: "MIT", icon: "📝" },
  { layer: "Workflow", tech: "ReactFlow", license: "MIT", icon: "🔗" },
  { layer: "Design", tech: "Fabric.js", license: "MIT", icon: "🎨" },
  { layer: "Collaboration", tech: "Yjs (CRDT)", license: "MIT", icon: "👥" },
  { layer: "Terminal", tech: "xterm.js", license: "MIT", icon: "💻" },
  { layer: "UI", tech: "shadcn/ui + Tailwind", license: "MIT", icon: "🎯" },
  { layer: "State", tech: "Zustand", license: "MIT", icon: "🧠" },
  { layer: "Database", tech: "PostgreSQL", license: "PostgreSQL", icon: "🗄️" },
  { layer: "AI Router", tech: "Custom (LLM-agnostic)", license: "Apache 2.0", icon: "🤖" },
  { layer: "Charts", tech: "Recharts + D3", license: "MIT", icon: "📊" },
  { layer: "Handwriting", tech: "Web API / Tesseract", license: "Apache 2.0", icon: "✏️" },
];

const FLOW_NODES = [
  { category: "Sources", nodes: ["REST API", "PostgreSQL", "CSV/JSON", "S3/GCS", "Webhook", "Google Sheets"], color: "#3b82f6" },
  { category: "Transforms", nodes: ["SQL Query", "Python Fn", "Filter", "Join", "Aggregate", "AI Classify"], color: "#22c55e" },
  { category: "Sinks", nodes: ["DB Write", "File Export", "API POST", "Email", "Slack", "Dashboard"], color: "#f59e0b" },
  { category: "Control", nodes: ["Branch (If/Else)", "Loop", "Schedule", "Trigger", "Retry", "Merge"], color: "#a855f7" },
];

const AGENTS = [
  { id: "conductor", name: "Conductor", icon: "🎯", desc: "Orchestrates multi-agent tasks, decomposes complex requests" },
  { id: "coder", name: "Coder", icon: "💻", desc: "Writes, edits, refactors code across any language" },
  { id: "designer", name: "Designer", icon: "🎨", desc: "Generates UI designs and components from descriptions" },
  { id: "pipeline", name: "Pipeline", icon: "🔗", desc: "Builds and optimizes data workflow nodes" },
  { id: "reviewer", name: "Reviewer", icon: "🔍", desc: "Reviews code quality, security, performance" },
  { id: "tester", name: "Tester", icon: "🧪", desc: "Generates unit tests and finds edge cases" },
  { id: "doc", name: "Doc Writer", icon: "📝", desc: "Generates README, API docs, inline documentation" },
  { id: "research", name: "Researcher", icon: "🔬", desc: "Searches web, finds libraries, best practices" },
];

const SPRINTS = [
  { id: 1, name: "Foundation", weeks: "1-2", pts: 21, stories: [
    { title: "Next.js + TypeScript + Tailwind setup", pts: 3, status: "todo" },
    { title: "Monaco Editor + touch enhancements", pts: 5, status: "todo" },
    { title: "File explorer tree view", pts: 3, status: "todo" },
    { title: "Touch toolbar (bottom bar)", pts: 3, status: "todo" },
    { title: "Layout (sidebar + main + right panel)", pts: 2, status: "todo" },
    { title: "Zustand workspace store", pts: 5, status: "todo" },
  ]},
  { id: 2, name: "Canvas & Collab", weeks: "3-4", pts: 24, stories: [
    { title: "ReactFlow workflow canvas", pts: 8, status: "todo" },
    { title: "Yjs real-time collaboration", pts: 5, status: "todo" },
    { title: "Terminal (xterm.js)", pts: 5, status: "todo" },
    { title: "Git panel", pts: 3, status: "todo" },
    { title: "Canvas mode switching", pts: 3, status: "todo" },
  ]},
  { id: 3, name: "AI Integration", weeks: "5-6", pts: 21, stories: [
    { title: "AI Router (LLM abstraction)", pts: 5, status: "todo" },
    { title: "AI Chat panel", pts: 5, status: "todo" },
    { title: "Inline AI in code editor", pts: 5, status: "todo" },
    { title: "Agent framework (conductor + coder)", pts: 3, status: "todo" },
    { title: "Settings (API keys, model selection)", pts: 3, status: "todo" },
  ]},
  { id: 4, name: "Data Pipelines", weeks: "7-8", pts: 21, stories: [
    { title: "Custom flow nodes (source/transform/sink)", pts: 5, status: "todo" },
    { title: "Node config panels (tap to configure)", pts: 5, status: "todo" },
    { title: "Pipeline execution engine", pts: 5, status: "todo" },
    { title: "Data canvas (tables + charts)", pts: 3, status: "todo" },
    { title: "SQL console", pts: 3, status: "todo" },
  ]},
  { id: 5, name: "Design & Polish", weeks: "9-10", pts: 22, stories: [
    { title: "Design canvas (Fabric.js)", pts: 8, status: "todo" },
    { title: "Pencil + handwriting recognition", pts: 5, status: "todo" },
    { title: "Board canvas (Kanban)", pts: 3, status: "todo" },
    { title: "Docker self-hosting", pts: 3, status: "todo" },
    { title: "Documentation site", pts: 3, status: "todo" },
  ]},
  { id: 6, name: "Launch", weeks: "11-12", pts: 16, stories: [
    { title: "GitHub repo + CI/CD", pts: 5, status: "todo" },
    { title: "Landing page + docs", pts: 3, status: "todo" },
    { title: "Demo workspace", pts: 3, status: "todo" },
    { title: "Discord server", pts: 2, status: "todo" },
    { title: "Performance + testing", pts: 3, status: "todo" },
  ]},
];

const TABS = ["Vision", "Interface", "Canvases", "Pipeline Nodes", "AI Agents", "Tech Stack", "Sprints", "Positioning"];

export default function CosmosV2Dashboard() {
  const [tab, setTab] = useState("Vision");
  const [expandedCanvas, setExpandedCanvas] = useState(null);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [sprintView, setSprintView] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 via-gray-900 to-indigo-950">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl">🌌</div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">COSMOS v2</h1>
                <p className="text-xs text-gray-400">Touch-First Development Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-indigo-900/60 text-indigo-300 text-xs rounded-full">Web App</span>
              <span className="px-2 py-1 bg-green-900/60 text-green-300 text-xs rounded-full">Open Source</span>
              <span className="px-2 py-1 bg-purple-900/60 text-purple-300 text-xs rounded-full">Apache 2.0</span>
            </div>
          </div>
          <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap ${tab === t ? "bg-indigo-600/40 text-white font-medium border border-indigo-500/50" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* VISION */}
        {tab === "Vision" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/20 border border-indigo-700/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-3">What is Cosmos?</h2>
              <p className="text-gray-300 leading-relaxed">
                A web-based platform that unifies <strong className="text-blue-400">code editing</strong>, <strong className="text-purple-400">visual design</strong>, <strong className="text-green-400">data pipelines</strong>, and <strong className="text-pink-400">AI agents</strong> in a single touch-optimized environment. 
                Think VS Code + Figma + Databricks + Palantir — open source, collaborative, built for the touch-screen generation.
              </p>
              <p className="text-gray-400 text-sm mt-3">No product like this exists today. Every tool does one slice. Cosmos unifies them all.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "✏️", title: "Pencil-Native", desc: "Draw annotations, wireframes, and comments with Apple Pencil. Handwriting converts to text and AI instructions." },
                { icon: "👆", title: "Touch-First", desc: "56px tap targets, gesture navigation, swipe between tabs, drag-and-drop everything. Built for fingers." },
                { icon: "🤖", title: "AI-Everywhere", desc: "Select any code, design, or data → AI explains, refactors, generates. Agents work autonomously on tasks." },
                { icon: "🔗", title: "End-to-End", desc: "From data ingestion to transformation to visualization to deployment. One platform, full business workflow." },
                { icon: "👥", title: "Collaborative", desc: "Real-time multi-user editing via CRDTs. See cursors, edits, and agent activity live." },
                { icon: "🌐", title: "Open Source", desc: "Apache 2.0. Self-hostable via Docker. No vendor lock-in. Community-driven." },
              ].map(f => (
                <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors">
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="font-bold text-white mt-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="font-bold text-white mb-3">How Cosmos Compares</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs border-b border-gray-800">
                      <th className="text-left py-2 pr-4">Existing Tool</th>
                      <th className="text-left py-2 pr-4">What It Does</th>
                      <th className="text-left py-2">What Cosmos Adds</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {[
                      ["VS Code Web", "Code editing", "Touch UI, pencil, AI inline, workflow canvas"],
                      ["Figma", "Visual design", "Generates real code, connects to data pipelines"],
                      ["Databricks", "Data pipelines", "Visual node editor, no Spark needed, open-source"],
                      ["Palantir Foundry", "End-to-end data OS", "Open-source, self-hostable, AI-native"],
                      ["n8n / Airflow", "Workflow automation", "Embedded in IDE, touch-native, visual"],
                    ].map(([tool, does_, adds]) => (
                      <tr key={tool} className="border-b border-gray-800/50">
                        <td className="py-2 pr-4 font-medium text-white">{tool}</td>
                        <td className="py-2 pr-4 text-gray-400">{does_}</td>
                        <td className="py-2 text-green-400">{adds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INTERFACE */}
        {tab === "Interface" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Touch-First Interface Layout</h2>
            
            {/* Wireframe */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 text-xs text-gray-400 border-b border-gray-700">
                <span className="w-3 h-3 rounded-full bg-red-500/60"/>
                <span className="w-3 h-3 rounded-full bg-yellow-500/60"/>
                <span className="w-3 h-3 rounded-full bg-green-500/60"/>
                <span className="ml-2">cosmos.dev — Workspace: my-project</span>
              </div>
              <div className="flex" style={{height: 400}}>
                {/* Sidebar */}
                <div className="w-14 bg-gray-900 border-r border-gray-800 flex flex-col items-center gap-3 py-3">
                  {["📁","🔍","🔗","🤖","📋","⚙️"].map((icon, i) => (
                    <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg cursor-pointer transition-colors ${i === 0 ? "bg-indigo-600/30 border border-indigo-500/50" : "hover:bg-gray-800"}`}>
                      {icon}
                    </div>
                  ))}
                </div>
                {/* File Tree */}
                <div className="w-48 bg-gray-900/80 border-r border-gray-800 p-3 text-xs">
                  <div className="text-gray-400 font-medium mb-2">EXPLORER</div>
                  {["📂 src/", "  📄 App.tsx", "  📄 index.ts", "  📂 components/", "    📄 Header.tsx", "📂 pipelines/", "  📄 etl-flow.json", "📄 package.json"].map((f, i) => (
                    <div key={i} className={`py-1 px-1 rounded cursor-pointer ${i === 1 ? "bg-indigo-600/20 text-indigo-300" : "text-gray-400 hover:bg-gray-800"}`}>
                      {f}
                    </div>
                  ))}
                </div>
                {/* Main Canvas */}
                <div className="flex-1 flex flex-col">
                  {/* Tabs */}
                  <div className="flex bg-gray-900 border-b border-gray-800">
                    {["📝 Code","🎨 Design","🔗 Flow","📊 Data","📋 Board"].map((m, i) => (
                      <div key={i} className={`px-3 py-2 text-xs cursor-pointer border-b-2 transition-colors ${i === 0 ? "border-indigo-500 text-white bg-gray-800/50" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
                        {m}
                      </div>
                    ))}
                  </div>
                  {/* Editor Area */}
                  <div className="flex-1 bg-gray-950 p-4 font-mono text-xs text-gray-400 leading-relaxed overflow-hidden">
                    <div><span className="text-gray-600">1</span>  <span className="text-purple-400">import</span> <span className="text-blue-300">React</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
                    <div><span className="text-gray-600">2</span>  </div>
                    <div><span className="text-gray-600">3</span>  <span className="text-purple-400">export default function</span> <span className="text-yellow-300">App</span>() {"{"}</div>
                    <div><span className="text-gray-600">4</span>    <span className="text-purple-400">return</span> (</div>
                    <div className="bg-blue-900/20 border-l-2 border-blue-500 pl-2 rounded-r">
                      <span className="text-gray-600">5</span>      {"<"}<span className="text-blue-300">div</span>{">"}
                      <span className="ml-4 text-blue-400 text-xs italic">✏️ "add login form here"</span>
                    </div>
                    <div><span className="text-gray-600">6</span>        <span className="text-gray-500">{"// 🤖 AI generating..."}</span></div>
                    <div><span className="text-gray-600">7</span>      {"</"}<span className="text-blue-300">div</span>{">"}</div>
                    <div><span className="text-gray-600">8</span>    );</div>
                    <div><span className="text-gray-600">9</span>  {"}"}</div>
                  </div>
                  {/* Bottom Panel */}
                  <div className="h-20 bg-gray-900 border-t border-gray-800 p-2 text-xs font-mono text-gray-500">
                    <div className="flex gap-3 mb-1">
                      <span className="text-gray-400 font-medium">TERMINAL</span>
                      <span className="text-gray-600">OUTPUT</span>
                      <span className="text-gray-600">PROBLEMS</span>
                    </div>
                    <div>$ npm run dev</div>
                    <div className="text-green-400">▶ Ready on http://localhost:3000</div>
                  </div>
                </div>
                {/* AI Panel */}
                <div className="w-56 bg-gray-900 border-l border-gray-800 p-3 text-xs">
                  <div className="text-gray-400 font-medium mb-2">🤖 AI ASSISTANT</div>
                  <div className="bg-gray-800 rounded-lg p-2 mb-2 text-gray-300">
                    <div className="text-indigo-400 font-medium mb-1">Coder Agent</div>
                    Generating login form component based on your pencil annotation...
                  </div>
                  <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-2 text-indigo-300">
                    <div className="font-medium mb-1">Agent Status</div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Coder: working</div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"/>Reviewer: idle</div>
                  </div>
                </div>
              </div>
              {/* Touch Toolbar */}
              <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-center gap-2">
                {[
                  { icon: "▶", label: "Run", color: "bg-green-600" },
                  { icon: "🔍", label: "Select", color: "bg-gray-700" },
                  { icon: "✏️", label: "Annotate", color: "bg-gray-700" },
                  { icon: "🤖", label: "AI", color: "bg-indigo-600" },
                  { icon: "📐", label: "Design", color: "bg-gray-700" },
                  { icon: "🔗", label: "Flow", color: "bg-gray-700" },
                  { icon: "💾", label: "Save", color: "bg-gray-700" },
                  { icon: "↩", label: "Undo", color: "bg-gray-700" },
                ].map(b => (
                  <div key={b.label} className={`${b.color} w-12 h-12 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}>
                    <span className="text-base">{b.icon}</span>
                    <span className="text-gray-300 text-xs mt-0.5" style={{fontSize: 9}}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Touch Targets", desc: "All buttons ≥44px (Apple HIG). Toolbar buttons 56px. Easy to tap with fingers." },
                { title: "Gesture Navigation", desc: "Pinch zoom, 2-finger pan, long-press context menu, swipe between tabs." },
                { title: "Pencil Workflow", desc: "Draw annotation → handwriting recognition → text → routed to AI agent." },
                { title: "Split View", desc: "Code + Preview, Code + Flow, Design + Code — side by side on tablet." },
              ].map(p => (
                <div key={p.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <h4 className="font-bold text-white text-sm">{p.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANVASES */}
        {tab === "Canvases" && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">Five Canvas Modes</h2>
            {CANVAS_MODES.map(m => (
              <button key={m.id} onClick={() => setExpandedCanvas(expandedCanvas === m.id ? null : m.id)}
                className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all"
                style={{borderLeftWidth: 4, borderLeftColor: m.color}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <h3 className="font-bold text-white">{m.label} Canvas</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-lg">{expandedCanvas === m.id ? "−" : "+"}</span>
                </div>
                {expandedCanvas === m.id && (
                  <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-300 leading-relaxed">
                    {m.id === "code" && "Full Monaco Editor (same engine as VS Code) with syntax highlighting for all languages, IntelliSense, Git integration, terminal, minimap, and diff view. Touch enhancements include enlarged gutter, swipe-to-indent, touch command palette, and AI select-and-act. Each code selection can be annotated with pencil or sent to an AI agent."}
                    {m.id === "design" && "Fabric.js-powered infinite canvas for visual UI design. Drag components from a palette, set layout with visual flexbox/grid tools, adjust typography and colors. Designs export to real React/HTML/SwiftUI code with two-way binding. Pencil sketches are converted by AI into structured UI components."}
                    {m.id === "flow" && "ReactFlow node-based editor for building data pipelines, automation workflows, and ML flows. Drag source/transform/sink nodes from a palette, connect them visually, configure each node by tapping. Pipelines execute server-side with logging, retry logic, and scheduling. Each node is also editable as code."}
                    {m.id === "data" && "Interactive data explorer with spreadsheet-like table view, chart builder (drag columns to axes), SQL console for ad-hoc queries, and automatic data profiling (statistics, null detection, type inference). Connected to pipeline outputs and database sources."}
                    {m.id === "board" && "Kanban-style project board with sprint management. Cards link to code files, workflow nodes, and designs. AI agents report their task status here. Supports story points, velocity tracking, and sprint ceremonies."}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* PIPELINE NODES */}
        {tab === "Pipeline Nodes" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Data Pipeline Node Types</h2>
            <p className="text-sm text-gray-400">Inspired by Databricks, Informatica, and Airflow — open source, visual, touch-native.</p>
            {FLOW_NODES.map(cat => (
              <div key={cat.category}>
                <h3 className="font-bold text-white text-sm mb-2" style={{color: cat.color}}>{cat.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.nodes.map(n => (
                    <div key={n} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 hover:border-gray-600 cursor-pointer transition-colors"
                      style={{borderLeftWidth: 3, borderLeftColor: cat.color}}>
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold text-white text-sm mb-2">Pipeline Orchestration</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {["⏰ Cron scheduling", "🔄 Retry with backoff", "📊 Execution logs", "🔀 Dependencies", "📈 Data lineage", "🔔 Alert on failure"].map(f => (
                  <div key={f} className="bg-gray-800 rounded-lg px-2 py-2 text-gray-300">{f}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI AGENTS */}
        {tab === "AI Agents" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">AI Agent System</h2>
            <p className="text-sm text-gray-400">Cosmos is LLM-agnostic. Connect any provider: OpenRouter, Claude, OpenAI, Ollama, self-hosted.</p>
            <div className="grid grid-cols-2 gap-3">
              {AGENTS.map(a => (
                <button key={a.id} onClick={() => setExpandedAgent(expandedAgent === a.id ? null : a.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${expandedAgent === a.id ? "bg-indigo-900/20 border-indigo-600" : "bg-gray-900 border-gray-800 hover:border-gray-600"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{a.icon}</span>
                    <span className="font-bold text-white text-sm">{a.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{a.desc}</p>
                </button>
              ))}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold text-white text-sm mb-2">AI Access Points</h3>
              <div className="space-y-1 text-xs">
                {[
                  ["Code selected →", "Explain, refactor, add tests, fix, optimize"],
                  ["Design canvas →", "\"Make responsive\", \"Add dark mode\""],
                  ["Workflow canvas →", "\"Add error handling to this pipeline\""],
                  ["Data canvas →", "\"Find anomalies in this column\""],
                  ["Board canvas →", "\"Break this epic into stories\""],
                  ["Pencil annotation →", "Handwriting → text → AI action"],
                ].map(([ctx, action]) => (
                  <div key={ctx} className="flex gap-2">
                    <span className="text-indigo-400 font-medium w-36 shrink-0">{ctx}</span>
                    <span className="text-gray-400">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TECH STACK */}
        {tab === "Tech Stack" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">100% Open Source Tech Stack</h2>
            <div className="grid grid-cols-2 gap-2">
              {TECH_STACK.map(t => (
                <div key={t.layer} className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{t.tech}</div>
                    <div className="text-xs text-gray-500">{t.layer}</div>
                  </div>
                  <span className="px-2 py-0.5 text-xs rounded bg-green-900/50 text-green-300">{t.license}</span>
                </div>
              ))}
            </div>
            <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 text-sm text-green-300">
              All components are MIT or Apache 2.0 licensed. No proprietary code from any commercial platform is used. Cosmos is built entirely from open-source libraries.
            </div>
          </div>
        )}

        {/* SPRINTS */}
        {tab === "Sprints" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">12-Week Sprint Plan</h2>
              <div className="text-sm text-gray-400">Total: {SPRINTS.reduce((a, s) => a + s.pts, 0)} points</div>
            </div>
            <div className="flex gap-1 mb-2">
              {SPRINTS.map((s, i) => (
                <button key={s.id} onClick={() => setSprintView(i)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${sprintView === i ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                  S{s.id}
                </button>
              ))}
            </div>
            {SPRINTS[sprintView] && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">Sprint {SPRINTS[sprintView].id}: {SPRINTS[sprintView].name}</h3>
                    <p className="text-xs text-gray-400">Weeks {SPRINTS[sprintView].weeks} · {SPRINTS[sprintView].pts} points</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {SPRINTS[sprintView].stories.map((s, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded border border-gray-600 flex items-center justify-center text-xs text-gray-500">
                          {s.status === "done" ? "✓" : ""}
                        </span>
                        <span className="text-sm text-gray-200">{s.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">{s.pts} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* POSITIONING */}
        {tab === "Positioning" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Market Positioning</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="relative" style={{height: 300}}>
                {/* Axes */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700"/>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700"/>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-gray-400">Touch-Native ↑</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-400">↓ Desktop-First</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">Full Workflow ←</div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">→ Code Only</div>
                {/* Dots */}
                {[
                  { name: "COSMOS", x: 30, y: 15, color: "bg-gradient-to-r from-blue-500 to-purple-500", size: "w-20 h-8" },
                  { name: "VS Code Web", x: 75, y: 70, color: "bg-blue-600", size: "w-16 h-6" },
                  { name: "Figma", x: 55, y: 35, color: "bg-purple-600", size: "w-12 h-6" },
                  { name: "Databricks", x: 20, y: 75, color: "bg-red-600", size: "w-16 h-6" },
                  { name: "Palantir", x: 10, y: 80, color: "bg-gray-600", size: "w-12 h-6" },
                  { name: "Replit", x: 65, y: 55, color: "bg-orange-600", size: "w-10 h-6" },
                  { name: "n8n", x: 35, y: 60, color: "bg-green-600", size: "w-8 h-6" },
                ].map(d => (
                  <div key={d.name} className={`absolute ${d.color} ${d.size} rounded-full flex items-center justify-center text-white text-xs font-medium shadow-lg`}
                    style={{left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%,-50%)"}}>
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-xl p-4 text-sm text-indigo-300">
              Cosmos is the only platform that is both <strong>full-workflow</strong> (data pipelines + code + design + deployment) AND <strong>touch-native</strong>. This is the unoccupied quadrant.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
