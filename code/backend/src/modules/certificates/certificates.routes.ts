import { Router } from 'express';
import { generateCertificate, verifyCertificate, getCertificateQR } from './certificates.controller';

export const certificatesRouter = Router();

// Generar un nuevo certificado
certificatesRouter.post('/generate', generateCertificate);

// Verificar un certificado existente por UUID
certificatesRouter.get('/verify/:uuid', verifyCertificate);

// Obtener QR de un certificado
certificatesRouter.get('/qr/:uuid', getCertificateQR);
