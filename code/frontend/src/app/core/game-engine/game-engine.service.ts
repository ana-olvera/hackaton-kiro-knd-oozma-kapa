import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { OfficeScene } from '../../game/scenes/office.scene';
import { MenuScene } from '../../game/scenes/menu.scene';

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
      scene: [MenuScene, OfficeScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
