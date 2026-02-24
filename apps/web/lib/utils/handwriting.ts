import * as fabric from 'fabric';

export interface StrokeData {
    svgContent: string;
    color: string;
    width: number;
    boundingBox: { width: number; height: number; left: number; top: number };
}

/**
 * Extracts drawn paths from the Fabric canvas
 */
export function extractCanvasStrokes(canvas: fabric.Canvas): StrokeData[] {
    const objects = canvas.getObjects();
    const strokes: StrokeData[] = [];

    for (const obj of objects) {
        if (obj.type === 'path') {
            const pathObj = obj as fabric.Path;
            strokes.push({
                svgContent: pathObj.toSVG(),
                color: (pathObj.stroke as string) || '#000000',
                width: pathObj.strokeWidth || 1,
                boundingBox: {
                    width: pathObj.width || 0,
                    height: pathObj.height || 0,
                    left: pathObj.left || 0,
                    top: pathObj.top || 0,
                },
            });
        }
    }

    return strokes;
}

/**
 * Placeholder for LLM handwriting recognition processing
 */
export async function processHandwriting(strokes: StrokeData[]): Promise<string> {
    // In future Sprints, this will post to the AI Router using a Vision model
    // or a specialized Canvas-to-Code mapping agent.
    if (strokes.length === 0) return '';
    return `Detected ${strokes.length} drawn strokes. (Ready for AI interpretation)`;
}
