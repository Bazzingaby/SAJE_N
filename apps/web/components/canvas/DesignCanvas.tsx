'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { cn } from '@/lib/utils';
import { Square, Circle, Type, Code, Pencil, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function DesignCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [exportedCode, setExportedCode] = useState<string>('');
  const [isPencilMode, setIsPencilMode] = useState(false);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const generateReactCode = () => {
    if (!fabricRef.current) return '';
    const objects = fabricRef.current.getObjects();

    const elements = objects
      .map((obj) => {
        const left = Math.round(obj.left);
        const top = Math.round(obj.top);
        const width = Math.round(obj.width * (obj.scaleX || 1));
        const height = Math.round(obj.height * (obj.scaleY || 1));
        const fill = obj.fill as string;

        if (obj.type === 'rect') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rx = (obj as any).rx || 0;
          return `<div className="absolute" style={{ left: '${left}px', top: '${top}px', width: '${width}px', height: '${height}px', backgroundColor: '${fill}', borderRadius: '${rx}px' }} />`;
        }
        if (obj.type === 'circle') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const radius = Math.round((obj as any).radius * (obj.scaleX || 1));
          return `<div className="absolute rounded-full" style={{ left: '${left}px', top: '${top}px', width: '${radius * 2}px', height: '${radius * 2}px', backgroundColor: '${fill}' }} />`;
        }
        if (obj.type === 'textbox' || obj.type === 'text') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return `<div className="absolute" style={{ left: '${left}px', top: '${top}px', width: '${width}px', color: '${fill}', fontSize: '${(obj as any).fontSize}px', textAlign: '${(obj as any).textAlign}' }}>${(obj as any).text}</div>`;
        }
        return `<!-- ${obj.type} not yet supported in codegen -->`;
      })
      .join('\n      ');

    return `export function ExportedComponent() {
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-[#0a0a0f]">
      ${elements || '<!-- Empty canvas -->'}
    </div>
  );
}`;
  };

  const handleExport = () => {
    const code = generateReactCode();
    setExportedCode(code);
  };

  const togglePencilMode = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const newMode = !isPencilMode;
    setIsPencilMode(newMode);
    canvas.isDrawingMode = newMode;

    if (newMode) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 4;
      canvas.freeDrawingBrush.color = '#a855f7';
    }
  };

  const addObject = (type: 'rect' | 'circle' | 'text') => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    // Disable drawing mode when adding objects
    setIsPencilMode(false);
    canvas.isDrawingMode = false;

    // Get center of viewport
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    const center = canvas.getCenterPoint();

    let obj: fabric.FabricObject;

    switch (type) {
      case 'rect':
        obj = new fabric.Rect({
          left: center.x - 50,
          top: center.y - 50,
          width: 100,
          height: 100,
          fill: '#3b82f6',
          rx: 8,
          ry: 8,
        });
        break;
      case 'circle':
        obj = new fabric.Circle({
          left: center.x - 50,
          top: center.y - 50,
          radius: 50,
          fill: '#a855f7',
        });
        break;
      case 'text':
        obj = new fabric.Textbox('Double tap to edit', {
          left: center.x - 100,
          top: center.y - 20,
          width: 200,
          fontSize: 20,
          fill: '#ffffff',
          textAlign: 'center',
        });
        break;
      default:
        return;
    }

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: '#0a0a0f',
    });

    fabricRef.current = canvas;

    // Set default object styles for touch
    fabric.FabricObject.prototype.set({
      cornerSize: 12,
      transparentCorners: false,
      cornerColor: '#a855f7',
      cornerStyle: 'circle',
      borderColor: '#a855f7',
      borderScaleFactor: 2,
    });

    // Zoom and Pan Handlers
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      const point = new fabric.Point(opt.e.offsetX, opt.e.offsetY);
      canvas.zoomToPoint(point, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    canvas.on('mouse:down', (opt) => {
      const evt = opt.e;
      if (evt.altKey === true) {
        isDragging.current = true;
        canvas.selection = false;
        if ('clientX' in evt) {
          lastPos.current = { x: evt.clientX, y: evt.clientY };
        } else if ('touches' in evt && evt.touches[0]) {
          lastPos.current = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
        }
      }
    });

    canvas.on('mouse:move', (opt) => {
      if (isDragging.current) {
        const e = opt.e;
        const vpt = canvas.viewportTransform;
        if (!vpt) return;

        let clientX = 0;
        let clientY = 0;

        if ('clientX' in e) {
          clientX = e.clientX;
          clientY = e.clientY;
        } else if ('touches' in e && e.touches[0]) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }

        vpt[4] += clientX - lastPos.current.x;
        vpt[5] += clientY - lastPos.current.y;
        canvas.requestRenderAll();
        lastPos.current = { x: clientX, y: clientY };
      }
    });

    canvas.on('mouse:up', () => {
      const vpt = canvas.viewportTransform;
      if (vpt) {
        canvas.setViewportTransform(vpt);
      }
      isDragging.current = false;
      canvas.selection = true;
    });

    // Keyboard Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
        const activeObjects = canvas.getActiveObjects();
        canvas.discardActiveObject();
        canvas.remove(...activeObjects);
        canvas.requestRenderAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        canvas.setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="design-canvas"
      className="relative h-full w-full overflow-hidden bg-bg-primary"
    >
      <canvas ref={canvasRef} />

      {/* Side Palette */}
      <div className="absolute top-20 left-4 z-20 flex flex-col gap-2 rounded-2xl border border-border bg-bg-secondary/80 p-2 shadow-xl backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-12 w-12 rounded-xl transition-all',
            !isPencilMode
              ? 'bg-accent-purple text-white hover:bg-accent-purple/90'
              : 'hover:bg-accent-purple/20 hover:text-accent-purple',
          )}
          onClick={() => {
            setIsPencilMode(false);
            if (fabricRef.current) fabricRef.current.isDrawingMode = false;
          }}
          title="Selection Mode"
        >
          <MousePointer2 className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-12 w-12 rounded-xl transition-all',
            isPencilMode
              ? 'bg-accent-purple text-white hover:bg-accent-purple/90'
              : 'hover:bg-accent-purple/20 hover:text-accent-purple',
          )}
          onClick={togglePencilMode}
          title="Pencil Mode"
        >
          <Pencil className="h-6 w-6" />
        </Button>
        <div className="h-px bg-border my-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple"
          onClick={() => addObject('rect')}
          title="Add Rectangle"
        >
          <Square className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple"
          onClick={() => addObject('circle')}
          title="Add Circle"
        >
          <Circle className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple"
          onClick={() => addObject('text')}
          title="Add Text"
        >
          <Type className="h-6 w-6" />
        </Button>
      </div>

      {/* Top Actions */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="min-h-[44px] gap-2 border-border bg-bg-secondary/80 backdrop-blur-md"
              onClick={handleExport}
            >
              <Code className="h-4 w-4" />
              <span>Export Code</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-bg-secondary text-text-primary border-border">
            <DialogHeader>
              <DialogTitle>Exported React Component</DialogTitle>
            </DialogHeader>
            <div className="relative mt-4 max-h-[60vh] overflow-auto rounded-lg border border-border bg-bg-primary p-4">
              <pre className="text-xs font-mono text-accent-purple leading-relaxed">
                {exportedCode}
              </pre>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-accent-purple text-white hover:bg-accent-purple/90"
                onClick={() => {
                  navigator.clipboard.writeText(exportedCode);
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Floating Indicator */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-3">
        <span
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl bg-accent-purple/20 text-accent-purple text-sm font-bold',
          )}
        >
          UI
        </span>
        <div className="flex flex-col">
          <h2 className="text-sm font-medium text-accent-purple">Design Canvas</h2>
          <p className="text-xs text-text-secondary">Alt + Drag to pan • Scroll to zoom</p>
        </div>
      </div>
    </div>
  );
}
