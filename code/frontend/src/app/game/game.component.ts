import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../core/game-engine/game-engine.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #gameContainer class="game-container"></div>

    <!-- Controles móviles HTML (siempre visibles en touch) -->
    <div class="mobile-controls" *ngIf="isTouchDevice">
      <!-- D-pad izquierda -->
      <div class="dpad">
        <button class="dpad-btn up" (pointerdown)="onDir('up', true)" (pointerup)="onDir('up', false)" (pointerleave)="onDir('up', false)">▲</button>
        <button class="dpad-btn left" (pointerdown)="onDir('left', true)" (pointerup)="onDir('left', false)" (pointerleave)="onDir('left', false)">◀</button>
        <button class="dpad-btn right" (pointerdown)="onDir('right', true)" (pointerup)="onDir('right', false)" (pointerleave)="onDir('right', false)">▶</button>
        <button class="dpad-btn down" (pointerdown)="onDir('down', true)" (pointerup)="onDir('down', false)" (pointerleave)="onDir('down', false)">▼</button>
      </div>

      <!-- Botón interacción derecha -->
      <button class="interact-btn" (pointerdown)="onInteract(true)" (pointerup)="onInteract(false)" (pointerleave)="onInteract(false)">E</button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .game-container {
      width: 100%;
      height: 100%;
      display: block;
      background-color: #1a1a2e;
      position: relative;
      touch-action: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    .game-container canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }

    /* === CONTROLES MÓVILES === */
    .mobile-controls {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 9999;
    }

    .mobile-controls button {
      pointer-events: all;
      border: none;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    /* D-pad */
    .dpad {
      position: absolute;
      bottom: 15px;
      left: 15px;
      width: 110px;
      height: 110px;
    }

    .dpad-btn {
      position: absolute;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(51, 51, 102, 0.8);
      border: 2px solid rgba(102, 102, 204, 0.8) !important;
      color: white;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    }

    .dpad-btn:active {
      background: rgba(102, 102, 204, 0.9);
    }

    .dpad-btn.up { top: 0; left: 50%; transform: translateX(-50%); }
    .dpad-btn.down { bottom: 0; left: 50%; transform: translateX(-50%); }
    .dpad-btn.left { top: 50%; left: 0; transform: translateY(-50%); }
    .dpad-btn.right { top: 50%; right: 0; transform: translateY(-50%); }

    /* Botón interacción */
    .interact-btn {
      position: absolute;
      bottom: 30px;
      right: 15px;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: rgba(0, 170, 85, 0.85);
      border: 3px solid rgba(0, 255, 136, 0.9) !important;
      color: white;
      font-size: 20px;
      font-weight: bold;
      touch-action: none;
    }

    .interact-btn:active {
      background: rgba(0, 255, 136, 0.95);
    }

    /* SOLO mostrar en dispositivos táctiles sin mouse de precisión */
    @media (hover: hover) and (pointer: fine) {
      .mobile-controls {
        display: none !important;
      }
    }

    /* En pantallas muy pequeñas en vertical, reducir tamaño */
    @media (max-height: 500px) {
      .dpad { bottom: 5px; left: 5px; width: 90px; height: 90px; }
      .dpad-btn { width: 28px; height: 28px; font-size: 11px; }
      .interact-btn { bottom: 15px; right: 10px; width: 44px; height: 44px; font-size: 16px; }
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;
  isTouchDevice = false;

  // Input compartido con Phaser via window global
  private mobileInput = { left: false, right: false, up: false, down: false, interact: false };

  constructor(private gameEngine: GameEngineService) {}

  ngOnInit(): void {
    this.isTouchDevice = this.detectTouch();
    // Exponer input en window para que Phaser lo lea
    (window as unknown as Record<string, unknown>)['__michiMobileInput'] = this.mobileInput;
    this.gameEngine.initialize(this.gameContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.gameEngine.destroy();
    delete (window as unknown as Record<string, unknown>)['__michiMobileInput'];
  }

  onDir(dir: string, active: boolean): void {
    (this.mobileInput as unknown as Record<string, boolean>)[dir] = active;
  }

  onInteract(active: boolean): void {
    this.mobileInput.interact = active;
  }

  private detectTouch(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }
}
