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

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
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
      }
    };

    this.game = new Phaser.Game(config);
  }

  destroy(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
