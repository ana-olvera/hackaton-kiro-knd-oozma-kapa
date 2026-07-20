import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

interface CertificateRequest {
  playerName: string;
  level: string;
  skills: string[];
  playTimeMinutes: number;
  score: number;
}

interface StoredCertificate {
  uuid: string;
  playerName: string;
  level: string;
  skills: string[];
  playTimeMinutes: number;
  score: number;
  issuedAt: string;
  valid: boolean;
  verifyUrl: string;
  qrDataUrl?: string;
}

// Almacenamiento en memoria (migrar a BD en producción)
const certificates = new Map<string, StoredCertificate>();

const BASE_URL = process.env.CERTIFICATES_BASE_URL || 'https://michi-godin.app/verify';

export const generateCertificate = async (req: Request, res: Response): Promise<void> => {
  const { playerName, level, skills, playTimeMinutes, score } = req.body as CertificateRequest;

  if (!playerName || !level || !skills) {
    res.status(400).json({ error: 'Faltan campos requeridos: playerName, level, skills' });
    return;
  }

  const uuid = uuidv4();
  const verifyUrl = `${BASE_URL}/${uuid}`;

  // Generar QR
  let qrDataUrl: string | undefined;
  try {
    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 150,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' }
    });
  } catch {
    // QR opcional, si falla continuamos sin él
  }

  const certificate: StoredCertificate = {
    uuid,
    playerName,
    level,
    skills,
    playTimeMinutes: playTimeMinutes || 0,
    score: score || 0,
    issuedAt: new Date().toISOString(),
    valid: true,
    verifyUrl,
    qrDataUrl
  };

  certificates.set(uuid, certificate);

  res.status(201).json(certificate);
};

export const verifyCertificate = (req: Request, res: Response): void => {
  const { uuid } = req.params;

  const certificate = certificates.get(uuid);

  if (!certificate) {
    res.status(404).json({
      valid: false,
      error: 'Certificado no encontrado',
      message: 'Este certificado no existe o ha sido revocado.'
    });
    return;
  }

  res.json({
    valid: certificate.valid,
    playerName: certificate.playerName,
    level: certificate.level,
    skills: certificate.skills,
    playTimeMinutes: certificate.playTimeMinutes,
    score: certificate.score,
    issuedAt: certificate.issuedAt,
    verifyUrl: certificate.verifyUrl
  });
};

export const getCertificateQR = async (req: Request, res: Response): Promise<void> => {
  const { uuid } = req.params;

  const certificate = certificates.get(uuid);
  if (!certificate) {
    res.status(404).json({ error: 'Certificado no encontrado' });
    return;
  }

  if (certificate.qrDataUrl) {
    res.json({ qr: certificate.qrDataUrl, verifyUrl: certificate.verifyUrl });
    return;
  }

  try {
    const qrDataUrl = await QRCode.toDataURL(certificate.verifyUrl, { width: 200, margin: 1 });
    certificate.qrDataUrl = qrDataUrl;
    res.json({ qr: qrDataUrl, verifyUrl: certificate.verifyUrl });
  } catch {
    res.status(500).json({ error: 'Error generando QR' });
  }
};
