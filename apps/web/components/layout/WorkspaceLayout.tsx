"use client";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Sidebar } from "./Sidebar";
import { MainCanvas } from "./MainCanvas";
import { AIPanel } from "./AIPanel";
import { BottomPanel } from "./BottomPanel";
import type { CanvasMode } from "./MainCanvas";

interface WorkspaceLayoutProps {
  children?: React.ReactNode;
  canvasMode?: CanvasMode;
}

function ResizeHandle({
  direction = "horizontal",
}: {
  direction?: "horizontal" | "vertical";
}) {
  const isHorizontal = direction === "horizontal";

  return (
    <PanelResizeHandle
      className={
        isHorizontal
          ? "group relative flex w-1 items-center justify-center bg-transparent transition-colors hover:bg-accent-indigo/20 active:bg-accent-indigo/30"
          : "group relative flex h-1 items-center justify-center bg-transparent transition-colors hover:bg-accent-indigo/20 active:bg-accent-indigo/30"
      }
    >
      <div
        className={
          isHorizontal
            ? "h-8 w-0.5 rounded-full bg-border transition-colors group-hover:bg-accent-indigo group-active:bg-accent-indigo"
            : "h-0.5 w-8 rounded-full bg-border transition-colors group-hover:bg-accent-indigo group-active:bg-accent-indigo"
        }
        aria-hidden="true"
      />
    </PanelResizeHandle>
  );
}

export function WorkspaceLayout({
  children,
  canvasMode = "code",
}: WorkspaceLayoutProps) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-bg-primary">
      {/* Main panel area */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar panel */}
        <Panel
          id="sidebar"
          order={1}
          defaultSize={4}
          minSize={3}
          maxSize={15}
          collapsible
        >
          <Sidebar />
        </Panel>

        <ResizeHandle direction="horizontal" />

        {/* Center area: main canvas + bottom panel */}
        <Panel id="center" order={2} defaultSize={76} minSize={40}>
          <PanelGroup direction="vertical">
            {/* Main canvas */}
            <Panel
              id="main-canvas"
              order={1}
              defaultSize={75}
              minSize={30}
            >
              <MainCanvas canvasMode={canvasMode}>
                {children}
              </MainCanvas>
            </Panel>

            <ResizeHandle direction="vertical" />

            {/* Bottom panel */}
            <Panel
              id="bottom-panel"
              order={2}
              defaultSize={25}
              minSize={10}
              collapsible
            >
              <BottomPanel />
            </Panel>
          </PanelGroup>
        </Panel>

        <ResizeHandle direction="horizontal" />

        {/* AI panel */}
        <Panel
          id="ai-panel"
          order={3}
          defaultSize={20}
          minSize={10}
          maxSize={40}
          collapsible
        >
          <AIPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}
