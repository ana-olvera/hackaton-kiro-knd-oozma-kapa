import { Router } from 'express';
import { getRankings, submitScore } from './rankings.controller';

export const rankingsRouter = Router();

// Obtener top rankings
rankingsRouter.get('/', getRankings);

// Enviar un nuevo score
rankingsRouter.post('/', submitScore);
