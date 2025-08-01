// API utility functions for SurfAISummary

export async function validateSummary(summary, surfData) {
    try {
        const response = await fetch('/api/validate-summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ summary, surfData }),
        });
        if (!response.ok) {
            return { validatedSummary: summary, wasValidated: false };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('Summary validation failed:', error);
        return { validatedSummary: summary, wasValidated: false };
    }
}

export async function getPrediction(surfConditions) {
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(surfConditions),
        });
        if (!response.ok) {
            console.error('Prediction API error:', response.status);
            return null;
        }
        const data = await response.json();
        // Handle both old format (predicted_score) and new format (prediction: 'Good'/'Bad')
        if (data.predicted_score !== undefined) {
            return data.predicted_score;
        } else if (data.prediction) {
            // Convert 'Good'/'Bad' to numeric score (Good = 1, Bad = 0)
            return data.prediction === 'Good' ? 1 : 0;
        }
        return null;
    } catch (error) {
        console.error('Error getting prediction:', error);
        return null;
    }
}
