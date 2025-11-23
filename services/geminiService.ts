import { GoogleGenAI } from "@google/genai";
import { JobPost } from '../types';

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  // Using the API key provided by the user as fallback if process.env.API_KEY is not set
  const apiKey = process.env.API_KEY || "AIzaSyCXC0cOKeNcQ0XSf8Dlufi2sGHFuoqTtJo";
  
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

const SYSTEM_INSTRUCTION = `
You are "SarkariBot", an intelligent assistant for a government job portal called SarkariAI. 
Your goal is to help users find jobs, understand eligibility criteria, exam dates, and application fees.
You are polite, concise, and factual.
If a user asks about a specific job type (e.g., "police jobs"), summarize common requirements for Indian police jobs generally, or ask them to specify a state.
If the user asks for the "latest result", mention that they can check the 'Results' section on the homepage.
Do not invent fake job posts. If you don't know specific current live data, advise the user to check the specific category page on the website.
Answer in short paragraphs or bullet points.
`;

export const sendMessageToGemini = async (message: string, contextJobs?: JobPost[]): Promise<string> => {
  try {
    const client = getClient();
    if (!client) {
      return "I'm sorry, but I'm not fully configured yet (API Key missing).";
    }

    let prompt = message;
    
    // RAG-lite: Inject some context if available (e.g. if user is viewing a specific page)
    if (contextJobs && contextJobs.length > 0) {
      const jobContext = contextJobs.map(j => `- ${j.title} (${j.category})`).join('\n');
      prompt = `Context - Here are some jobs the user might be looking at:\n${jobContext}\n\nUser Query: ${message}`;
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the server right now. Please try again later.";
  }
};

export interface SEOStrategy {
  targetKeywords: Array<{ term: string; volume: string; difficulty: string; intent: string; rankPotential: string }>;
  backlinkStrategy: {
    sources: string[];
    actionPlan: string;
    estimatedCount: string;
  };
  optimizedTitle: string;
  optimizedDescription: string;
  contentGap: string[];
}

export const getSEORankingStrategy = async (title: string, description: string): Promise<SEOStrategy | null> => {
  try {
    const client = getClient();
    if (!client) return null;

    const prompt = `
      Act as India's No.1 SEO Strategist for Sarkari Result Websites.
      Target: RANK #1 to #5 on Google for the topic: "${title}".
      
      Task 1: KEYWORD RESEARCH (Ahrefs/Semrush Logic)
      - Find 5-6 "Goldmine Keywords" that have HIGH Volume but LOW Difficulty (Easy to rank).
      - Keywords must be specific (e.g., include Year, 'Notification PDF', 'Apply Online').
      - Assign a "Rank Potential" score (e.g., "Top 3 Guaranteed", "Page 1").

      Task 2: BACKLINK STRATEGY
      - List 40 SPECIFIC Indian websites, forums, and directories to create backlinks.
      - Include names like: PaGaLGuY, Quora (Specific Topics), IndusLadies, Shiksha Q&A, Telegram Groups.

      Task 3: META OPTIMIZATION
      - Write a Title and Description that triggers High CTR (Click Through Rate).

      Return JSON Structure:
      {
        "targetKeywords": [
          { "term": "Keyword 1", "volume": "150K", "difficulty": "Easy (KD 15)", "intent": "Informational", "rankPotential": "Rank #1" },
          { "term": "Keyword 2", "volume": "80K", "difficulty": "Medium", "intent": "Transactional", "rankPotential": "Top 3" }
        ], 
        "backlinkStrategy": {
          "sources": [
             "1. PaGaLGuY - SSC Section", 
             "2. Quora - Topic: Govt Jobs", 
             "3. Adda247 Comments",
             "4. Gradeup Community",
             "5. Exambazaar Forum",
             "...(list up to 40 sources)"
          ],
          "actionPlan": "Day 1: Submit PDF to SlideShare. Day 2: Answer 5 Quora questions. Day 3: Share on 10 Telegram Channels.",
          "estimatedCount": "Target: 40+ High Authority Links"
        },
        "optimizedTitle": "SEO Title (Max 60 chars)",
        "optimizedDescription": "Meta Description (Max 160 chars)",
        "contentGap": ["Missing PDF Link", "Previous Year Cutoff Table", "Handwritten Notes PDF"]
      }
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as SEOStrategy;
  } catch (error) {
    console.error("Gemini SEO Error:", error);
    return null;
  }
};

// New Interface for Auto-Writing
export interface GeneratedPostContent {
  shortDescription: string;
  eligibility: string; // Qualification string
  ageLimit: string;
  fee: Array<{ key: string; value: string }>;
  dates: Array<{ key: string; value: string }>;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  keywords: string;
  schemaMarkup: string; // JSON-LD
  
  // New Structured Fields (Replacing HTML)
  introduction: string; // Simple Hook Text
  salaryStructure: string; // Detailed text
  howToApply: string[]; // List of strings
  importantDocuments: string[]; // List of strings
  selectionSteps: string[]; // List of strings
  examPattern: Array<{ paperName?: string; subject: string; questions: string; marks: string; duration: string }>;

  seoAdvice?: {
    backlinkPlan: {
      sites: string[];
      howTo: string; 
    };
    // Enhanced fields for direct mapping to SEOStrategy
    targetKeywords?: Array<{ term: string; volume: string; difficulty: string; intent: string; rankPotential: string }>;
    deepAnalysis?: {
        volume: string;
        difficulty: string;
        competition: string;
        intent: string;
        score: string;
        highCPC: string[];
        longTail: string[];
        semantic: string[];
        questions: string[];
    };
  };
}

export const generateFullPostContent = async (title: string): Promise<GeneratedPostContent | null> => {
  try {
    const client = getClient();
    if (!client) return null;

    const prompt = `
      Act as an Elite SEO Content Strategist & Government Job Expert.
      Goal: Create a post about "${title}" that RANKS #1 on Google (Position Zero / Featured Snippet).
      
      CRITICAL RULES:
      1. **Featured Snippet Intro:** The 'introduction' must be a direct 40-50 word answer summarizing the job (Post Name, Vacancy, Last Date) to trigger Google's Answer Box.
      2. **Human-Like Content:** Use Natural Language Processing terms naturally (e.g., instead of just "Eligibility", use "Who can apply for [Job Name]"). Tone should be helpful, student-friendly, and not robotic.
      3. **Language:** Mix of English and Bengali (Hinglish/Benglish) - simple tone.
      4. **Structured Data:** Generate detailed tables for Fee, Dates, and Exam Pattern.
      5. **SEO Automation:** You MUST generate specific keyword data (volume, difficulty) and a list of **40 SPECIFIC Indian backlink sources**.

      JSON Structure:
      {
        "seoTitle": "High CTR Title (Include Year + 'Apply Online')",
        "seoDescription": "Meta Description (Include Keyword + Call to Action)",
        "keywords": "Primary Keyword, LSI Keyword 1, LSI Keyword 2",
        "slug": "seo-friendly-url-slug",
        "shortDescription": "Engaging summary (150 words) for the post card.",
        "eligibility": "Qualification summary (e.g., 10th Pass / Graduate)",
        "ageLimit": "Detailed Age Limit (Min, Max, Relaxation)",
        "fee": [{"key": "Category", "value": "Amount"}],
        "dates": [{"key": "Event", "value": "Date"}],
        
        "introduction": "This is the 'Position Zero' text. Start with: 'Great news for students! [Board Name] has released notification for...' then summarize facts.",
        "selectionSteps": ["Step 1", "Step 2", "Step 3"],
        "howToApply": ["Step 1: Visit Official Website", "Step 2: Click on 'Apply Online'...", "Step 3..."],
        "importantDocuments": ["Aadhar Card", "Mark Sheets", "Photo", "Signature"],
        "salaryStructure": "Detailed Salary (Basic + DA + HRA). Mention 'In-hand salary'.",
        "examPattern": [{"paperName": "Paper I", "subject": "Subject Name", "questions": "No. of Qs", "marks": "Total Marks", "duration": "Time"}],

        "schemaMarkup": "Generate full JSON-LD 'JobPosting' schema here.",
        "seoAdvice": { 
           "backlinkPlan": {
              "sites": ["1. PaGaLGuY", "2. Quora", "3. ... (Generate exactly 40 sources)"],
              "howTo": "Action plan to build these links."
           },
           "targetKeywords": [
              { "term": "Main Keyword", "volume": "High (e.g. 200k)", "difficulty": "Easy", "intent": "Apply", "rankPotential": "Rank #1" },
              { "term": "Secondary Keyword", "volume": "Medium", "difficulty": "Medium", "intent": "Info", "rankPotential": "Top 3" }
           ]
        }
      }
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as GeneratedPostContent;
  } catch (error) {
    console.error("Gemini Auto-Write Error:", error);
    return null;
  }
};

export const generateViralSeoPost = async (primaryKeyword: string): Promise<GeneratedPostContent | null> => {
    try {
      const client = getClient();
      if (!client) return null;
  
      const prompt = `
        Keyword: "${primaryKeyword}"
        Role: Viral SEO Writer.
        
        Task: Generate STRUCTURED JSON data for a blog post that targets 'Rank #1'.
        Requirement: Provide **40 specific backlink sources** and detailed keyword metrics.
        
        JSON Structure:
        {
          "seoTitle": "...",
          "seoDescription": "...",
          "keywords": "...",
          "slug": "...",
          "shortDescription": "...",
          "introduction": "Viral Hook paragraph (Benglish/Hinglish).",
          "selectionSteps": ["List of steps"],
          "howToApply": ["Step 1...", "Step 2..."],
          "importantDocuments": ["Doc 1", "Doc 2"],
          "salaryStructure": "Simple salary explanation.",
          "examPattern": [{"paperName": "Prelims", "subject": "Sub", "questions": "10", "marks": "10", "duration": "10"}],
          
          "fee": [],
          "dates": [],
          "eligibility": "...",
          "ageLimit": "...",
          "schemaMarkup": "JSON-LD...",
          "seoAdvice": { 
             "backlinkPlan": {
                "sites": ["Generate 40 SPECIFIC Indian sites..."],
                "howTo": "Strategy..."
             },
             "targetKeywords": [
                { "term": "${primaryKeyword}", "volume": "High", "difficulty": "Medium", "intent": "Info", "rankPotential": "Rank #1" }
             ],
             "deepAnalysis": {
                "volume": "100k+", "difficulty": "45", "competition": "High", "intent": "Informational", "score": "95/100",
                "highCPC": ["keyword 1", "keyword 2"],
                "longTail": ["long tail 1", "long tail 2"],
                "semantic": ["LSI 1", "LSI 2"],
                "questions": ["FAQ 1", "FAQ 2"]
             }
          }
        }
      `;
  
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
  
      const text = response.text;
      if (!text) return null;
  
      return JSON.parse(text) as GeneratedPostContent;
    } catch (error) {
      console.error("Viral SEO Gen Error:", error);
      return null;
    }
  };

export const generateContentFromPrompt = async (topic: string): Promise<GeneratedPostContent | null> => {
  try {
    const client = getClient();
    if (!client) return null;

    const prompt = `
      Topic: "${topic}"
      Task: Generate STRUCTURED JSON content. NO HTML.
      Tone: Human-like, student friendly, non-robotic.
      Goal: Rank #1 in India.
      Requirement: Include **40 backlink suggestions**.
      
      JSON Structure:
      {
         "seoTitle": "...", "seoDescription": "...", "keywords": "...",
         "introduction": "...",
         "howToApply": ["Step 1", "Step 2"],
         "salaryStructure": "...",
         "importantDocuments": ["..."],
         "examPattern": [{"paperName": "Paper", "subject": "Sub", "questions": "10", "marks": "10", "duration": "1h"}],
         "seoAdvice": { 
            "backlinkPlan": { 
                "sites": ["List 40 SPECIFIC Indian websites/forums..."], 
                "howTo": "Action plan to build links." 
            },
            "targetKeywords": [
                { "term": "Main Keyword", "volume": "Vol", "difficulty": "Diff", "intent": "Intent", "rankPotential": "Rank" }
            ]
         }
      }
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as GeneratedPostContent;
  } catch (error) {
    console.error("Custom Content Gen Error:", error);
    return null;
  }
};

export const generateSyllabusWithLanguage = async (title: string, state: string, language: string): Promise<string | null> => {
    // Legacy function, keeping for now or can be refactored to JSON later
    return "Syllabus generation not supported in this mode.";
};

export const parseNotificationText = async (text: string): Promise<GeneratedPostContent | null> => {
  try {
    const client = getClient();
    if (!client) return null;

    const prompt = `
      Task: Extract data from text and create a Job Post JSON.
      Input Text: "${text.substring(0, 30000)}"
      
      RULES:
      1. NO HTML.
      2. Return Valid JSON.
      3. Use simple, student-friendly language (Bengali/English mix).
      4. Generate SEO Keywords and Backlink strategy.

      JSON Output Keys:
      - seoTitle, seoDescription, keywords, slug
      - shortDescription, eligibility, ageLimit
      - fee (array), dates (array)
      - introduction (string)
      - selectionSteps (array of strings)
      - howToApply (array of strings)
      - importantDocuments (array of strings)
      - salaryStructure (string)
      - examPattern (array of objects with paperName, subject, questions, marks, duration)
      - schemaMarkup (string)
      - seoAdvice (object with backlinkPlan and targetKeywords)
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const respText = response.text;
    if (!respText) return null;

    return JSON.parse(respText) as GeneratedPostContent;
  } catch (error) {
    console.error("Notification Parse Error:", error);
    return null;
  }
};

export const translateContent = async (content: string, targetLanguage: string): Promise<string> => {
   // Simplified translation stub
   return content;
};