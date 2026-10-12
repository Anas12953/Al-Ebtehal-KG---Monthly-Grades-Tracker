import { Router, Request, Response } from 'express';
import { verifyAndGetStudent, MASTER_STUDENTS_DATABASE } from '../src/data/studentsStore.ts';
import { generateAdvisorInsights, chatWithFahem, translateTeacherNote } from './geminiService.ts';
import { StudentRecord } from '../src/types/index.ts';

export const apiRouter = Router();

// In-memory session store (token -> { studentId, createdAt })
interface SessionData {
  emiratesId: string;
  createdAt: number;
}

const sessions = new Map<string, SessionData>();

// Helper to generate session token
function createSession(emiratesId: string): string {
  const token = 'ebt_' + Buffer.from(`${emiratesId}:${Date.now()}:${Math.random()}`).toString('base64url');
  sessions.set(token, { emiratesId, createdAt: Date.now() });
  return token;
}

// Authentication middleware
function getAuthenticatedStudent(req: Request): StudentRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const session = sessions.get(token);
  if (!session) {
    return null;
  }

  // Session valid for 24 hours
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    sessions.delete(token);
    return null;
  }

  const student = MASTER_STUDENTS_DATABASE.find(s => s.emiratesId === session.emiratesId);
  return student || null;
}

// 1. POST /api/auth/login (Emirates ID only)
apiRouter.post('/auth/login', (req: Request, res: Response): void => {
  const { emiratesId } = req.body || {};

  if (!emiratesId) {
    res.status(400).json({ error: 'Missing Emirates ID' });
    return;
  }

  const student = verifyAndGetStudent(String(emiratesId));
  if (!student) {
    // Constant time behavior / anti-enumeration generic message
    res.status(401).json({ error: 'Invalid Emirates ID' });
    return;
  }

  const token = createSession(student.emiratesId);
  const { guardianAccessCode: _unused, ...safeStudent } = student;

  res.json({
    token,
    student: safeStudent,
  });
});

// 2. GET /api/student/me
apiRouter.get('/student/me', (req: Request, res: Response): void => {
  const student = getAuthenticatedStudent(req);
  if (!student) {
    res.status(401).json({ error: 'Unauthorized session or session expired' });
    return;
  }

  const { guardianAccessCode: _unused, ...safeStudent } = student;
  res.json(safeStudent);
});

// 3. POST /api/auth/logout
apiRouter.post('/auth/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    sessions.delete(token);
  }
  res.json({ success: true });
});

// 4. POST /api/ai/advisor
apiRouter.post('/ai/advisor', async (req: Request, res: Response): Promise<void> => {
  const student = getAuthenticatedStudent(req);
  if (!student) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const lang = req.body?.lang === 'en' ? 'en' : 'ar';
  try {
    const feedback = await generateAdvisorInsights(student, lang);
    res.json(feedback);
  } catch (err: any) {
    console.error('Advisor generation error:', err);
    res.status(500).json({ error: 'Failed to generate educational insights' });
  }
});

// 5. POST /api/ai/chat
apiRouter.post('/ai/chat', async (req: Request, res: Response): Promise<void> => {
  const student = getAuthenticatedStudent(req);
  if (!student) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { message, chatHistory, lang } = req.body || {};
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  try {
    const reply = await chatWithFahem(student, message, chatHistory || [], lang === 'en' ? 'en' : 'ar');
    res.json({ reply });
  } catch (err: any) {
    console.error('Fahem Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat response' });
  }
});

// 6. POST /api/translate
apiRouter.post('/translate', async (req: Request, res: Response): Promise<void> => {
  const student = getAuthenticatedStudent(req);
  if (!student) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const text = req.body?.text || student.teacherNotes;
  try {
    const translatedText = await translateTeacherNote(text);
    res.json({ translatedText });
  } catch (err: any) {
    console.error('Translation error:', err);
    res.status(500).json({ error: 'Failed to translate' });
  }
});
