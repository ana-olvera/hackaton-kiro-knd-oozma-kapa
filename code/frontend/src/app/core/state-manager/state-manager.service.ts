import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameState {
  energy: number;
  coffee: number;
  hunger: number;
  sleep: number;
  focus: number;
  stress: number;
  karenometer: number;
  currentTime: number; // minutos desde las 9:00 (0 = 9AM, 540 = 6PM)
  level: number;
  score: number;
}

const INITIAL_STATE: GameState = {
  energy: 80,
  coffee: 50,
  hunger: 30,
  sleep: 20,
  focus: 70,
  stress: 10,
  karenometer: 0,
  currentTime: 0,
  level: 1,
  score: 0
};

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  private state$ = new BehaviorSubject<GameState>({ ...INITIAL_STATE });

  getState() {
    return this.state$.asObservable();
  }

  getCurrentState(): GameState {
    return this.state$.getValue();
  }

  updateState(partial: Partial<GameState>): void {
    const current = this.state$.getValue();
    this.state$.next({ ...current, ...partial });
  }

  resetState(): void {
    this.state$.next({ ...INITIAL_STATE });
  }
}
