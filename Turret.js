export class Turret {
  constructor(playerNum, type, x, y) {
    this.playerNum = playerNum;
    this.type = type;
    this.x = x * 60 + 130;
    this.y = y * 60 + 50;
    this.drawX = x * 60 + 110;
    this.drawY = y * 60 + 30;
    this.range = 120;
    this.attackPower = 5;
    this.isCoolingDown = false;
    this.attackInterval = 1000;
  }

  draw(ctx) {
    ctx.fillStyle = this.playerNum === 1 ? 'lightblue' : 'pink';
    // ctx.fillRect(this.drawX, this.drawY, 40, 40);
    ctx.fillRect(this.drawX, this.drawY, 40, 40);
  }
}
