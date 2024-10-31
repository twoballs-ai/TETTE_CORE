// HUD.js
export class HUD {
    constructor(player) {
      this.player = player;
    }
  
    render(context) {
      context.save();
      context.fillStyle = 'white';
      context.font = '20px Arial';
  
      // Отображение здоровья
      context.fillText(`Health: ${this.player.health}`, 20, 30);
  
      // Отображение очков
      context.fillText(`Score: ${this.player.score}`, 20, 60);
  
      // Отображение магии
      context.fillText(`Magic: ${this.player.magic}`, 20, 90);
  
      // Отображение выстрелов
      context.fillText(`Shots: ${this.player.shots}`, 20, 120);
  
      context.restore();
    }
  }
  