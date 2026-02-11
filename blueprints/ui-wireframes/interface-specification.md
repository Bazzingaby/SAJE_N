# Interface Specification

## Touch-First UI Design for Cosmos

---

## 1. Layout Architecture

### 1.1 Main Layout (4 Panels)

```
┌──────┬───────────────────────────────────────────┬──────────┐
│      │                                           │          │
│  A   │                    B                      │    C     │
│      │                                           │          │
│ Side │              Main Canvas                  │   AI     │
│ bar  │                                           │  Panel   │
│      │   (Code / Design / Flow / Data / Board)   │          │
│ 56px │                                           │  280px   │
│      │                                           │          │
│      ├───────────────────────────────────────────┤          │
│      │                    D                      │          │
│      │             Bottom Panel                  │          │
│      │     (Terminal / Logs / Output)             │          │
├──────┴───────────────────────────────────────────┴──────────┤
│                          E                                   │
│                   Touch Toolbar (64px)                        │
└──────────────────────────────────────────────────────────────┘
```

| Panel | Width/Height | Contents | Collapsible |
|-------|-------------|----------|-------------|
| A - Sidebar | 56px | Icon navigation + file tree (expandable to 240px) | Yes |
| B - Main Canvas | Flexible | Active canvas mode | No |
| C - AI Panel | 280px | Chat, agent status, suggestions | Yes |
| D - Bottom Panel | 180px | Terminal, logs, output | Yes |
| E - Touch Toolbar | 64px | Mode switch, actions, AI button | No |

### 1.2 Responsive Breakpoints

| Breakpoint | Screen | Layout |
|-----------|--------|--------|
| ≥1200px | Desktop / iPad landscape | Full 4-panel layout |
| 768-1199px | iPad portrait | Sidebar collapses to icons, AI panel overlay |
| <768px | Phone (limited support) | Single panel + bottom nav |

---

## 2. Touch Target Specifications

### 2.1 Size Requirements

| Element | Minimum Size | Recommended | Padding |
|---------|-------------|-------------|---------|
| Toolbar buttons | 44×44px | 56×56px | 8px |
| File tree items | 44px height | 48px height | 12px horizontal |
| Tab buttons | 44px height | 40px height | 16px horizontal |
| Node ports (ReactFlow) | 20×20px | 24×24px | - |
| Context menu items | 44px height | 48px height | 16px horizontal |
| Floating action button | 56×56px | 64×64px | - |
| Code editor line numbers | 36px width | 44px width | - |

### 2.2 Spacing

| Between | Minimum Gap |
|---------|------------|
| Adjacent buttons | 8px |
| Toolbar items | 4px |
| List items | 2px |
| Panel sections | 16px |

---

## 3. Gesture Map

### 3.1 Universal Gestures

| Gesture | Action | Context |
|---------|--------|---------|
| Single tap | Select / Click | Everywhere |
| Double tap | Open / Zoom to fit | File tree, canvas |
| Long press (500ms) | Context menu | Code, nodes, files |
| Pinch in/out | Zoom | All canvases |
| Two-finger drag | Pan | All canvases |
| Swipe left/right | Switch tabs | Tab bar |
| Three-finger swipe left | Undo | Everywhere |
| Three-finger swipe right | Redo | Everywhere |
| Edge swipe left | Open sidebar | When sidebar hidden |
| Edge swipe right | Open AI panel | When AI panel hidden |

### 3.2 Code Canvas Gestures

| Gesture | Action |
|---------|--------|
| Tap line number | Select entire line |
| Double tap word | Select word |
| Triple tap | Select line |
| Long press + drag | Text selection with magnifier |
| Swipe right on line | Indent |
| Swipe left on line | Outdent |
| Two-finger tap | Toggle comment |

### 3.3 Workflow Canvas Gestures

| Gesture | Action |
|---------|--------|
| Drag from palette | Add node to canvas |
| Drag from port | Create connection |
| Tap node | Select (show config) |
| Double tap node | Open node code |
| Long press node | Context menu (delete, duplicate) |
| Pinch on node | Resize node |
| Two-finger rotate | Rotate selection |

### 3.4 Design Canvas Gestures

| Gesture | Action |
|---------|--------|
| Drag from palette | Add component |
| Drag on canvas | Move element |
| Pinch on element | Resize |
| Two-finger rotate | Rotate |
| Pencil draw | Freeform annotation |
| Pencil tap | Precision placement |

---

## 4. Touch Toolbar Specification

### 4.1 Bottom Toolbar Layout

```
┌──────────────────────────────────────────────────────────────┐
│  ▶      🔍     ✏️     🤖     📝  🎨  🔗  📊  📋    💾  ↩   │
│ Run   Select  Note    AI    Code Desgn Flow Data Brd  Save Undo│
│                              ←── Mode Switch ──→              │
└──────────────────────────────────────────────────────────────┘
```

| Button | Size | Action | Color |
|--------|------|--------|-------|
| ▶ Run | 56×56 | Execute current context (run code / run pipeline) | Green |
| 🔍 Select | 56×56 | Enter selection mode for AI actions | Gray |
| ✏️ Annotate | 56×56 | Toggle pencil annotation mode | Gray |
| 🤖 AI | 56×56 | Toggle AI panel / send selection to AI | Indigo |
| 📝 Code | 48×48 | Switch to Code Canvas | Blue (active) |
| 🎨 Design | 48×48 | Switch to Design Canvas | Purple (active) |
| 🔗 Flow | 48×48 | Switch to Workflow Canvas | Green (active) |
| 📊 Data | 48×48 | Switch to Data Canvas | Amber (active) |
| 📋 Board | 48×48 | Switch to Board Canvas | Pink (active) |
| 💾 Save | 48×48 | Save all changes | Gray |
| ↩ Undo | 48×48 | Undo last action | Gray |

### 4.2 Context-Sensitive Actions

The toolbar adapts based on active canvas:

| Canvas | Extra buttons shown |
|--------|-------------------|
| Code | Format, Comment, Find/Replace |
| Design | Align, Group, Layer order |
| Flow | Add Node, Run Pipeline, Validate |
| Data | Execute Query, Export, Refresh |
| Board | New Card, Filter, Sprint |

---

## 5. Color System

### 5.1 Dark Theme (Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | #0a0a0f | Main background |
| `--bg-secondary` | #111118 | Panel backgrounds |
| `--bg-tertiary` | #1a1a24 | Cards, inputs |
| `--border` | #2a2a35 | Borders |
| `--text-primary` | #f0f0f5 | Primary text |
| `--text-secondary` | #9090a0 | Secondary text |
| `--accent-blue` | #3b82f6 | Code Canvas, links |
| `--accent-purple` | #a855f7 | Design Canvas |
| `--accent-green` | #22c55e | Flow Canvas, success |
| `--accent-amber` | #f59e0b | Data Canvas, warnings |
| `--accent-pink` | #ec4899 | Board Canvas |
| `--accent-indigo` | #6366f1 | AI elements |
| `--accent-red` | #ef4444 | Errors, destructive |

### 5.2 Canvas Mode Indicators

Each canvas mode has a distinct accent color that appears in:
- Active tab underline
- Toolbar active button highlight
- Status bar mode indicator
- Panel headers when in that mode

---

## 6. Pencil + AI Workflow (Detail)

### 6.1 Annotation Flow

```
User activates ✏️ Annotate mode
  │
  ├── Draws on Code Canvas
  │   └── Semi-transparent overlay layer
  │       └── Handwriting recognized → text
  │           └── If text is instruction → route to AI
  │           └── If text is comment → store as annotation
  │
  ├── Draws on Design Canvas
  │   └── Freeform drawing layer
  │       └── AI analyzes sketch → suggests component
  │       └── User confirms → structured component placed
  │
  └── Draws on Workflow Canvas
      └── AI interprets as node connection or label
```

### 6.2 Annotation Rendering

- Annotations appear as colored overlays above the content
- Each annotation shows: text, author, timestamp
- Annotations linked to specific code lines or canvas positions
- Can be resolved/dismissed with a tap
- Unresolved annotations show indicator dot in file tree

---

## 7. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Screen reader | ARIA labels on all interactive elements |
| Keyboard nav | Full keyboard navigation for desktop users |
| Focus indicators | Visible focus rings on all elements |
| Color contrast | WCAG AA minimum (4.5:1 for text) |
| Reduced motion | Respect `prefers-reduced-motion` |
| Font scaling | UI adapts to system font size preferences |
| Touch alternatives | Every gesture has a button alternative |
