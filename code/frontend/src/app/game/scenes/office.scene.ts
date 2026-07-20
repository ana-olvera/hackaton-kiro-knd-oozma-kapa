import * as Phaser from 'phaser';

export class OfficeScene extends Phaser.Scene {
  private michi!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'OfficeScene' });
  }

  preload(): void {
    // Aquí se cargarán sprites cuando estén disponibles
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fondo temporal de la oficina
    this.add.rectangle(width / 2, height / 2, width, height, 0x2d2d44);

    // Michi placeholder (rectángulo temporal hasta tener sprites)
    this.michi = this.add.rectangle(width / 2, height / 2, 32, 32, 0xff8844);

    // Controles del teclado
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Texto de debug
    this.add.text(10, 10, 'Oficina de Michi - Usa flechas para mover', {
      fontSize: '14px',
      color: '#aaaaaa'
    });
  }

  update(): void {
    const speed = 3;

    if (this.cursors.left.isDown) {
      this.michi.x -= speed;
    } else if (this.cursors.right.isDown) {
      this.michi.x += speed;
    }

    if (this.cursors.up.isDown) {
      this.michi.y -= speed;
    } else if (this.cursors.down.isDown) {
      this.michi.y += speed;
    }
  }
}
