
// AI Freight Interpreter Utility
// Parses raw text into structured data (Simulating AI/NLP)

export const interpretFreight = (description) => {
    // Mock AI interpretation logic
    const result = {
        originalText: description,
        pickup: null,
        delivery: null,
        weight: null,
        pallets: null,
        priceHint: null,
        equipment: [],
        riskFactor: 'Low', // Mock risk score
        partner: {
            name: "LogiTrans GmbH",
            rating: 4.8,
            verified: true
        },
        times: {
            loading: "08:00 - 16:00",
            unloading: "Fix 08:00"
        }
    };
    
    // ... regex logic ...

    // Mock partner variation
    if (description.includes("HU")) {
        result.partner = { name: "Waberer's Network", rating: 4.5, verified: true };
    } else if (description.includes("PL")) {
        result.partner = { name: "PolTrans Sp. z o.o.", rating: 3.9, verified: false };
    }

    // Simple regex based extraction (Mocking AI)

    // Extract route (Simple heuristic: XX-DD City -> XX-DD City)
    const routeMatch = description.match(/([A-Z]{2}-\d{2}\s[\w\u00C0-\u024F]+)\s->\s([A-Z]{2}-\d{2}\s[\w\u00C0-\u024F]+)/);
    if (routeMatch) {
        result.pickup = routeMatch[1];
        result.delivery = routeMatch[2];
    }

    // Extract weight
    const weightMatch = description.match(/(\d+(?:\.\d+)?)\s*t/);
    if (weightMatch) {
        result.weight = parseFloat(weightMatch[1]);
    }

    // Extract pallets
    const palletMatch = description.match(/(\d+)\s*pal/);
    if (palletMatch) {
        result.pallets = parseInt(palletMatch[1]);
    }

    // Extract price
    const priceMatch = description.match(/(\d+)\s*(?:EUR|€)/);
    if (priceMatch) {
        result.priceHint = parseInt(priceMatch[1]);
    }

    // Detect equipment/features keywords
    const features = ['hűtős', 'ponyvás', 'dobozos', 'mega', 'furgon', 'emelőhátfalas', 'daruzható', 'ADR'];
    features.forEach(feature => {
        if (description.toLowerCase().includes(feature.toLowerCase())) {
            result.equipment.push(feature);
        }
    });

    // Risk Score Logic Mock
    if (!result.priceHint) {
        result.riskFactor = 'Medium'; // No price usually means negotiation needed
    }

    return result;
};
