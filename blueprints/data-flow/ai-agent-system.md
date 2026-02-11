# AI Agent System Blueprint

## LLM-Agnostic Multi-Agent Architecture

---

## 1. Overview

Cosmos embeds AI at every interaction point through a system of 8 specialized agents. The system is LLM-agnostic — users bring their own API key from any supported provider.

---

## 2. AI Router (Provider Abstraction)

```
┌─────────────────────────────┐
│        AI Router             │
│  ┌───────────────────────┐  │
│  │ Unified Interface     │  │
│  │ chat() | complete()   │  │
│  │ runAgent()            │  │
│  └──────────┬────────────┘  │
│             │                │
│  ┌──────────▼────────────┐  │
│  │  Provider Adapter     │  │
│  │  ┌────┐ ┌────┐ ┌───┐ │  │
│  │  │OAI │ │Anth│ │Grq│ │  │
│  │  └────┘ └────┘ └───┘ │  │
│  │  ┌────┐ ┌────┐ ┌───┐ │  │
│  │  │Ollm│ │ORtr│ │HF │ │  │
│  │  └────┘ └────┘ └───┘ │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### Supported Providers

| Provider | Models | Cost | Offline |
|----------|--------|------|---------|
| **OpenRouter** | Any (100+ models) | Pay per token | No |
| **Anthropic** | Claude 3.5/4 family | Pay per token | No |
| **OpenAI** | GPT-4o, o1, o3 | Pay per token | No |
| **Groq** | Llama, Mixtral (fast) | Pay per token | No |
| **Ollama** | Any local model | Free | Yes |
| **HuggingFace** | Open models | Free tier | No |
| **Custom** | Any OpenAI-compatible | Varies | Varies |

### Router Implementation

```typescript
class AIRouter {
  private provider: LLMProvider;
  
  async chat(messages: Message[], options?: ChatOptions): AsyncIterable<string> {
    const formattedMessages = this.formatForProvider(messages);
    return this.provider.stream(formattedMessages, {
      model: options?.model || this.config.model,
      maxTokens: options?.maxTokens || 4096,
      temperature: options?.temperature || 0.7,
    });
  }
  
  async runAgent(type: AgentType, task: AgentTask): Promise<AgentResult> {
    const agent = AgentFactory.create(type);
    const systemPrompt = agent.getSystemPrompt();
    const messages = agent.buildMessages(task);
    
    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      ...messages,
    ]);
    
    return agent.parseResponse(response);
  }
}
```

---

## 3. Agent Definitions

### 3.1 Conductor Agent

**Role:** Orchestrates multi-agent tasks. Decomposes complex requests into sub-tasks and assigns them to specialized agents.

**Triggered by:** Complex user requests that span multiple domains.

**System Prompt Core:**
```
You are the Conductor agent for Cosmos. When given a complex task:
1. Analyze what needs to be done
2. Break it into sub-tasks
3. Assign each sub-task to the appropriate specialist agent
4. Coordinate results into a unified response
```

**Example:**
- User: "Build me a REST API with a database and deployment pipeline"
- Conductor → Coder (API code) + Pipeline (DB setup) + Doc Writer (API docs)

---

### 3.2 Coder Agent

**Role:** Writes, edits, and refactors code. Understands the full project context.

**Triggered by:** Code generation requests, refactoring, bug fixes.

**Capabilities:**
- Generate new files from descriptions
- Refactor selected code
- Fix bugs with explanations
- Add error handling, logging
- Convert between languages
- Write inline documentation

**Context provided:** Current file content, project file tree, selected text, language.

---

### 3.3 Designer Agent

**Role:** Generates UI designs and components from descriptions or sketches.

**Triggered by:** Design requests, pencil sketch conversion, "make this look better."

**Capabilities:**
- Generate React/HTML components from descriptions
- Convert wireframe sketches to structured components
- Suggest color schemes, typography, layouts
- Make designs responsive
- Generate design tokens

---

### 3.4 Pipeline Agent

**Role:** Builds and optimizes data workflow nodes.

**Triggered by:** "Build a pipeline to...", workflow canvas interactions.

**Capabilities:**
- Generate node configurations from descriptions
- Suggest optimal node ordering
- Write SQL transforms
- Configure data connectors
- Add error handling and retry logic

---

### 3.5 Reviewer Agent

**Role:** Reviews code for quality, security, and performance.

**Triggered by:** On commit (optional), manual review request.

**Review Categories:**
- Security vulnerabilities
- Performance issues
- Code style consistency
- Error handling gaps
- Test coverage
- Accessibility (for UI code)

**Output:** Inline comments with severity (info/warning/critical) and suggested fixes.

---

### 3.6 Tester Agent

**Role:** Generates unit tests and finds edge cases.

**Triggered by:** "Add tests", on save (optional).

**Capabilities:**
- Generate unit tests (Jest, Vitest, pytest)
- Identify edge cases
- Generate test data fixtures
- Write integration tests for API endpoints
- Generate pipeline validation tests

---

### 3.7 Doc Writer Agent

**Role:** Generates documentation.

**Triggered by:** "Document this", on file creation (optional).

**Capabilities:**
- README generation
- API documentation (OpenAPI spec)
- Inline JSDoc/TSDoc comments
- Pipeline documentation
- Architecture decision records

---

### 3.8 Researcher Agent

**Role:** Searches for information, finds libraries, best practices.

**Triggered by:** "Find a library for...", "How do I...", unknown error resolution.

**Capabilities:**
- Search npm/PyPI for packages
- Find code examples
- Lookup error messages and solutions
- Compare library options
- Find best practices for specific patterns

---

## 4. Agent Communication

### 4.1 Task Queue

```typescript
interface AgentTask {
  id: string;
  type: AgentType;
  priority: 'high' | 'normal' | 'low';
  context: {
    projectId: string;
    fileContext?: string;       // Current file content
    selectedText?: string;      // User's selection
    workflowContext?: FlowNode[]; // Current pipeline
    userMessage: string;        // What the user asked
  };
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: AgentResult;
  createdAt: Date;
}

interface AgentResult {
  type: 'code' | 'design' | 'text' | 'workflow' | 'review';
  content: string;
  changes?: FileChange[];      // Files to create/modify
  nodes?: FlowNode[];          // Workflow nodes to add
  comments?: ReviewComment[];  // Inline review comments
}
```

### 4.2 Multi-Agent Flow

```
User Request: "Build an ETL pipeline that reads from our Postgres,
               cleans the data, and writes to S3 as Parquet"

Conductor Agent:
  ├── Pipeline Agent → Generates workflow nodes:
  │   ├── PostgreSQL Source node (configured)
  │   ├── SQL Transform node (data cleaning query)
  │   ├── Data Quality node (null checks)
  │   └── S3 Parquet Sink node (configured)
  │
  ├── Coder Agent → Generates custom transform code
  │   └── clean_data.py (Python cleaning functions)
  │
  └── Doc Writer Agent → Generates pipeline README
      └── pipeline-docs.md
```

---

## 5. AI Access Points (UX Integration)

### 5.1 Code Canvas
- **Ghost completions:** Inline suggestions as you type
- **Select + Act:** Select code → floating menu → Explain/Refactor/Test/Fix
- **Pencil annotation:** Handwriting converted to text → routed to agent
- **Chat panel:** Full conversation with project context

### 5.2 Workflow Canvas
- **Natural language → nodes:** Describe pipeline → agent builds it
- **Node assist:** Tap node → "Help me configure this"
- **Error resolution:** Failed node → "Fix this" button

### 5.3 Design Canvas
- **Sketch → component:** Pencil drawing → AI generates UI code
- **Describe → design:** "Login form with social auth" → component appears
- **Iterate:** "Make the button bigger" / "Add dark mode"

### 5.4 Data Canvas
- **Natural language SQL:** "Show me top 10 customers by revenue"
- **Anomaly detection:** "Find outliers in this column"
- **Chart suggestion:** "What's the best way to visualize this?"

---

## 6. Prompt Engineering

### 6.1 Context Window Management

Each agent call includes structured context:

```
[System] Agent system prompt + role definition
[Context] Project file tree (truncated)
[Context] Current file content (if applicable)
[Context] Selected text (if applicable)  
[Context] Recent chat history (last 5 messages)
[User] The actual user request
```

### 6.2 Output Formatting

Agents return structured output for reliable parsing:

```
<action type="create_file" path="src/components/Login.tsx">
... file content ...
</action>

<action type="edit_file" path="src/App.tsx">
<search>old code</search>
<replace>new code</replace>
</action>

<action type="add_node" type="sql_transform">
{ "config": { "query": "SELECT * FROM users WHERE active = true" } }
</action>

<action type="comment">
This refactoring improves performance by memoizing the expensive computation.
</action>
```

---

## 7. Cost Management

- Token usage tracked per agent call
- Monthly usage dashboard in Settings
- Budget limits configurable per project
- Caching: identical prompts return cached results
- Smart context: only include relevant file content, not entire project
