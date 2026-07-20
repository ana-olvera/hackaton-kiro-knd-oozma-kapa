/**
 * Sistema de skins para Michi.
 * Gestiona skins desbloqueables y la tienda.
 */

export interface MichiSkin {
  id: string;
  name: string;
  description: string;
  color: string;        // Color principal del sprite
  accentColor: string;  // Color de acento
  price: number;        // Precio en puntos
  unlocked: boolean;
  equipped: boolean;
}

const ALL_SKINS: MichiSkin[] = [
  { id: 'default', name: 'Michi Godín', description: 'El clásico. Corbata incluida.', color: '#FF8844', accentColor: '#FFAA66', price: 0, unlocked: true, equipped: true },
  { id: 'programmer', name: 'Michi Programador', description: 'Hoodie negra. Ojeras incluidas.', color: '#333333', accentColor: '#555555', price: 200, unlocked: false, equipped: false },
  { id: 'home-office', name: 'Michi Home Office', description: 'Pijama arriba, formal abajo.', color: '#6699CC', accentColor: '#88BBEE', price: 150, unlocked: false, equipped: false },
  { id: 'devops', name: 'Michi DevOps', description: '"En mi ambiente sí funciona."', color: '#44AA44', accentColor: '#66CC66', price: 300, unlocked: false, equipped: false },
  { id: 'dba', name: 'Michi DBA', description: 'No toca la BD. (Mentira).', color: '#AA4400', accentColor: '#CC6622', price: 300, unlocked: false, equipped: false },
  { id: 'java', name: 'Michi Java', description: 'AbstractSingletonProxyFactory', color: '#CC4444', accentColor: '#FF6666', price: 250, unlocked: false, equipped: false },
  { id: 'angular', name: 'Michi Angular', description: 'Todo es un componente.', color: '#DD0031', accentColor: '#FF3355', price: 250, unlocked: false, equipped: false },
  { id: 'fullstack', name: 'Michi Full Stack', description: 'Hace todo. Descansa nunca.', color: '#8844CC', accentColor: '#AA66EE', price: 400, unlocked: false, equipped: false },
  { id: 'linux', name: 'Michi Linux', description: 'btw I use Arch.', color: '#FFCC00', accentColor: '#FFDD44', price: 350, unlocked: false, equipped: false },
];

export class SkinsSystem {
  private skins: MichiSkin[] = [];
  private playerPoints = 0;

  constructor() {
    this.skins = ALL_SKINS.map(s => ({ ...s }));
    this.loadFromStorage();
  }

  getSkins(): MichiSkin[] {
    return this.skins;
  }

  getEquippedSkin(): MichiSkin {
    return this.skins.find(s => s.equipped) || this.skins[0];
  }

  getPlayerPoints(): number {
    return this.playerPoints;
  }

  addPoints(points: number): void {
    this.playerPoints += points;
    this.saveToStorage();
  }

  buySkin(skinId: string): { success: boolean; message: string } {
    const skin = this.skins.find(s => s.id === skinId);
    if (!skin) return { success: false, message: 'Skin no encontrada' };
    if (skin.unlocked) return { success: false, message: 'Ya la tienes' };
    if (this.playerPoints < skin.price) {
      return { success: false, message: `Necesitas ${skin.price - this.playerPoints} puntos más` };
    }

    this.playerPoints -= skin.price;
    skin.unlocked = true;
    this.saveToStorage();
    return { success: true, message: `¡${skin.name} desbloqueada!` };
  }

  equipSkin(skinId: string): boolean {
    const skin = this.skins.find(s => s.id === skinId);
    if (!skin || !skin.unlocked) return false;

    this.skins.forEach(s => s.equipped = false);
    skin.equipped = true;
    this.saveToStorage();
    return true;
  }

  getUnlockedCount(): number {
    return this.skins.filter(s => s.unlocked).length;
  }

  getTotalCount(): number {
    return this.skins.length;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('michi-skins', JSON.stringify(this.skins));
      localStorage.setItem('michi-points', String(this.playerPoints));
    } catch { /* silent */ }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('michi-skins');
      if (saved) {
        const parsed = JSON.parse(saved) as MichiSkin[];
        parsed.forEach(s => {
          const existing = this.skins.find(sk => sk.id === s.id);
          if (existing) {
            existing.unlocked = s.unlocked;
            existing.equipped = s.equipped;
          }
        });
      }
      const points = localStorage.getItem('michi-points');
      if (points) this.playerPoints = parseInt(points, 10);
    } catch { /* silent */ }
  }
}
