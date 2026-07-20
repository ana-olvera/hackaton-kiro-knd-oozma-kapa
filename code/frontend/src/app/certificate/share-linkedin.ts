/**
 * Sistema de compartir certificados en LinkedIn.
 * Genera el texto y URL para compartir logros del juego.
 */

export interface ShareData {
  playerName: string;
  level: string;
  skills: string[];
  certificateUrl?: string;
}

export class ShareLinkedIn {

  /**
   * Abre ventana de LinkedIn para compartir el certificado.
   */
  static share(data: ShareData): void {
    const text = ShareLinkedIn.generateText(data);
    const url = data.certificateUrl || 'https://michi-godin.app';

    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;

    window.open(linkedinUrl, '_blank', 'width=600,height=500');
  }

  /**
   * Genera texto optimizado para LinkedIn.
   */
  static generateText(data: ShareData): string {
    const skillsList = data.skills.slice(0, 5).join(', ');

    return [
      `🎉 ¡Completé "${data.level}" en "Ayuda a Michi Godín: Sobrevive al Sprint"!`,
      '',
      `Un entrenamiento gamificado donde practiqué ${skillsList} y trabajo colaborativo...`,
      `¡y sobreviví a Karen, a Michi Testings y a Becatín! 🐱💻`,
      '',
      '#Git #GameDev #Aprendizaje #MichiGodin #DevLife',
    ].join('\n');
  }

  /**
   * Copia el texto al portapapeles.
   */
  static async copyText(data: ShareData): Promise<boolean> {
    try {
      const text = ShareLinkedIn.generateText(data);
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Comparte usando Web Share API (móviles).
   */
  static async nativeShare(data: ShareData): Promise<boolean> {
    if (!navigator.share) return false;

    try {
      await navigator.share({
        title: 'Certificado Michi Godín',
        text: ShareLinkedIn.generateText(data),
        url: data.certificateUrl || 'https://michi-godin.app'
      });
      return true;
    } catch {
      return false;
    }
  }
}
