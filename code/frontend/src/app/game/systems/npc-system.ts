import * as Phaser from 'phaser';

/**
 * Sistema de NPCs (personajes secundarios).
 * Michi QA, Becatín y Michi News aparecen periódicamente y ofrecen interacciones.
 */

export interface NpcDialogue {
  text: string;
  effect: NpcEffect;
}

export interface NpcEffect {
  type: 'time' | 'stress' | 'focus' | 'energy' | 'happiness' | 'tickets' | 'break';
  value: number;
}

export interface NpcConfig {
  id: string;
  name: string;
  color: string;
  icon: string;
  dialogues: NpcDialogue[];
}

const NPC_CONFIGS: NpcConfig[] = [
  {
    id: 'michi-qa',
    name: 'Michi Testings',
    color: '#44CCAA',
    icon: '🐱🔍',
    dialogues: [
      { text: '"Solo encontré un detalle..." (abre lista de 47 bugs)', effect: { type: 'tickets', value: 5 } },
      { text: '"Es un caso muy específico."', effect: { type: 'stress', value: 8 } },
      { text: '"Solo pasa cuando haces doble clic + Shift + desconectas WiFi."', effect: { type: 'stress', value: 12 } },
      { text: '"No es bug... es comportamiento esperado."', effect: { type: 'focus', value: -10 } },
      { text: '"Necesito que lo revises, hay un detallito."', effect: { type: 'time', value: -15 } },
      { text: '"Aprobado! ...espera, encontré otro."', effect: { type: 'stress', value: 15 } },
      { text: '"El happy path funciona, pero..."', effect: { type: 'tickets', value: 3 } },
    ]
  },
  {
    id: 'becatin',
    name: 'Becatín',
    color: '#FFAA44',
    icon: '🐱💫',
    dialogues: [
      { text: '"¿Qué es un merge?"', effect: { type: 'time', value: -10 } },
      { text: '"Ya hice push directamente a main."', effect: { type: 'stress', value: 20 } },
      { text: '"Borré la base pero ya la estoy restaurando."', effect: { type: 'stress', value: 25 } },
      { text: '"Pensé que era de pruebas."', effect: { type: 'stress', value: 15 } },
      { text: '"¿Me ayudas? No entiendo este error."', effect: { type: 'time', value: -20 } },
      { text: '"¡Ya lo arreglé!" (rompió otra cosa)', effect: { type: 'tickets', value: 2 } },
      { text: '"Hice un script que automatiza todo." (no funciona)', effect: { type: 'focus', value: -15 } },
    ]
  },
  {
    id: 'michi-news',
    name: 'Michi News',
    color: '#CC66FF',
    icon: '🐱📰',
    dialogues: [
      { text: '"Dicen que RH anda buscando..."', effect: { type: 'stress', value: 5 } },
      { text: '"¿Ya viste quién renunció?"', effect: { type: 'focus', value: -10 } },
      { text: '"¿Ya supiste lo del aumento?"', effect: { type: 'happiness', value: 10 } },
      { text: '"Ven tantito..." (30 min después)', effect: { type: 'time', value: -30 } },
      { text: '"Oye, ¿sabías que van a meter IA?"', effect: { type: 'stress', value: 8 } },
      { text: '"El de sistemas se fue a las 3."', effect: { type: 'happiness', value: 5 } },
      { text: '"Dicen que van a quitar home office."', effect: { type: 'stress', value: 12 } },
    ]
  }
];

export class NpcSystem {
  private scene: Phaser.Scene;
  private activeNpc: NpcConfig | null = null;
  private npcContainer: Phaser.GameObjects.Container | null = null;
  private timer: Phaser.Time.TimerEvent | null = null;
  private onEffectCallback: ((effect: NpcEffect, npcId: string) => void) | null = null;
  private cooldown = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  start(onEffect: (effect: NpcEffect, npcId: string) => void): void {
    this.onEffectCallback = onEffect;
    this.scheduleNext();
  }

  stop(): void {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }
  }

  private scheduleNext(): void {
    // Aparece cada 20-40 segundos
    const delay = 20000 + Math.random() * 20000;
    this.timer = this.scene.time.delayedCall(delay, () => {
      if (!this.cooldown) {
        this.spawnRandomNpc();
      }
      this.scheduleNext();
    });
  }

  private spawnRandomNpc(): void {
    const npc = NPC_CONFIGS[Math.floor(Math.random() * NPC_CONFIGS.length)];
    const dialogue = npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
    this.activeNpc = npc;

    this.showNpcDialogue(npc, dialogue);
  }

  private showNpcDialogue(npc: NpcConfig, dialogue: NpcDialogue): void {
    this.cooldown = true;
    const cam = this.scene.cameras.main;
    const x = cam.scrollX + cam.width / 2;
    const y = cam.scrollY + cam.height - 60;

    this.npcContainer = this.scene.add.container(x, y + 100);
    this.npcContainer.setDepth(1500);
    this.npcContainer.setScrollFactor(0);

    // Fondo
    const bg = this.scene.add.rectangle(0, 0, 320, 70, 0x1a1a3e, 0.95);
    bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(npc.color).color);

    // Icono y nombre
    const icon = this.scene.add.text(-145, -25, npc.icon, { fontSize: '16px' });
    const name = this.scene.add.text(-115, -25, npc.name, {
      fontSize: '10px',
      color: npc.color,
      fontStyle: 'bold'
    });

    // Diálogo
    const text = this.scene.add.text(-145, -5, dialogue.text, {
      fontSize: '9px',
      color: '#CCCCCC',
      wordWrap: { width: 280 }
    });

    // Efecto
    const effectText = this.getEffectText(dialogue.effect);
    const effectLabel = this.scene.add.text(-145, 20, effectText, {
      fontSize: '8px',
      color: dialogue.effect.value > 0 ? '#FF6666' : '#66FF66'
    });

    this.npcContainer.add([bg, icon, name, text, effectLabel]);

    // Entrada
    this.scene.tweens.add({
      targets: this.npcContainer,
      y: y,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Aplicar efecto y desaparecer
    this.scene.time.delayedCall(3500, () => {
      if (this.onEffectCallback) {
        this.onEffectCallback(dialogue.effect, npc.id);
      }

      this.scene.tweens.add({
        targets: this.npcContainer,
        y: y + 100,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          this.npcContainer?.destroy();
          this.npcContainer = null;
          this.activeNpc = null;
          this.cooldown = false;
        }
      });
    });
  }

  private getEffectText(effect: NpcEffect): string {
    const signs = effect.value > 0 ? '+' : '';
    switch (effect.type) {
      case 'stress': return `${signs}${effect.value} estrés`;
      case 'focus': return `${signs}${effect.value} concentración`;
      case 'energy': return `${signs}${effect.value} energía`;
      case 'time': return `${signs}${effect.value} min`;
      case 'happiness': return `${signs}${effect.value} felicidad`;
      case 'tickets': return `+${effect.value} tickets nuevos`;
      case 'break': return 'Rompe algo...';
      default: return '';
    }
  }
}
