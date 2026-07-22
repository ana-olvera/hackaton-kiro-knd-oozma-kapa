import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { OfficeScene } from '../../game/scenes/office.scene';
import { MenuScene } from '../../game/scenes/menu.scene';
import { BossScene } from '../../game/scenes/boss.scene';
import { GitBasicScene } from '../../game/minigames/git-basic/git-basic.scene';
import { GitStagingScene } from '../../game/minigames/git-staging/git-staging.scene';
import { GitBranchesScene } from '../../game/minigames/git-branches/git-branches.scene';
import { GitMergeScene } from '../../game/minigames/git-merge/git-merge.scene';
import { GitConflictScene } from '../../game/minigames/git-conflict/git-conflict.scene';
import { HudScene } from '../../game/systems/hud-system';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  private game: Phaser.Game | null = null;

  initialize(parent: HTMLElement): void {
    if (this.game) {
      return;
    }

    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Obtener dimensiones reales de la pantalla
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Para móviles, usar dimensiones de la pantalla real
    const gameWidth = isMobile ? Math.min(width, 800) : 800;
    const gameHeight = isMobile ? Math.min(height, 600) : 600;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: parent,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [
        MenuScene,
        OfficeScene,
        HudScene,
        GitBasicScene,
        GitStagingScene,
        GitBranchesScene,
        GitMergeScene,
        GitConflictScene,
        BossScene
      ],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gameWidth,
        height: gameHeight,
        // Responsive: ajusta el tamaño en dispositivos pequeños
        min: {
          width: 320,
          height: 240
        },
        max: {
          width: 1920,
          height: 1080
        }
      },
      // Deshabilitar menú contextual en móviles
      disableContextMenu: true,
      // Optimizaciones para móvil
      render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
      },
      // Forzar uso completo del canvas
      backgroundColor: '#1a1a2e'
    };

    this.game = new Phaser.Game(config);
    
    // Listener para redimensionar cuando cambia la orientación
    if (isMobile) {
      window.addEventListener('resize', () => {
        if (this.game) {
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;
          this.game.scale.resize(newWidth, newHeight);
        }
      });
      
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          if (this.game) {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            this.game.scale.resize(newWidth, newHeight);
          }
        }, 100);
      });
    }
  }

  destroy(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
