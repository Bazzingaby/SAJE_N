import { useState } from "react";

const AGENTS = [
  { id: "conductor", name: "Conductor", icon: "🎯", role: "Orchestrator", desc: "Task decomposition, agent routing, context management", status: "planned" },
  { id: "architect", name: "Architect", icon: "🏗️", role: "System Design", desc: "Architecture, API design, tech selection, ADRs", status: "planned" },
  { id: "coder", name: "Coder", icon: "💻", role: "Implementation", desc: "Write code, fix bugs, refactor, implement features", status: "planned" },
  { id: "reviewer", name: "Reviewer", icon: "🔍", role: "Quality", desc: "Code review, security analysis, performance audit", status: "planned" },
  { id: "tester", name: "Tester", icon: "🧪", role: "Testing", desc: "Unit tests, integration tests, edge case detection", status: "planned" },
  { id: "designer", name: "Designer", icon: "🎨", role: "UI/UX", desc: "Wireframes, component specs, design system", status: "planned" },
  { id: "devops", name: "DevOps", icon: "🚀", role: "Infrastructure", desc: "CI/CD, deployment, environment management", status: "planned" },
  { id: "doc", name: "Doc Writer", icon: "📝", role: "Documentation", desc: "README, API docs, architecture docs", status: "planned" },
  { id: "research", name: "Researcher", icon: "🔬", role: "Research", desc: "Web search, library comparison, best practices", status: "planned" },
];

const LAYERS = [
  { id: 0, name: "iPad Liberation", color: "#dc2626", items: ["TrollStore/AltStore", "JIT via StikDebug", "Extended Entitlements", "Filesystem Access", "Background Execution"] },
  { id: 1, name: "Dev Environment", color: "#ea580c", items: ["a-Shell (native ARM64)", "iSH (Alpine Linux)", "UTM (Linux VMs)", "Blink Shell (SSH)", "Git (lg2/libgit2)"] },
  { id: 2, name: "AI Runtime", color: "#ca8a04", items: ["llama.cpp (Metal)", "OpenAI-compat API", "Model Manager", "RAG Pipeline", "Hybrid Cloud Fallback"] },
  { id: 3, name: "Agent Orchestration", color: "#16a34a", items: ["Conductor", "Multi-Agent Protocol", "Task Decomposition", "Context Management", "File I/O + Shell"] },
  { id: 4, name: "Cosmos UI", color: "#2563eb", items: ["SwiftUI App", "Code Editor", "Chat Interface", "Scrum Board", "Agent Dashboard"] },
];

const SPRINTS = [
  { id: 1, name: "Foundation", stories: [
    { id: "S1.1", title: "Liberation Setup", points: 2, status: "todo", epic: "E0" },
    { id: "S1.2", title: "llama.cpp iOS Build", points: 5, status: "todo", epic: "E1" },
    { id: "S1.3", title: "Terminal Bootstrap", points: 3, status: "todo", epic: "E2" },
    { id: "S1.4", title: "Basic Chat Shell", points: 3, status: "todo", epic: "E3" },
    { id: "S1.5", title: "Local API Server", points: 5, status: "todo", epic: "E1" },
  ]},
  { id: 2, name: "Intelligence", stories: [
    { id: "S2.1", title: "Model Download UI", points: 3, status: "todo", epic: "E8" },
    { id: "S2.2", title: "Multi-model Switching", points: 3, status: "todo", epic: "E1" },
    { id: "S2.3", title: "Chat History + Persistence", points: 3, status: "todo", epic: "E3" },
    { id: "S2.4", title: "Terminal Embed in App", points: 5, status: "todo", epic: "E2" },
    { id: "S2.5", title: "Benchmark Suite", points: 2, status: "todo", epic: "E1" },
  ]},
  { id: 3, name: "Code & Agents", stories: [
    { id: "S3.1", title: "Code Editor (TreeSitter)", points: 8, status: "todo", epic: "E4" },
    { id: "S3.2", title: "Agent Framework Core", points: 5, status: "todo", epic: "E5" },
    { id: "S3.3", title: "Conductor Agent", points: 5, status: "todo", epic: "E5" },
    { id: "S3.4", title: "Coder Agent", points: 3, status: "todo", epic: "E5" },
  ]},
];

const MODELS = [
  { name: "DeepSeek-Coder-1.3B", size: "1.4GB", speed: "60-80 tok/s", mode: "Fast", fit: "easy" },
  { name: "Llama-3.2-3B-Q4", size: "1.8GB", speed: "40-50 tok/s", mode: "Fast", fit: "easy" },
  { name: "Phi-4-mini-Q4", size: "2.3GB", speed: "30-40 tok/s", mode: "Quality", fit: "easy" },
  { name: "Qwen3-4B-Q4", size: "2.5GB", speed: "25-35 tok/s", mode: "Quality", fit: "easy" },
  { name: "Qwen2.5-Coder-7B-Q4", size: "4.5GB", speed: "15-20 tok/s", mode: "Max", fit: "tight" },
];

const TABS = ["Overview", "Architecture", "Agents", "Sprint Board", "Models", "Risks"];

export default function CosmosDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [sprintData, setSprintData] = useState(SPRINTS);

  const moveStory = (sprintIdx, storyIdx, newStatus) => {
    const updated = [...sprintData];
    updated[sprintIdx].stories[storyIdx].status = newStatus;
    setSprintData(updated);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌌</span>
              <div>
                <h1 className="text-xl font-bold text-white">COSMOS</h1>
                <p className="text-xs text-gray-400">Code & Open-Source Machine Operating System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-yellow-900 text-yellow-300 text-xs rounded-full font-medium">v0.1.0-alpha</span>
              <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-full font-medium">iPad Air M3</span>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-gray-800 text-white font-medium" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* Vision */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/50 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-2">Mission</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Transform iPad Air M3 into a sovereign developer workstation — local LLM inference, 
                agentic coding workflows, full terminal environment — no cloud dependency required.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { label: "RAM Budget", value: "~6.2GB", sub: "for inference" },
                  { label: "Target Speed", value: ">20 tok/s", sub: "sustained on 4B" },
                  { label: "Sprint 1", value: "18 pts", sub: "5 stories" },
                ].map(s => (
                  <div key={s.label} className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-400">{s.label}</div>
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware Specs */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">iPad Air M3 — Hardware Profile</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "CPU", value: "8-core (4P + 4E)", bar: 75 },
                  { label: "GPU", value: "10-core Metal 3", bar: 80 },
                  { label: "Neural Engine", value: "16-core", bar: 90 },
                  { label: "Unified RAM", value: "8GB", bar: 40 },
                  { label: "USB-C", value: "10Gbps", bar: 65 },
                  { label: "Storage", value: "Up to 1TB", bar: 85 },
                ].map(spec => (
                  <div key={spec.label} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{spec.label}</span>
                      <span className="text-white font-medium">{spec.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                        style={{ width: `${spec.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Budget */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Memory Budget (8GB)</h2>
              <div className="flex h-8 rounded-lg overflow-hidden">
                <div className="bg-red-700 flex items-center justify-center text-xs font-medium" style={{width: '19%'}}>iPadOS 1.5G</div>
                <div className="bg-orange-600 flex items-center justify-center text-xs font-medium" style={{width: '4%'}}>App</div>
                <div className="bg-green-600 flex items-center justify-center text-xs font-medium" style={{width: '56%'}}>Model (~4.5GB max)</div>
                <div className="bg-blue-600 flex items-center justify-center text-xs font-medium" style={{width: '10%'}}>RAG</div>
                <div className="bg-gray-600 flex items-center justify-center text-xs font-medium" style={{width: '11%'}}>Buffer</div>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-700"/> System</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-600"/> Cosmos App</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-600"/> LLM Model</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-600"/> RAG/Embeddings</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gray-600"/> Safety Buffer</span>
              </div>
            </div>
          </div>
        )}

        {/* ARCHITECTURE TAB */}
        {activeTab === "Architecture" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Five-Layer Architecture</h2>
            <div className="space-y-2">
              {[...LAYERS].reverse().map(layer => (
                <div
                  key={layer.id}
                  className="border border-gray-800 rounded-xl p-4 bg-gray-900 hover:bg-gray-800/80 transition-colors"
                  style={{ borderLeftWidth: 4, borderLeftColor: layer.color }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-gray-500 w-16">Layer {layer.id}</span>
                    <h3 className="font-bold text-white">{layer.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map(item => (
                      <span key={item} className="px-2 py-1 text-xs rounded-md bg-gray-800 text-gray-300 border border-gray-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Data Flow */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-6">
              <h3 className="font-bold text-white mb-3">Inference Pipeline</h3>
              <div className="flex items-center gap-2 flex-wrap text-sm">
                {["User Input", "→", "Conductor", "→", "Router", "→", "Local LLM / Cloud API", "→", "Agent Output", "→", "File System / Terminal", "→", "User"].map((step, i) => (
                  <span key={i} className={step === "→" ? "text-gray-600" : "px-2 py-1 bg-gray-800 rounded text-gray-300 border border-gray-700"}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === "Agents" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Agent Team</h2>
            <div className="grid grid-cols-3 gap-3">
              {AGENTS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedAgent?.id === agent.id 
                      ? "bg-blue-900/30 border-blue-600" 
                      : "bg-gray-900 border-gray-800 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{agent.icon}</span>
                    <span className="font-bold text-white text-sm">{agent.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">{agent.role}</div>
                  {selectedAgent?.id === agent.id && (
                    <p className="mt-2 text-xs text-gray-300 leading-relaxed">{agent.desc}</p>
                  )}
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                    agent.status === "active" ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-400"
                  }`}>
                    {agent.status}
                  </span>
                </button>
              ))}
            </div>
            {/* Agent Protocol */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold text-white text-sm mb-2">Communication Protocol</h3>
              <pre className="text-xs text-gray-400 font-mono overflow-x-auto">
{`{ "from": "conductor", "to": "coder_agent",
  "task_id": "COSMOS-42", "type": "code_generation",
  "context": { "project": "...", "files": [...], "rag_context": [...] },
  "priority": "high" }`}
              </pre>
            </div>
          </div>
        )}

        {/* SPRINT BOARD TAB */}
        {activeTab === "Sprint Board" && (
          <div className="space-y-6">
            {sprintData.map((sprint, si) => (
              <div key={sprint.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">Sprint {sprint.id}: {sprint.name}</h3>
                  <span className="text-xs text-gray-400">
                    {sprint.stories.reduce((a, s) => a + s.points, 0)} pts
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["todo", "in_progress", "done"].map(col => (
                    <div key={col} className="bg-gray-800/50 rounded-lg p-2">
                      <div className="text-xs font-medium text-gray-400 mb-2 uppercase">
                        {col === "todo" ? "📋 To Do" : col === "in_progress" ? "🔨 In Progress" : "✅ Done"}
                      </div>
                      {sprint.stories.filter(s => s.status === col).map((story, sti) => {
                        const origIdx = sprint.stories.findIndex(s => s.id === story.id);
                        return (
                          <div key={story.id} className="bg-gray-900 border border-gray-700 rounded-lg p-2 mb-2">
                            <div className="text-xs font-mono text-gray-500">{story.id}</div>
                            <div className="text-sm text-white font-medium">{story.title}</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-blue-400">{story.epic}</span>
                              <span className="text-xs text-gray-400">{story.points}pts</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {col !== "todo" && (
                                <button onClick={() => moveStory(si, origIdx, col === "done" ? "in_progress" : "todo")}
                                  className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 hover:bg-gray-600">←</button>
                              )}
                              {col !== "done" && (
                                <button onClick={() => moveStory(si, origIdx, col === "todo" ? "in_progress" : "done")}
                                  className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 hover:bg-gray-600">→</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODELS TAB */}
        {activeTab === "Models" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Recommended Models for 8GB RAM</h2>
            <div className="space-y-2">
              {MODELS.map(model => (
                <div key={model.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{model.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {model.size} · {model.speed} · {model.mode} mode
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      model.fit === "easy" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"
                    }`}>
                      {model.fit === "easy" ? "Fits comfortably" : "Tight fit"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Inference Strategy */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="font-bold text-white mb-3">Hybrid Inference Strategy</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-24 text-right text-gray-400">Simple task</span>
                  <span className="text-gray-600">→</span>
                  <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs">Local 1.3B (fast)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-right text-gray-400">Complex task</span>
                  <span className="text-gray-600">→</span>
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">Local 4B (quality)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-right text-gray-400">Very complex</span>
                  <span className="text-gray-600">→</span>
                  <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs">Cloud API (opt-in)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-right text-gray-400">Embeddings</span>
                  <span className="text-gray-600">→</span>
                  <span className="px-2 py-1 bg-orange-900/50 text-orange-300 rounded text-xs">Local MiniLM (~80MB)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RISKS TAB */}
        {activeTab === "Risks" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Risk Register</h2>
            {[
              { risk: "No jailbreak for M3", impact: "High", prob: "Confirmed", mitigation: "TrollStore + AltStore + extended entitlements path", color: "red" },
              { risk: "8GB RAM limit", impact: "High", prob: "Medium", mitigation: "Aggressive Q4 quantization, small models, streaming inference", color: "orange" },
              { risk: "Thermal throttling", impact: "Medium", prob: "High", mitigation: "Thermal monitoring, adaptive batch size, quality reduction", color: "orange" },
              { risk: "llama.cpp iOS performance", impact: "Medium", prob: "Medium", mitigation: "Benchmark Sprint 1, fallback to MLC-LLM or cloud hybrid", color: "yellow" },
              { risk: "Apple kills sideloading", impact: "High", prob: "Low", mitigation: "EU DMA protections, AltStore PAL marketplace", color: "yellow" },
              { risk: "UTM without JIT", impact: "Medium", prob: "Low", mitigation: "StikDebug for JIT, UTM SE as fallback", color: "green" },
            ].map((r, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{borderLeftWidth: 4, borderLeftColor: r.color === "red" ? "#dc2626" : r.color === "orange" ? "#ea580c" : r.color === "yellow" ? "#ca8a04" : "#16a34a"}}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white text-sm">{r.risk}</h3>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-300">Impact: {r.impact}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-300">Prob: {r.prob}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Mitigation: {r.mitigation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
