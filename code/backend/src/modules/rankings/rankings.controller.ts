import { Request, Response } from 'express';

interface RankingEntry {
  playerName: string;
  score: number;
  level: number;
  timestamp: string;
}

// Almacenamiento temporal en memoria (se migrará a BD)
const rankings: RankingEntry[] = [];

export const getRankings = (_req: Request, res: Response): void => {
  const sorted = [...rankings]
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  res.json(sorted);
};

export const submitScore = (req: Request, res: Response): void => {
  const { playerName, score, level } = req.body;

  if (!playerName || score === undefined || !level) {
    res.status(400).json({ error: 'Faltan campos requeridos: playerName, score, level' });
    return;
  }

  const entry: RankingEntry = {
    playerName,
    score,
    level,
    timestamp: new Date().toISOString()
  };

  rankings.push(entry);

  res.status(201).json(entry);
};
