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
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    
    .game-container {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #1a1a2e;
      position: relative;
      touch-action: none; /* Previene zoom y scroll en móviles */
      -webkit-touch-callout: none; /* Deshabilita menú contextual en iOS */
      -webkit-user-select: none; /* Previene selección de texto */
      user-select: none;
    }

    /* Optimizaciones para PWA en móviles */
    @media (max-width: 768px) {
      :host {
        /* Usa toda la altura de la viewport en móviles */
        height: 100dvh; /* dvh = dynamic viewport height, mejor para móviles */
      }
      
      .game-container {
        height: 100dvh;
      }
    }

    /* Ocultar scrollbars en todos los navegadores */
    :host::-webkit-scrollbar {
      display: none;
    }
    :host {
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
