import * as Phaser from 'phaser';

/**
 * Sistema de globos de mensaje responsivos para Karen
 * 
 * Características:
 * - Globos que aparecen sobre Karen cuando envía mensajes
 * - Responsivo para móvil (tamaños y posiciones adaptables)
 * - Animaciones suaves de entrada y salida
 * - Seguimiento de la posición de Karen
 * - Compatible con el sistema de zoom de la cámara
 */

interface BubbleConfig {
  message: string;
  duration: number;           // Duración en milisegundos
  stressImpact?: number;     // Para mostrar efecto del mensaje
  karenImpact?: number;      // Para mostrar efecto del mensaje
}

interface ResponsiveConfig {
  // Tamaños base (se escalan según el dispositivo)
  bubbleWidth: number;
  bubbleHeight: number;
  fontSize: string;
  padding: number;
  
  // Offsets desde la posición de Karen
  offsetX: number;
  offsetY: number;
  
  // Configuración móvil
  mobileScale: number;       // Escala adicional para móvil
  mobileFontSize: string;    // Tamaño de fuente para móvil
}

export class KarenMessageBubble {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container | null = null;
  private isActive: boolean = false;
  private followTarget: Phaser.GameObjects.Sprite | null = null;
  
  // Configuración responsiva
  private config: ResponsiveConfig;
  private isMobile: boolean;
  
  // Elementos del globo
  private bubble: Phaser.GameObjects.Graphics | null = null;
  private messageText: Phaser.GameObjects.Text | null = null;
  private effectText: Phaser.GameObjects.Text | null = null;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.isMobile = this.detectMobile();
    
    // Configuración base adaptada al dispositivo
    this.config = {
      bubbleWidth: this.isMobile ? 180 : 220,
      bubbleHeight: this.isMobile ? 60 : 70,
      fontSize: this.isMobile ? '10px' : '11px',
      padding: this.isMobile ? 8 : 10,
      offsetX: 0,
      offsetY: this.isMobile ? -80 : -90,   // Más arriba en móvil por controles
      mobileScale: 1.1,                     // Escala ligeramente mayor en móvil
      mobileFontSize: '10px'
    };
  }

  /**
   * Muestra un globo de mensaje sobre Karen
   */
  show(karenSprite: Phaser.GameObjects.Sprite, bubbleConfig: BubbleConfig): void {
    if (this.isActive) {
      this.hide(); // Ocultar globo anterior si existe
    }
    
    this.isActive = true;
    this.followTarget = karenSprite;
    
    // Crear container para el globo
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(2500); // Por encima de todo
    
    // Crear elementos del globo
    this.createBubbleGraphics(bubbleConfig);
    this.createMessageText(bubbleConfig.message);
    this.createEffectText(bubbleConfig);
    
    // Posicionar inicialmente
    this.updatePosition();
    
    // Animación de entrada
    this.animateIn();
    
    // Auto-ocultar después de la duración
    this.scene.time.delayedCall(bubbleConfig.duration, () => {
      this.hide();
    });
    
    console.log('[KarenMessageBubble] Mostrando globo:', bubbleConfig.message);
  }

  /**
   * Oculta el globo de mensaje actual
   */
  hide(): void {
    if (!this.isActive || !this.container) return;
    
    this.animateOut(() => {
      this.cleanup();
    });
  }

  /**
   * Actualiza la posición del globo para seguir a Karen
   * Debe llamarse desde el update() de la escena
   */
  update(): void {
    if (this.isActive && this.container && this.followTarget) {
      this.updatePosition();
    }
  }

  /**
   * Crea los gráficos del globo de mensaje
   */
  private createBubbleGraphics(bubbleConfig: BubbleConfig): void {
    this.bubble = this.scene.add.graphics();
    
    const width = this.config.bubbleWidth;
    const height = this.config.bubbleHeight;
    const cornerRadius = 12;
    const tailWidth = 16;
    const tailHeight = 12;
    
    // Color del globo basado en el impacto del mensaje
    let bubbleColor = 0x2a2a4a;  // Azul oscuro por defecto
    let borderColor = 0x4466aa;  // Azul claro por defecto
    
    if (bubbleConfig.stressImpact && bubbleConfig.stressImpact > 10) {
      bubbleColor = 0x4a2a2a;  // Rojo oscuro para mensajes muy estresantes
      borderColor = 0xaa4466;  // Rojo claro
    } else if (bubbleConfig.stressImpact && bubbleConfig.stressImpact > 5) {
      bubbleColor = 0x4a3a2a;  // Naranja oscuro para mensajes medianamente estresantes
      borderColor = 0xaa7744;  // Naranja claro
    }
    
    // Dibujar globo principal
    this.bubble.fillStyle(bubbleColor, 0.95);
    this.bubble.lineStyle(2, borderColor, 1);
    
    // Globo redondeado
    this.bubble.fillRoundedRect(
      -width/2, -height - tailHeight, 
      width, height, 
      cornerRadius
    );
    this.bubble.strokeRoundedRect(
      -width/2, -height - tailHeight, 
      width, height, 
      cornerRadius
    );
    
    // Cola del globo (triángulo apuntando hacia Karen)
    this.bubble.fillTriangle(
      -tailWidth/2, -tailHeight,      // Izquierda
      tailWidth/2, -tailHeight,       // Derecha  
      0, 0                            // Punta hacia Karen
    );
    this.bubble.strokeTriangle(
      -tailWidth/2, -tailHeight,
      tailWidth/2, -tailHeight,
      0, 0
    );
    
    this.container!.add(this.bubble);
  }

  /**
   * Crea el texto del mensaje
   */
  private createMessageText(message: string): void {
    const fontSize = this.isMobile ? this.config.mobileFontSize : this.config.fontSize;
    const maxWidth = this.config.bubbleWidth - (this.config.padding * 2);
    
    this.messageText = this.scene.add.text(0, -this.config.bubbleHeight/2 - 12, message, {
      fontSize: fontSize,
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      wordWrap: { width: maxWidth, useAdvancedWrap: true },
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    
    this.container!.add(this.messageText);
  }

  /**
   * Crea el texto de efectos (+estrés, etc.)
   */
  private createEffectText(bubbleConfig: BubbleConfig): void {
    if (!bubbleConfig.stressImpact && !bubbleConfig.karenImpact) return;
    
    const effects: string[] = [];
    
    if (bubbleConfig.stressImpact) {
      effects.push(`+${bubbleConfig.stressImpact} 😰`);
    }
    if (bubbleConfig.karenImpact) {
      effects.push(`+${bubbleConfig.karenImpact} 😡`);
    }
    
    const effectString = effects.join(' ');
    const fontSize = this.isMobile ? '8px' : '9px';
    
    this.effectText = this.scene.add.text(
      0, -this.config.bubbleHeight/2 + 8, 
      effectString, 
      {
        fontSize: fontSize,
        color: '#FF6666',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5, 0.5);
    
    this.container!.add(this.effectText);
  }

  /**
   * Actualiza la posición del globo para seguir a Karen
   */
  private updatePosition(): void {
    if (!this.container || !this.followTarget) return;
    
    // Obtener posición de Karen en coordenadas del mundo
    const karenX = this.followTarget.x;
    const karenY = this.followTarget.y;
    
    // Calcular offset responsivo
    const offsetX = this.config.offsetX;
    const offsetY = this.config.offsetY;
    
    // Aplicar offset
    const bubbleX = karenX + offsetX;
    const bubbleY = karenY + offsetY;
    
    // Asegurarse de que el globo no se salga de los límites visibles
    // Obtener límites de la cámara
    const camera = this.scene.cameras.main;
    const worldView = camera.worldView;
    
    const adjustedX = Phaser.Math.Clamp(
      bubbleX, 
      worldView.left + this.config.bubbleWidth/2, 
      worldView.right - this.config.bubbleWidth/2
    );
    
    const adjustedY = Phaser.Math.Clamp(
      bubbleY,
      worldView.top + this.config.bubbleHeight + 20,
      worldView.bottom - 20
    );
    
    this.container.setPosition(adjustedX, adjustedY);
  }

  /**
   * Animación de entrada del globo
   */
  private animateIn(): void {
    if (!this.container) return;
    
    // Empezar invisible y pequeño
    this.container.setAlpha(0);
    this.container.setScale(0.3);
    
    // Animar entrada
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      scaleX: this.isMobile ? this.config.mobileScale : 1,
      scaleY: this.isMobile ? this.config.mobileScale : 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
    
    // Pequeño bounce adicional para llamar la atención
    this.scene.time.delayedCall(300, () => {
      if (this.container) {
        this.scene.tweens.add({
          targets: this.container,
          scaleX: (this.isMobile ? this.config.mobileScale : 1) * 1.1,
          scaleY: (this.isMobile ? this.config.mobileScale : 1) * 1.1,
          duration: 150,
          yoyo: true,
          ease: 'Sine.easeInOut'
        });
      }
    });
  }

  /**
   * Animación de salida del globo
   */
  private animateOut(onComplete?: () => void): void {
    if (!this.container) {
      if (onComplete) onComplete();
      return;
    }
    
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      y: this.container.y - 20, // Subir un poco al desaparecer
      duration: 250,
      ease: 'Power2.easeIn',
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }

  /**
   * Limpia todos los recursos del globo
   */
  private cleanup(): void {
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
    
    this.bubble = null;
    this.messageText = null;
    this.effectText = null;
    this.followTarget = null;
    this.isActive = false;
    
    console.log('[KarenMessageBubble] Globo destruido');
  }

  /**
   * Detecta si el dispositivo es móvil
   */
  private detectMobile(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }

  /**
   * Verifica si hay un globo activo
   */
  isShowing(): boolean {
    return this.isActive;
  }

  /**
   * Fuerza la limpieza (para cuando se destruye la escena)
   */
  forceCleanup(): void {
    this.cleanup();
  }
}