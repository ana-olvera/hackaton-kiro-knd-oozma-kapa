import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { GameEngineService } from '../core/game-engine/game-engine.service';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div #gameContainer class="game-container"></div>
  `,
  styles: [`
    .game-container {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #1a1a2e;
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
