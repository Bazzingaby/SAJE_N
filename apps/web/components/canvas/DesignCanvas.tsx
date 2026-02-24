'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { cn } from '@/lib/utils';
import { Square, Circle, Type, Code, Pencil, MousePointer2, CreditCard, SquareTerminal, ArrowUpToLine, ArrowDownToLine, View, Undo, Trash2, Wand2 } from 'lucide-react';
import { extractCanvasStrokes, processHandwriting } from '@/lib/utils/handwriting';
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

    const renderObject = (obj: any): string => {
      const left = Math.round(obj.left || 0);
      const top = Math.round(obj.top || 0);
      const width = Math.round(obj.width * (obj.scaleX || 1));
      const height = Math.round(obj.height * (obj.scaleY || 1));
      const fill = obj.fill as string;

      if (obj.name === 'cosmos-button') {
        return `<button className="absolute items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" style={{ left: '${left}px', top: '${top}px', width: '${width}px', height: '${height}px' }}>Button</button>`;
      }
      if (obj.name === 'cosmos-card') {
        return `<div className="absolute rounded-xl border border-slate-700 bg-slate-900 shadow-xl" style={{ left: '${left}px', top: '${top}px', width: '${width}px', height: '${height}px' }} />`;
      }
      if (obj.name === 'cosmos-input') {
        return `<input className="absolute rounded-md border border-slate-700 bg-black px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Placeholder..." style={{ left: '${left}px', top: '${top}px', width: '${width}px', height: '${height}px' }} />`;
      }

      if (obj.type === 'group') {
        const groupLeft = left;
        const groupTop = top;
        // Basic grouping logic for code generation
        return `<div className="absolute" style={{ left: '${groupLeft}px', top: '${groupTop}px', width: '${width}px', height: '${height}px' }}>
          {/* Group Content exported as a generic container */}
        </div>`;
      }
      if (obj.type === 'rect') {
        const rx = obj.rx || 0;
        return `<div className="absolute" style={{ left: '${left}px', top: '${top}px', width: '${width}px', height: '${height}px', backgroundColor: '${fill}', borderRadius: '${rx}px' }} />`;
      }
      if (obj.type === 'circle') {
        const radius = Math.round(obj.radius * (obj.scaleX || 1));
        return `<div className="absolute rounded-full" style={{ left: '${left}px', top: '${top}px', width: '${radius * 2}px', height: '${radius * 2}px', backgroundColor: '${fill}' }} />`;
      }
      if (obj.type === 'textbox' || obj.type === 'text') {
        return `<div className="absolute" style={{ left: '${left}px', top: '${top}px', width: '${width}px', color: '${fill}', fontSize: '${obj.fontSize}px', textAlign: '${obj.textAlign}' }}>${obj.text}</div>`;
      }
      return `<!-- ${obj.type} not yet supported in codegen -->`;
    };

    const elements = objects.map(renderObject).join('\n      ');

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

  const groupSelection = async () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    if (!canvas.getActiveObject()) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject?.type === 'activeSelection') {
      const selection = activeObject as fabric.ActiveSelection;
      const objects = selection.removeAll();
      canvas.discardActiveObject();
      const group = new fabric.Group(objects);
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
    }
  };

  const ungroupSelection = async () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    if (!canvas.getActiveObject()) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject?.type === 'group') {
      const group = activeObject as fabric.Group;
      const objects = group.removeAll();
      canvas.remove(group);
      canvas.add(...objects);
      const selection = new fabric.ActiveSelection(objects);
      canvas.setActiveObject(selection);
      canvas.requestRenderAll();
    }
  };

  const bringToFront = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (canvas && obj) {
      canvas.bringObjectToFront(obj);
      canvas.requestRenderAll();
    }
  };

  const sendToBack = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (canvas && obj) {
      canvas.sendObjectToBack(obj);
      canvas.requestRenderAll();
    }
  };

  const addObject = (type: 'rect' | 'circle' | 'text' | 'button' | 'card' | 'input') => {
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
      case 'button':
        {
          const bg = new fabric.Rect({
            width: 120, height: 44, fill: '#3b82f6', rx: 8, ry: 8, originX: 'center', originY: 'center'
          });
          const textEl = new fabric.Textbox('Button', {
            fontSize: 16, fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 100
          });
          obj = new fabric.Group([bg, textEl], { left: center.x - 60, top: center.y - 22 });
          obj.set('name', 'cosmos-button');
        }
        break;
      case 'card':
        obj = new fabric.Rect({
          left: center.x - 125, top: center.y - 100, width: 250, height: 200, fill: '#0f172a', rx: 12, ry: 12,
          stroke: '#334155', strokeWidth: 1
        });
        obj.set('name', 'cosmos-card');
        break;
      case 'input':
        {
          const bg = new fabric.Rect({
            width: 200, height: 44, fill: '#000000', rx: 6, ry: 6, stroke: '#334155', strokeWidth: 1, originX: 'center', originY: 'center'
          });
          const textEl = new fabric.Textbox('Placeholder...', {
            fontSize: 14, fill: '#94a3b8', originX: 'center', originY: 'center', width: 180, textAlign: 'left'
          });
          obj = new fabric.Group([bg, textEl], { left: center.x - 100, top: center.y - 22 });
          obj.set('name', 'cosmos-input');
        }
        break;
      default:
        return;
    }

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  const undoLastAction = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const objToRemove = objects[objects.length - 1];
      if (objToRemove) {
        canvas.remove(objToRemove);
        canvas.requestRenderAll();
      }
    }
  };

  const clearCanvas = () => {
    if (!fabricRef.current) return;
    fabricRef.current.clear();
    fabricRef.current.backgroundColor = '#0a0a0f';
    fabricRef.current.requestRenderAll();
  };

  const analyzeCanvasStrokes = async () => {
    if (!fabricRef.current) return;
    const strokes = extractCanvasStrokes(fabricRef.current);
    const result = await processHandwriting(strokes);
    if (result) {
      alert(result);
    } else {
      alert('No handwriting strokes detected.');
    }
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
        <div className="h-px bg-border my-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple"
          onClick={() => addObject('button')}
          title="Add Button Component"
        >
          <SquareTerminal className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple"
          onClick={() => addObject('card')}
          title="Add Card Component"
        >
          <CreditCard className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple"
          onClick={() => addObject('input')}
          title="Add Input Component"
        >
          <View className="h-6 w-6" />
        </Button>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-20 right-4 z-20 flex flex-col gap-2 rounded-2xl border border-border bg-bg-secondary/80 p-2 shadow-xl backdrop-blur-md">
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple" onClick={groupSelection} title="Group Selection">
          <div className="relative flex items-center justify-center font-bold">G</div>
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple" onClick={ungroupSelection} title="Ungroup Selection">
          <div className="relative flex items-center justify-center font-bold text-red-400">U</div>
        </Button>
        <div className="h-px bg-border my-1" />
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple" onClick={bringToFront} title="Bring to Front">
          <ArrowUpToLine className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple" onClick={sendToBack} title="Send to Back">
          <ArrowDownToLine className="h-6 w-6" />
        </Button>
        <div className="h-px bg-border my-1" />
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-accent-purple/20 hover:text-accent-purple" onClick={undoLastAction} title="Undo">
          <Undo className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-red-500/20 hover:text-red-400" onClick={clearCanvas} title="Clear Canvas">
          <Trash2 className="h-6 w-6" />
        </Button>
      </div>

      {/* Top Actions */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button
          variant="outline"
          className="min-h-[44px] gap-2 border-border bg-bg-secondary/80 backdrop-blur-md text-accent-purple hover:bg-accent-purple/10"
          onClick={analyzeCanvasStrokes}
        >
          <Wand2 className="h-4 w-4" />
          <span>Analyze Sketch</span>
        </Button>

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
