import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { GameEngineService } from '../core/game-engine/game-engine.service';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div #gameContainer class="game-container"></div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      height: 100dvh; /* Dynamic viewport height para móviles */
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
      touch-action: none; /* Previene zoom y scroll en móviles */
      -webkit-touch-callout: none; /* Deshabilita menú contextual en iOS */
      -webkit-user-select: none; /* Previene selección de texto */
      user-select: none;
      margin: 0;
      padding: 0;
    }

    /* Canvas de Phaser ocupa todo el espacio */
    .game-container canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
      max-width: 100%;
      max-height: 100%;
      margin: 0;
      padding: 0;
    }

    /* Optimizaciones para PWA en móviles */
    @media (max-width: 768px) {
      :host {
        /* Usa toda la altura de la viewport en móviles */
        height: 100dvh !important; /* dvh = dynamic viewport height, mejor para móviles */
      }
      
      .game-container {
        height: 100dvh !important;
      }
    }

    /* Ocultar scrollbars en todos los navegadores */
    :host::-webkit-scrollbar,
    .game-container::-webkit-scrollbar {
      display: none;
    }
    :host,
    .game-container {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  constructor(private gameEngine: GameEngineService) {}

  ngOnInit(): void {
    this.gameEngine.initialize(this.gameContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.gameEngine.destroy();
  }
}
