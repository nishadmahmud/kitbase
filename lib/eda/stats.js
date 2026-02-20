import * as ss from 'simple-statistics';

/**
 * Calculates descriptive statistics for all numeric columns in the data.
 * @param {Array<Object>} data - Array of data objects.
 * @returns {Object} - Object where keys are column names and values are stats objects.
 */
export function calculateDescriptiveStats(data) {
    if (!data || data.length === 0) return {};

    const columns = Object.keys(data[0]);
    const stats = {};

    columns.forEach(col => {
        // Filter out non-numeric values and convert to numbers
        const values = data.map(row => Number(row[col])).filter(val => !isNaN(val) && typeof val === 'number');

        // Only calculate stats if we have valid numeric data
        if (values.length > 0) {
            try {
                stats[col] = {
                    count: values.length,
                    min: ss.min(values),
                    max: ss.max(values),
                    sum: ss.sum(values),
                    mean: ss.mean(values),
                    median: ss.median(values),
                    mode: ss.mode(values), // Can return single value or array, handle with care in UI
                    variance: ss.variance(values),
                    stdDev: ss.standardDeviation(values),
                    q1: ss.quantile(values, 0.25),
                    q3: ss.quantile(values, 0.75),
                    skewness: ss.sampleSkewness(values),
                    kurtosis: ss.sampleKurtosis(values),
                };
            } catch (error) {
                console.warn(`Could not calculate stats for column ${col}:`, error);
            }
        }
    });

    return stats;
}

/**
 * Calculates the correlation matrix for all numeric columns.
 * @param {Array<Object>} data 
 * @returns {Object} - { variables: string[], matrix: number[][] }
 */
export function calculateCorrelationMatrix(data) {
    if (!data || data.length === 0) return { variables: [], matrix: [] };

    // Identify numeric columns
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => {
        const val = Number(data[0][col]);
        return !isNaN(val) && typeof val === 'number';
    });

    const matrix = [];

    for (let i = 0; i < numericColumns.length; i++) {
        const row = [];
        for (let j = 0; j < numericColumns.length; j++) {
            const col1 = numericColumns[i];
            const col2 = numericColumns[j];

            // Extract vectors
            const v1 = data.map(r => Number(r[col1]));
            const v2 = data.map(r => Number(r[col2]));

            try {
                const correlation = ss.sampleCorrelation(v1, v2);
                row.push(correlation);
            } catch (e) {
                row.push(0); // Fallback
            }
        }
        matrix.push(row);
    }

    return { variables: numericColumns, matrix };
}

/**
 * Bins data for histogram.
 * @param {Array<Object>} data 
 * @param {string} column 
 * @param {number} numBins 
 */
export function createHistogramData(data, column, numBins = 10) {
    const values = data.map(row => Number(row[column])).filter(val => !isNaN(val));
    if (values.length === 0) return [];

    const min = ss.min(values);
    const max = ss.max(values);
    const range = max - min;
    const binSize = range / numBins;

    const bins = new Array(numBins).fill(0).map((_, i) => ({
        binStart: min + i * binSize,
        binEnd: min + (i + 1) * binSize,
        count: 0,
        name: `${(min + i * binSize).toFixed(1)} - ${(min + (i + 1) * binSize).toFixed(1)}`
    }));

    values.forEach(val => {
        let binIndex = Math.floor((val - min) / binSize);
        if (binIndex >= numBins) binIndex = numBins - 1; // Handle max value case
        if (binIndex < 0) binIndex = 0;
        bins[binIndex].count++;
    });

    return bins;
}
