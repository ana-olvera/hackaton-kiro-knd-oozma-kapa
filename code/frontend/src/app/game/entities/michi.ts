/**
 * Entidad del personaje principal: Michi Godín
 * Se expandirá cuando se tengan sprites y animaciones.
 */
export interface MichiState {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  currentSkin: string;
}

export const DEFAULT_MICHI_STATE: MichiState = {
  x: 400,
  y: 300,
  direction: 'down',
  isMoving: false,
  currentSkin: 'default'
};
