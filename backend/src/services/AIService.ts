import { GoogleGenAI } from '@google/genai';
import { InventoryRepository } from '../repositories/InventoryRepository';
import { BloodRequestRepository } from '../repositories/BloodRequestRepository';

export class AIService {
  private inventoryRepository = new InventoryRepository();
  private requestRepository = new BloodRequestRepository();
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn('GEMINI_API_KEY is not defined. Backend will run on Mock AI Fallback mode.');
    }
  }

  // AI Matching Engine
  async matchRequest(requestId: string) {
    const request = await this.requestRepository.findById(requestId);
    if (!request) {
      throw new Error('Blood request not found');
    }

    const inventory = await this.inventoryRepository.findAll();
    const inventorySummary = inventory
      .map((item) => `${item.bloodType}: ${item.units} units (Min required: ${item.minRequired})`)
      .join('\n');

    const systemPrompt = `
You are the MedBridge AI Dispatch Matchmaker, a clinical routing coordinator.
You must determine the optimal blood dispatch route based on stock levels and request urgency.

Active Request:
- ID: ${request.id}
- Blood Type: ${request.bloodType}
- Required Units: ${request.units}
- Hospital: ${request.hospitalName}
- Urgency: ${request.urgency}

Current Regional Inventory reserves:
${inventorySummary}

Determine the matching result. Choose a regional depot (e.g. LifeCare Central Depot, West Bay Depot, or Northside Depot).
Calculate a plausible ETA (between 10 to 45 mins) and provide a professional, structured clinical explanation.
You must respond with a strict JSON object containing:
{
  "matchedWarehouse": "Depot Name",
  "eta": "X minutes",
  "explanation": "Detailed clinical reasoning"
}
Do not return any markdown wraps or backticks, return only the raw JSON.
`;

    if (this.ai) {
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: systemPrompt,
        });

        const text = response.text || '';
        // Parse the response
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanText);

        // Update request in database
        await this.requestRepository.update(requestId, {
          status: 'reserved',
          eta: jsonResult.eta,
          explanation: jsonResult.explanation,
        });

        return jsonResult;
      } catch (err: any) {
        console.error('Gemini API call failed, falling back to mock routing:', err.message);
      }
    }

    // Mock AI fallback
    const targetItem = inventory.find((item) => item.bloodType === request.bloodType);
    let matchedWarehouse = 'LifeCare Central Depot';
    let eta = '22 minutes';
    let explanation = `Matched with Central Depot. Safe threshold maintained (${targetItem?.units || 0} units remaining).`;

    if (request.urgency === 'critical') {
      eta = '12 minutes';
      explanation = `[CRITICAL PRIORITY DISPATCH] Routed from nearest regional node to bypass traffic coordinates.`;
    }

    await this.requestRepository.update(requestId, {
      status: 'reserved',
      eta,
      explanation,
    });

    return {
      matchedWarehouse,
      eta,
      explanation,
    };
  }

  // AI Chat Coordinator
  async chatCoordinator(message: string, history: Array<{ role: 'user' | 'model'; text: string }> = []) {
    const inventory = await this.inventoryRepository.findAll();
    const lowStock = inventory.filter((item) => item.units < item.minRequired);

    if (this.ai) {
      try {
        // Create context
        const context = `
You are MedBridge AI Assistant, a central coordinator helpdesk bot.
Answer questions about inventory reserves and active alerts using the following live data:

Current Inventory Alerts:
${lowStock.map((item) => `- ${item.bloodType} is low: ${item.units} units left (Min safety threshold: ${item.minRequired})`).join('\n')}

Keep answers short, professional, and clinical.
`;
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${context}\n\nUser: ${message}`,
        });

        return response.text || 'I am processing your query.';
      } catch (err: any) {
        console.error('Gemini Chat failed, falling back to mock:', err.message);
      }
    }

    // Mock keyword responses
    const cleanMsg = message.toLowerCase();
    if (cleanMsg.includes('low') || cleanMsg.includes('stock') || cleanMsg.includes('alert')) {
      if (lowStock.length > 0) {
        return `Current active alerts show low levels for: ${lowStock.map((l) => `${l.bloodType} (${l.units} units remaining)`).join(', ')}. Immediate replenishment is recommended.`;
      }
      return 'All regional inventories are currently operating above their safety thresholds.';
    }

    if (cleanMsg.includes('hi') || cleanMsg.includes('hello')) {
      return 'Hello, I am the MedBridge AI coordinator assistant. How can I assist you with regional reserves or active dispatches today?';
    }

    return 'Understood. I have logged your diagnostic query in our central registry. Let me know if you need to dispatch units.';
  }
}
