import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface CertificateRequest {
  playerName: string;
  level: number;
  skills: string[];
  playTimeMinutes: number;
}

// Almacenamiento temporal en memoria (se migrará a BD)
const certificates = new Map<string, object>();

export const generateCertificate = (req: Request, res: Response): void => {
  const { playerName, level, skills, playTimeMinutes } = req.body as CertificateRequest;

  if (!playerName || !level || !skills) {
    res.status(400).json({ error: 'Faltan campos requeridos: playerName, level, skills' });
    return;
  }

  const certificate = {
    uuid: uuidv4(),
    playerName,
    level,
    skills,
    playTimeMinutes: playTimeMinutes || 0,
    issuedAt: new Date().toISOString(),
    valid: true
  };

  certificates.set(certificate.uuid, certificate);

  res.status(201).json(certificate);
};

export const verifyCertificate = (req: Request, res: Response): void => {
  const { uuid } = req.params;

  const certificate = certificates.get(uuid);

  if (!certificate) {
    res.status(404).json({ valid: false, error: 'Certificado no encontrado' });
    return;
  }

  res.json(certificate);
};
