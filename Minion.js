export class Minion {
  constructor(playerNum, lane, health, speed) {
    this.playerNum = playerNum;
    this.health = health;
    this.speed = speed;
    this.width = 20;
    this.height = 20;

    this.direction = playerNum === 1 ? 1 : -1;
    this.x = playerNum === 1 ? 120 : 660;

    if (lane === 'top') {
      //left top
      //   ctx.fillRect(120, 40, this.width, this.height);
      //right top
      //   ctx.fillRect(660, 40, this.width, this.height);

      this.y = 40;
    } else if (lane === 'middle') {
      //left mid
      //   ctx.fillRect(120, 160, this.width, this.height);
      //right mid
      //   ctx.fillRect(660, 160, this.width, this.height);

      this.y = 160;
    } else if (lane === 'bottom') {
      //left bottom
      //   ctx.fillRect(120, 280, this.width, this.height);
      //right bottom
      //   ctx.fillRect(660, 280, this.width, this.height);
      this.y = 280;
    }
  }
  draw(ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
    this.x += this.speed * this.direction;
    ctx.fillStyle = this.playerNum === 1 ? 'blue' : 'red';
    if (!(this.x > 700 || this.x < 100 || this.health <= 0))
      ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
