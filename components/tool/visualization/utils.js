import { toPng } from 'html-to-image';

/**
 * Downloads a DOM element as a PNG image.
 * @param {HTMLElement} element - The DOM element to capture.
 * @param {string} filename - The name of the downloaded file.
 */
export const downloadChartAsPng = async (element, filename = "chart.png") => {
    if (!element) return;

    try {
        const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 3, backgroundColor: 'white' });
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to export image', err);
    }
};

/**
 * Interpolates between two colors.
 * @param {string} color1 - Start color as hex or rgb.
 * @param {string} color2 - End color as hex or rgb.
 * @param {number} factor - Interpolation factor (0-1).
 */
const interpolateColor = (color1, color2, factor) => {
    if (factor === undefined) {
        return color1;
    }
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};

// RGB values for themes
const THEMES = {
    RdBu: {
        neg: [239, 68, 68], // Red-500
        mid: [255, 255, 255], // White
        pos: [59, 130, 246] // Blue-500
    },
    BrBG: {
        neg: [166, 97, 26], // Brown
        mid: [255, 255, 255], // White
        pos: [1, 133, 113] // Teal
    },
    PiYG: {
        neg: [197, 27, 125], // Pink
        mid: [255, 255, 255], // White
        pos: [77, 146, 33] // Green
    },
    // Simple Viridis approximation (Sequential)
    Viridis: {
        stops: [
            [68, 1, 84],   // 0.0
            [72, 40, 120], // 0.25
            [62, 74, 137], // 0.5
            [49, 104, 142], // 0.75
            [253, 231, 37] // 1.0
        ]
    }
};

/**
 * Gets a color for a given correlation value and theme.
 * @param {number} value - Correlation value (-1 to 1).
 * @param {string} theme - Theme key (RdBu, BrBG, PiYG, Viridis).
 */
export const getHeatmapColor = (value, theme = "RdBu") => {
    // Handle sequential themes like Viridis differently (map -1..1 to 0..1 or just use absolute?)
    // Correlation is usually diverging. If user picks Viridis, they probably want -1 to map to 0 and 1 to 1.

    if (theme === "Viridis") {
        // Map -1...1 to 0...1
        const normalized = (value + 1) / 2;
        const stops = THEMES.Viridis.stops;
        const step = 1 / (stops.length - 1);

        let i = 0;
        for (; i < stops.length - 1; i++) {
            if (normalized <= (i + 1) * step) {
                break;
            }
        }

        // Local interpolation
        const factor = (normalized - i * step) / step;
        const c1 = stops[i];
        const c2 = stops[i + 1] || stops[stops.length - 1];

        const rgb = interpolateColor(c1, c2, factor);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    // Diverging themes
    const t = THEMES[theme] || THEMES.RdBu;
    let rgb;

    // Ensure value is a number and clamped
    const val = Math.max(-1, Math.min(1, Number(value) || 0));

    if (val < 0) {
        // Interpolate between neg and mid
        rgb = interpolateColor(t.mid, t.neg, Math.abs(val));
    } else {
        // Interpolate between mid and pos
        rgb = interpolateColor(t.mid, t.pos, val);
    }

    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};
