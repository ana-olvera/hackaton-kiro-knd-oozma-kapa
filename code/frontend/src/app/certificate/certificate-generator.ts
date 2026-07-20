/**
 * Generador de certificados PDF en el cliente.
 * Usa Canvas API para dibujar el certificado y lo exporta como imagen descargable.
 * En futuro se puede integrar con jsPDF o pdf-lib para PDF real.
 */

export interface CertificateData {
  playerName: string;
  level: string;
  skills: string[];
  completedAt: Date;
  playTimeMinutes: number;
  uuid: string;
  score: number;
}

export class CertificateGenerator {

  /**
   * Genera un certificado como imagen PNG descargable.
   */
  static async generate(data: CertificateData): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    // Fondo
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 900, 640);

    // Borde dorado
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 860, 600);

    // Borde interior
    ctx.strokeStyle = '#AA8800';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 840, 580);

    // Header
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐱 MICHI ACADEMY 🐱', 450, 80);

    // Subtítulo
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('CERTIFICA QUE', 450, 120);

    // Nombre del jugador
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillText(data.playerName, 450, 175);

    // Línea decorativa bajo el nombre
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 190);
    ctx.lineTo(650, 190);
    ctx.stroke();

    // Texto principal
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('ha sobrevivido exitosamente al', 450, 225);

    ctx.fillStyle = '#00FF88';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText('SPRINT GODÍN', 450, 260);

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(`Nivel completado: ${data.level}`, 450, 295);

    // Skills
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText('demostrando conocimientos en:', 450, 330);

    ctx.fillStyle = '#00CCFF';
    ctx.font = '12px Arial, sans-serif';
    const skillsPerRow = 3;
    for (let i = 0; i < data.skills.length; i++) {
      const row = Math.floor(i / skillsPerRow);
      const col = i % skillsPerRow;
      const sx = 250 + col * 180;
      const sy = 355 + row * 22;
      ctx.textAlign = 'left';
      ctx.fillText(`✔ ${data.skills[i]}`, sx, sy);
    }

    // Datos del certificado
    ctx.textAlign = 'center';
    ctx.fillStyle = '#888888';
    ctx.font = '11px Arial, sans-serif';
    const dateStr = data.completedAt.toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    ctx.fillText(`Fecha: ${dateStr}`, 300, 480);
    ctx.fillText(`ID: ${data.uuid}`, 600, 480);
    ctx.fillText(`Tiempo de juego: ${data.playTimeMinutes} minutos`, 300, 500);
    ctx.fillText(`Puntaje: ${data.score}`, 600, 500);

    // Firma
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('~~ Karen ~~', 450, 550);
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial, sans-serif';
    ctx.fillText('Jefa de Proyecto', 450, 570);

    // QR placeholder
    ctx.fillStyle = '#333333';
    ctx.fillRect(760, 520, 80, 80);
    ctx.fillStyle = '#666666';
    ctx.font = '8px Arial, sans-serif';
    ctx.fillText('QR', 800, 565);

    // Watermark
    ctx.fillStyle = '#222244';
    ctx.font = '10px Arial, sans-serif';
    ctx.fillText('Ayuda a Michi Godín - michi-godin.app', 450, 620);

    return canvas.toDataURL('image/png');
  }

  /**
   * Descarga el certificado como archivo PNG.
   */
  static async download(data: CertificateData): Promise<void> {
    const dataUrl = await CertificateGenerator.generate(data);
    const link = document.createElement('a');
    link.download = `certificado-michi-godin-${data.uuid.slice(0, 8)}.png`;
    link.href = dataUrl;
    link.click();
  }

  /**
   * Genera UUID para el certificado.
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
