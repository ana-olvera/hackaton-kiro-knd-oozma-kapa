import * as Phaser from 'phaser';

/**
 * Sistema de diálogos con elección para Michi News.
 * Permite al jugador decidir si ignorar o escuchar el chisme.
 * 
 * Mecánica:
 * - Ignorar: +Tiempo (el jugador sigue trabajando)
 * - Escuchar: +Felicidad, -Tiempo (mínimo 30 minutos de chisme)
 */

export interface ChoiceOption {
  text: string;
  icon: string;
  effects: {
    time?: number;
    happiness?: number;
    stress?: number;
  };
  tooltip?: string;
}

export interface ChoiceDialog {
  id: string;
  character: {
    name: string;
    color: string;
    icon: string;
  };
  dialogue: string;
  choices: [ChoiceOption, ChoiceOption]; // Siempre 2 opciones
}

// Diálogos de chisme de Michi News
const MICHINEWS_DIALOGUES: Omit<ChoiceDialog, 'id'>[] = [
  {
    character: {
      name: 'Michi News',
      color: '#CC66FF',
      icon: '🐱📰'
    },
    dialogue: '"Ven tantito... ¿ya supiste lo del aumento?"',
    choices: [
      { text: 'Ignorar', icon: '⏭️', effects: { time: 5 }, tooltip: 'Ganas 5 minutos' },
      { text: 'Escuchar', icon: '👂', effects: { happiness: 15, time: -30 }, tooltip: '+15 felicidad, -30 min' }
    ]
  },
  {
    character: {
      name: 'Michi News',
      color: '#CC66FF',
      icon: '🐱📰'
    },
    dialogue: '"¿Ya viste quién renunció? Dicen que era el lead..."',
    choices: [
      { text: 'Ignorar', icon: '⏭️', effects: { time: 5 }, tooltip: 'Ganas 5 minutos' },
      { text: 'Escuchar', icon: '👂', effects: { happiness: 12, time: -35 }, tooltip: '+12 felicidad, -35 min' }
    ]
  },
  {
    character: {
      name: 'Michi News',
      color: '#CC66FF',
      icon: '🐱📰'
    },
    dialogue: '"Dicen que RH anda buscando gente para despedir..."',
    choices: [
      { text: 'Ignorar', icon: '⏭️', effects: { time: 5 }, tooltip: 'Ganas 5 minutos' },
      { text: 'Escuchar', icon: '👂', effects: { happiness: 8, stress: 10, time: -30 }, tooltip: '+8 felicidad, +10 estrés, -30 min' }
    ]
  },
  {
    character: {
      name: 'Michi News',
      color: '#CC66FF',
      icon: '🐱📰'
    },
    dialogue: '"Oye, ¿sabías que van a meter IA? Ya ni te contests..."',
    choices: [
      { text: 'Ignorar', icon: '⏭️', effects: { time: 5 }, tooltip: 'Ganas 5 minutos' },
      { text: 'Escuchar', icon: '👂', effects: { happiness: 10, stress: 5, time: -40 }, tooltip: '+10 felicidad, +5 estrés, -40 min' }
    ]
  },
  {
    character: {
      name: 'Michi News',
      color: '#CC66FF',
      icon: '🐱📰'
    },
    dialogue: '"El de sistemas se fue a las 3 y nadie dijo nada..."',
    choices: [
      { text: 'Ignorar', icon: '⏭️', effects: { time: 5 }, tooltip: 'Ganas 5 minutos' },
      { text: 'Escuchar', icon: '👂', effects: { happiness: 20, time: -25 }, tooltip: '+20 felicidad, -25 min' }
    ]
  },
  {
    character: {
      name: 'Michi News',
      color: '#CC66FF',
      icon: '🐱📰'
    },
    dialogue: '"Dicen que van a quitar home office... bueno, temporalmente."',
    choices: [
      { text: 'Ignorar', icon: '⏭️', effects: { time: 5 }, tooltip: 'Ganas 5 minutos' },
      { text: 'Escuchar', icon: '👂', effects: { happiness: 5, stress: 15, time: -30 }, tooltip: '+5 felicidad, +15 estrés, -30 min' }
    ]
  },
  {
    character: {
      name: 'Michi News',
      color: '#CC66FF',
      icon: '🐱📰'
    },
    dialogue: '"¿Ya conoces a la nueva? Tiene 15 años de experiencia... en marketing."',
    choices: [
      { text: 'Ignorar', icon: '⏭️', effects: { time: 5 }, tooltip: 'Ganas 5 minutos' },
      { text: 'Escuchar', icon: '👂', effects: { happiness: 18, time: -32 }, tooltip: '+18 felicidad, -32 min' }
    ]
  },
  {
    character: {
      name: 'Michi News',
      color: '#CC66FF',
      icon: '🐱📰'
    },
    dialogue: '"El jefe vino a las 11 y se fue a las 12... debe ser nice ser jefe."',
    choices: [
      { text: 'Ignorar', icon: '⏭️', effects: { time: 5 }, tooltip: 'Ganas 5 minutos' },
      { text: 'Escuchar', icon: '👂', effects: { happiness: 14, stress: 8, time: -28 }, tooltip: '+14 felicidad, +8 estrés, -28 min' }
    ]
  }
];

export class ChoiceDialogSystem {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container | null = null;
  private isActive = false;
  private onChoiceCallback: ((effects: ChoiceOption['effects'], choiceText: string) => void) | null = null;
  private currentDialog: ChoiceDialog | null = null;
  private buttonContainers: Phaser.GameObjects.Container[] = [];
  private selectedIndex = 0;
  private michiNewsSprite: Phaser.GameObjects.Sprite | null = null; // Sprite visual de Michi News

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    console.log('[ChoiceDialogSystem] Sistema inicializado');
  }

  /**
   * Muestra un diálogo de Michi News con opciones de elección
   */
  show(onChoice: (effects: ChoiceOption['effects'], choiceText: string) => void): boolean {
    console.log('[ChoiceDialogSystem] Intentando mostrar diálogo');
    
    if (this.isActive) {
      console.warn('[ChoiceDialogSystem] Ya hay un diálogo activo, abortando');
      return false;
    }

    this.onChoiceCallback = onChoice;
    this.isActive = true;
    this.selectedIndex = 0;

    // Seleccionar diálogo aleatorio
    const dialogTemplate = MICHINEWS_DIALOGUES[Math.floor(Math.random() * MICHINEWS_DIALOGUES.length)];
    this.currentDialog = {
      id: `michinews-${Date.now()}`,
      ...dialogTemplate
    };

    console.log('[ChoiceDialogSystem] Diálogo seleccionado:', this.currentDialog.dialogue);

    this.createUI();
    this.createMichiNewsSprite();
    return true;
  }

  private createUI(): void {
    if (!this.currentDialog) return;

    // Posición centrada para el modal
    const centerX = 200; // Viewport con zoom 2x
    const centerY = 150;

    this.container = this.scene.add.container(centerX, centerY);
    this.container.setScrollFactor(0);
    this.container.setDepth(2000);

    // Fondo oscuro semi-transparente (overlay)
    const overlay = this.scene.add.rectangle(0, 0, 400, 300, 0x000000, 0.7);
    
    // Panel principal
    const panel = this.scene.add.rectangle(0, -20, 180, 100, 0x1a1a3e, 0.98);
    panel.setStrokeStyle(2, 0xCC66FF); // Color de Michi News

    // Icono del personaje
    const characterIcon = this.scene.add.text(-70, -55, this.currentDialog.character.icon, { 
      fontSize: '14px' 
    });

    // Nombre del personaje
    const characterName = this.scene.add.text(-50, -52, this.currentDialog.character.name, {
      fontSize: '8px',
      color: this.currentDialog.character.color,
      fontStyle: 'bold'
    });

    // Diálogo
    const dialogueText = this.scene.add.text(-75, -35, this.currentDialog.dialogue, {
      fontSize: '6px',
      color: '#FFFFFF',
      wordWrap: { width: 150 },
      align: 'left'
    });

    // Instrucción
    const instruction = this.scene.add.text(0, 5, '¿Qué haces?', {
      fontSize: '7px',
      color: '#AAAAAA',
      fontStyle: 'bold'
    });
    instruction.setOrigin(0.5, 0);

    this.container.add([overlay, panel, characterIcon, characterName, dialogueText, instruction]);

    // Crear botones de elección
    this.createChoiceButtons();

    // Entrada con animación
    this.container.setAlpha(0);
    this.container.setScale(0.8);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });

    // Habilitar input de teclado
    this.enableKeyboardNavigation();
  }

  private createChoiceButtons(): void {
    if (!this.currentDialog || !this.container) return;

    this.buttonContainers = [];

    this.currentDialog.choices.forEach((choice, index) => {
      const buttonY = 28 + (index * 22);
      const buttonContainer = this.scene.add.container(0, buttonY);
      buttonContainer.setScrollFactor(0);
      
      // Fondo del botón
      const buttonBg = this.scene.add.rectangle(0, 0, 140, 18, 0x2a2a4e, 1);
      buttonBg.setStrokeStyle(1, index === 0 ? 0x66FF66 : 0x6666FF);

      // Icono
      const icon = this.scene.add.text(-60, -4, choice.icon, { fontSize: '10px' });

      // Texto de la acción
      const text = this.scene.add.text(-45, -4, choice.text, {
        fontSize: '7px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      });

      // Efectos
      const effectsText = this.getEffectsText(choice.effects);
      const effectsLabel = this.scene.add.text(50, -4, effectsText, {
        fontSize: '6px',
        color: choice.effects.time && choice.effects.time > 0 ? '#66FF66' : '#FF6666'
      });
      effectsLabel.setOrigin(1, 0);

      // Tooltip si existe
      if (choice.tooltip) {
        const tooltip = this.scene.add.text(0, 8, choice.tooltip, {
          fontSize: '5px',
          color: '#888888'
        });
        tooltip.setOrigin(0.5, 0);
        buttonContainer.add([buttonBg, icon, text, effectsLabel, tooltip]);
      } else {
        buttonContainer.add([buttonBg, icon, text, effectsLabel]);
      }

      // Hacer interactivo
      buttonBg.setInteractive({ useHandCursor: true });
      
      buttonBg.on('pointerover', () => {
        this.selectButton(index);
        buttonBg.setFillStyle(0x3a3a5e);
      });
      
      buttonBg.on('pointerout', () => {
        buttonBg.setFillStyle(0x2a2a4e);
      });
      
      buttonBg.on('pointerdown', () => {
        this.makeChoice(index);
      });

      this.buttonContainers.push(buttonContainer);
      this.container!.add(buttonContainer);
    });

    // Seleccionar el primer botón por defecto
    this.selectButton(0);
  }

  private selectButton(index: number): void {
    if (index < 0 || index >= this.buttonContainers.length) return;
    
    this.selectedIndex = index;

    // Actualizar estilo visual de los botones
    this.buttonContainers.forEach((btnContainer, i) => {
      const bg = btnContainer.getAt(0) as Phaser.GameObjects.Rectangle;
      if (bg) {
        bg.setStrokeStyle(2, i === index ? 0xFFFFFF : (i === 0 ? 0x66FF66 : 0x6666FF));
      }
    });
  }

  private enableKeyboardNavigation(): void {
    // Escuchar teclas
    const upKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const enterKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const spaceKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const escKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Navegación con flechas
    upKey.on('down', () => {
      const newIndex = (this.selectedIndex - 1 + this.buttonContainers.length) % this.buttonContainers.length;
      this.selectButton(newIndex);
    });

    downKey.on('down', () => {
      const newIndex = (this.selectedIndex + 1) % this.buttonContainers.length;
      this.selectButton(newIndex);
    });

    // Confirmar con Enter o Espacio
    enterKey.on('down', () => this.makeChoice(this.selectedIndex));
    spaceKey.on('down', () => this.makeChoice(this.selectedIndex));

    // Ignorar con ESC (equivale a la primera opción)
    escKey.on('down', () => this.makeChoice(0));
  }

  private makeChoice(index: number): void {
    if (!this.currentDialog || !this.onChoiceCallback) return;

    const choice = this.currentDialog.choices[index];
    
    // Llamar callback con los efectos
    this.onChoiceCallback(choice.effects, choice.text);

    // Cerrar el diálogo
    this.hide();
  }

  private getEffectsText(effects: ChoiceOption['effects']): string {
    const parts: string[] = [];
    
    if (effects.time !== undefined) {
      if (effects.time > 0) {
        parts.push(`+${effects.time}min`);
      } else {
        parts.push(`${effects.time}min`);
      }
    }
    if (effects.happiness !== undefined) {
      parts.push(`+${effects.happiness}😻`);
    }
    if (effects.stress !== undefined) {
      parts.push(`+${effects.stress}😰`);
    }

    return parts.join(' ');
  }

  private hide(): void {
    console.log('[ChoiceDialogSystem] Ocultando diálogo');
    
    if (this.container) {
      this.scene.tweens.add({
        targets: this.container,
        alpha: 0,
        scale: 0.8,
        duration: 150,
        onComplete: () => {
          this.container?.destroy();
          this.container = null;
          this.buttonContainers = [];
          console.log('[ChoiceDialogSystem] Container destruido');
        }
      });
    }

    // Ocultar sprite de Michi News
    if (this.michiNewsSprite) {
      this.scene.tweens.add({
        targets: this.michiNewsSprite,
        alpha: 0,
        scale: 0.1,
        duration: 200,
        onComplete: () => {
          this.michiNewsSprite?.destroy();
          this.michiNewsSprite = null;
          console.log('[ChoiceDialogSystem] Sprite de Michi News destruido');
        }
      });
    }

    // NO resetear todas las teclas - eso rompe los controles de movimiento
    // Solo los listeners del diálogo se eliminan automáticamente cuando se destruye el container

    this.isActive = false;
    this.currentDialog = null;
    console.log('[ChoiceDialogSystem] Diálogo cerrado, isActive=false');
  }

  /**
   * Verifica si hay un diálogo activo
   */
  isDialogActive(): boolean {
    return this.isActive;
  }

  /**
   * Fuerza el cierre del diálogo
   */
  forceClose(): void {
    if (this.isActive) {
      this.hide();
    }
  }

  /**
   * Crea el sprite visual de Michi News que aparece al lado del diálogo
   */
  private createMichiNewsSprite(): void {
    console.log('[ChoiceDialogSystem] Intentando crear sprite de Michi News');
    
    // Verificar que el texture exista
    if (!this.scene.textures.exists('michi-news')) {
      console.error('[ChoiceDialogSystem] Texture "michi-news" no existe. Debe cargarse en preload()');
      return;
    }

    console.log('[ChoiceDialogSystem] Texture encontrada, creando sprite');

    // Posición a la izquierda del diálogo
    const x = 80;
    const y = 150;

    this.michiNewsSprite = this.scene.add.sprite(x, y, 'michi-news');
    this.michiNewsSprite.setScale(0.15); // Ajustar escala
    this.michiNewsSprite.setScrollFactor(0);
    this.michiNewsSprite.setDepth(1999); // Justo debajo del diálogo
    this.michiNewsSprite.setAlpha(0);

    // Animación de entrada
    this.scene.tweens.add({
      targets: this.michiNewsSprite,
      alpha: 1,
      scale: 0.2,
      duration: 300,
      ease: 'Back.easeOut'
    });

    console.log('[ChoiceDialogSystem] Sprite de Michi News creado exitosamente');
  }
}
