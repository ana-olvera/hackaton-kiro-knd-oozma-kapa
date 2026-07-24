import * as Phaser from 'phaser';

/**
 * Sistema de globos de mensaje interactivos reutilizable para todos los NPCs
 * 
 * Características:
 * - Globos personalizables por personaje (colores, estilo)
 * - Botones interactivos (Aceptar/Rechazar)
 * - Responsivo para móvil
 * - Seguimiento automático del NPC
 */

interface InteractiveBubbleConfig {
  message: string;
  character: {
    name: string;
    color: string;        // Color principal del personaje
    accentColor: string;  // Color de acento
  };
  buttons?: {
    accept?: { text: string; callback: () => void };
    decline?: { text: string; callback: () => void };
  };
  autoHide?: boolean;     // Si se oculta automáticamente
  duration?: number;      // Duración antes de auto-ocultar
  effects?: {
    stress?: number;
    happiness?: number;
    energy?: number;
  };
}

export class InteractiveMessageBubble {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container | null = null;
  private isActive: boolean = false;
  private followTarget: Phaser.GameObjects.Sprite | null = null;
  
  // Elementos del globo
  private bubble: Phaser.GameObjects.Graphics | null = null;
  private messageText: Phaser.GameObjects.Text | null = null;
  private effectText: Phaser.GameObjects.Text | null = null;
  private buttons: Phaser.GameObjects.Container[] = [];
  
  // Configuración
  private isMobile: boolean;
  private currentConfig: InteractiveBubbleConfig | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.isMobile = this.detectMobile();
  }
  /**
   * Muestra un globo interactivo sobre el NPC
   */
  show(target: Phaser.GameObjects.Sprite, config: InteractiveBubbleConfig): void {
    if (this.isActive) this.hide();
    
    this.isActive = true;
    this.followTarget = target;
    this.currentConfig = config;
    
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(3000);
    
    this.createBubbleGraphics();
    this.createMessageText();
    this.createButtons();
    this.updatePosition();
    this.animateIn();
  }

  private createButtons(): void {
    if (!this.currentConfig?.buttons || !this.container) return;
    
    const { accept, decline } = this.currentConfig.buttons;
    
    if (accept) {
      const btn = this.scene.add.text(-30, -20, accept.text, {
        fontSize: '10px', color: '#FFFFFF', backgroundColor: this.currentConfig.character.accentColor,
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5).setInteractive();
      
      btn.on('pointerdown', () => { accept.callback(); this.hide(); });
      this.container.add(btn);
    }
    
    if (decline) {
      const btn = this.scene.add.text(30, -20, decline.text, {
        fontSize: '10px', color: '#FFFFFF', backgroundColor: '#666666',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5).setInteractive();
      
      btn.on('pointerdown', () => { decline.callback(); this.hide(); });
      this.container.add(btn);
    }
  }

  private createBubbleGraphics(): void {
    if (!this.currentConfig || !this.container) return;
    
    this.bubble = this.scene.add.graphics();
    const color = Phaser.Display.Color.HexStringToColor(this.currentConfig.character.color).color;
    
    this.bubble.fillStyle(color, 0.9);
    this.bubble.fillRoundedRect(-120, -60, 240, 80, 12);
    this.bubble.lineStyle(2, 0xffffff, 0.5);
    this.bubble.strokeRoundedRect(-120, -60, 240, 80, 12);
    
    this.container.add(this.bubble);
  }

  private createMessageText(): void {
    if (!this.currentConfig || !this.container) return;
    
    this.messageText = this.scene.add.text(0, -35, this.currentConfig.message, {
      fontSize: '11px', color: '#FFFFFF', align: 'center',
      wordWrap: { width: 220 }, fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.container.add(this.messageText);
  }

  private updatePosition(): void {
    if (!this.container || !this.followTarget) return;
    this.container.setPosition(this.followTarget.x, this.followTarget.y - 100);
  }

  private animateIn(): void {
    if (!this.container) return;
    this.container.setAlpha(0).setScale(0.5);
    this.scene.tweens.add({
      targets: this.container, alpha: 1, scale: 1, duration: 300, ease: 'Back.easeOut'
    });
  }

  update(): void {
    if (this.isActive) this.updatePosition();
  }

  hide(): void {
    if (!this.isActive || !this.container) return;
    this.container.destroy();
    this.isActive = false;
    this.container = null;
  }

  private detectMobile(): boolean {
    return 'ontouchstart' in window || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);
  }
}