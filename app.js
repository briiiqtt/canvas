import { Bullet } from './bullet.js';
import { Minion } from './Minion.js';
import { Turret } from './Turret.js';

export class App {
  constructor() {
    // setInterval(() => {
    //   let first = this.tick;
    //   let second = null;
    //   setTimeout(() => {
    //     second = this.tick;
    //     this.latency = (first - second) / 10;
    //   }, 1000);
    // }, 1000);
    //
    this.grid = {};
    this.tick = 100;
    this.isGameReady = false;
    this.minionRushing = false;
    this.nextMinionLane = 'middle';
    //

    //
    this.playerNum = null;
    this.player1 = {
      playerNum: 1,
      minionProp: { health: 10, speed: 2, count: 3 },
      minions: [],
      turrets: [],
    };
    this.player2 = {
      playerNum: 2,
      minionProp: { health: 10, speed: 2, count: 3 },
      minions: [],
      turrets: [],
    };
    //

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    // this.gridCtx = document.getElementById('grid').getContext('2d');
    // this.gridCtx.globalAlpha = 0.2;

    document.body.appendChild(this.canvas);

    this.canvas.addEventListener('click', (e) => this.gridClicked(e));

    window.requestAnimationFrame(this.animate.bind(this));
  }

  gridClicked(e) {
    const posX = e.clientX - this.ctx.canvas.offsetLeft - 100;
    const posY = e.clientY - this.ctx.canvas.offsetTop - 20;
    if (posX < 0 || posX > 600 || posY < 0 || posY > 360) return;
    const x = Math.floor(posX / 60);
    const y = Math.floor(posY / 60);
    console.log('x', x, 'y', y);
    //
    //
    this.grid[`x${x}y${y}`] = 'clicked';
    //   console.log(this.grid);
    //
    //
    //
    //터렛 설치 로직
    socket.emit('turretDeployed', {
      playerNum: this.playerNum,
      type: '********type',
      x,
      y,
    });
  }

  animate() {
    // console.log('animate');
    //
    this.turretAttack();
    //
    this.drawGrid();
    this.drawTicks();
    this.drawMinions();
    this.drawTurrets();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  drawTicks() {
    document.getElementById('tick').innerHTML = this.tick;
    if (this.isGameReady) {
      this.tick--;
      if (this.tick < 1) {
        this.tick = 800;
        console.log('wavestart');
        this.waveStart();
      }
    }
  }

  turretAttack() {
    function attack(turrets, minions, ctx) {
      for (let turret of turrets) {
        for (let minion of minions) {
          if (
            minion.x > turret.x - turret.range &&
            minion.x < turret.x + turret.range &&
            minion.y > turret.y - turret.range &&
            minion.y < turret.y + turret.range
          ) {
            if (turret.isCoolingDown) return;
            new Bullet(turret.x, turret.y, minion.x, minion.y).draw(ctx);
            minion.health = minion.health - turret.attackPower;
            turret.isCoolingDown = true;
            console.log(turret);
            console.log(minions);
            setTimeout(() => {
              turret.isCoolingDown = false;
            }, turret.attackInterval);
          }
        }
      }
    }
    attack(this.player1.turrets, this.player2.minions, this.ctx);
    attack(this.player2.turrets, this.player1.minions, this.ctx);
  }

  drawMinions() {
    //
    this.player1.minions = this.player1.minions.filter(
      (minion) => minion.x < 700 && minion.health > 0
    );
    this.player2.minions = this.player2.minions.filter(
      (minion) => minion.x > 100 && minion.health > 0
    );
    //
    if (this.minionRushing) {
      async function go(minions, ctx) {
        for (let minion of minions) {
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              minion.draw(ctx);
              resolve();
            }, 1000);
          });
        }
      }
      go(this.player1.minions, this.ctx);
      go(this.player2.minions, this.ctx);
    }
  }

  drawTurrets() {
    for (let turret of this.player1.turrets) {
      turret.draw(this.ctx);
    }
    for (let turret of this.player2.turrets) {
      turret.draw(this.ctx);
    }
  }

  drawGrid() {
    const blockWidth = 60;
    const blockHeight = 60;

    let pointX = 100;
    let pointY = 20;

    this.ctx.beginPath();

    for (let i = 0; i < 7; i++) {
      this.ctx.moveTo(pointX, pointY);
      this.ctx.lineTo(700, pointY);
      if (i === 6) break;
      pointY += blockHeight;
    }
    for (let i = 0; i < 11; i++) {
      this.ctx.moveTo(pointX, pointY);
      this.ctx.lineTo(pointX, 20);
      pointX += blockWidth;
    }

    this.ctx.stroke();
  }

  async waveStart() {
    this.nextMinionLane =
      this.nextMinionLane === 'top'
        ? 'middle'
        : this.nextMinionLane === 'middle'
        ? 'bottom'
        : 'top';

    for (let i = 0; i < this.player1.minionProp.count; i++) {
      this.player1.minions.push(
        new Minion(
          this.player1.playerNum,
          this.nextMinionLane,
          this.player1.minionProp.health,
          this.player1.minionProp.speed,
          this.player1.minionProp.color
        )
      );
    }
    for (let i = 0; i < this.player2.minionProp.count; i++) {
      this.player2.minions.push(
        new Minion(
          this.player2.playerNum,
          this.nextMinionLane,
          this.player2.minionProp.health,
          this.player2.minionProp.speed,
          this.player2.minionProp.color
        )
      );
    }
    this.minionRushing = true;
  }
}

window.onload = () => {
  window.app = new App();
};

socket.on('turretDeployed', (data) => {
  console.log(window.app?.['player' + data.playerNum].turrets);
  window.app?.['player' + data.playerNum].turrets.push(
    new Turret(data.playerNum, data.type, data.x, data.y)
  );
});
