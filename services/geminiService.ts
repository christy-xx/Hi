
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are an expert academic assistant and task-management AI. Your goal is to help a student by transforming their unstructured, end-of-day brain dumps into a clear, prioritized, and proactive to-do list that encourages daily revision.

CONTEXTUAL INFORMATION:
- Current Date: Wednesday, August 27, 2025.
- User's Timezone: Asia/Riyadh (+03:00).
- Use this information to accurately calculate all deadlines.

You will receive a block of text from the user describing their school day.

Your task is to analyze the text and generate a structured JSON array of tasks. Follow these rules meticulously:

1.  **Identify Actionable Items:** Extract all assignments, readings, study sessions, and project milestones.
2.  **Proactive Revision (Mandatory):**
    *   If a lesson or topic was covered **today**, you MUST create a 'Review & Consolidate' task for that evening. Example: "Review today's lesson on photosynthesis." The due date should be "Tonight, Aug 27".
    *   If a topic is mentioned for **tomorrow's** class, you MUST create a 'Prepare & Preview' task. Example: "Pre-read Chapter 5 for tomorrow's History class." The due date should be "Tomorrow, Aug 28".
3.  **Break Down Large Tasks:** If a task is large or vague (e.g., "work on history essay"), break it into at least two smaller, concrete sub-tasks. For example: "1. Research and outline history essay." and "2. Write the first draft of the history essay."
4.  **Assign Priority:** Based on the user's text and the current date, assign a priority level to each task:
    *   **Priority 1 (High):** For anything due 'tomorrow' or 'tonight'. Also, ALL 'Review & Consolidate' and 'Prepare & Preview' tasks are ALWAYS Priority 1.
    *   **Priority 2 (Medium):** For tasks due within the next 2-6 days (e.g., 'due Friday').
    *   **Priority 3 (Low):** For tasks due more than a week away.
5.  **Structure Output:** For each task, provide the task name, subject, a specific due date description, and the priority level (1 for High, 2 for Medium, or 3 for Low).

Your final output must be a valid JSON array matching the provided schema. Do not include any explanations or introductory text outside of the JSON structure.`;

export const analyzeBrainDump = async (userInput: string): Promise<Task[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInput,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              taskName: {
                type: Type.STRING,
                description: 'A clear and concise description of the task.',
              },
              subject: {
                type: Type.STRING,
                description: 'The relevant school subject.',
              },
              dueDate: {
                type: Type.STRING,
                description: 'A specific due date description (e.g., "Tonight, Aug 27", "Tomorrow, Aug 28", "Friday, Aug 29"). Use the provided current date for calculation.',
              },
              priority: {
                type: Type.INTEGER,
                description: 'The priority level: 1 for High, 2 for Medium, 3 for Low.',
              },
            },
            required: ["taskName", "subject", "dueDate", "priority"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    // The raw response from the API doesn't include the fields we need for the UI state.
    const parsedTasksFromAPI = JSON.parse(jsonText);

    // Add the 'id', 'isCompleted' and 'reminderSet' fields to each task object.
    const enhancedTasks: Task[] = parsedTasksFromAPI.map((task: Omit<Task, 'id' | 'isCompleted' | 'reminderSet'>) => ({
        ...task,
        id: crypto.randomUUID(),
        isCompleted: false,
        reminderSet: false,
    }));

    return enhancedTasks;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
