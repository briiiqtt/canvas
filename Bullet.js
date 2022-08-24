export class Bullet {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
    setTimeout(() => {
      ctx.strokeStyle = '#f8f9fa';
      ctx.moveTo(this.startX, this.startY);
      ctx.lineTo(this.endX, this.endY);
      ctx.stroke();
      ctx.strokeStyle = 'black';
    }, 100);
  }
}
