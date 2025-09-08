// src/scenes/GameScene.js
import { LEVEL_W, LEVEL_H } from '../config.js';
import Player from '../objects/Player.js';
import Enemy from '../objects/Enemy.js';
import HUD from '../ui/HUD.js';

export default class GameScene extends Phaser.Scene {
  constructor(){ super('Game'); this.levelW = LEVEL_W; this.levelH = LEVEL_H; }

  create(){
    // mundo/câmera
    this.cameras.main.setBounds(0,0,this.levelW,this.levelH);
    const stars = this.add.particles(0, 0, 'hitbox', {
      x: { min: 0, max: this.levelW },
      y: { min: 0, max: this.levelH },
      quantity: 2, speed: 0, lifespan: 120000,
      scale: { start: 0.25, end: 0.25 }, tint: 0x1a2a49, alpha: 0.12
    }); stars.setScrollFactor(0.15);

    // plataformas
    this.platforms = this.physics.add.staticGroup();
    const plat = (x,y,scaleX=1,key='platform') => {
      const p = this.platforms.create(x,y,key).setOrigin(0,0).setScale(scaleX,1);
      p.refreshBody(); return p;
    };
    // início generoso
    plat(0, 600, 5);
    plat(300, 580, 2);
    plat(520, 590, 2, 'stone');
    plat(740, 585, 2);
    plat(950, 575, 2, 'stone');
    // sequência
    plat(1150, 540, 3);
    plat(1450, 620, 5, 'stone');
    plat(1950, 560, 4);
    plat(2400, 500, 3, 'stone');
    plat(2750, 620, 6);
    // ledges
    plat(900, 460, 1);
    plat(1200, 440, 1);
    plat(2100, 480, 1);
    plat(2550, 430, 1);

    // espinhos
    this.hazards = this.physics.add.staticGroup();
    const spikes = (x,y)=>{ const s = this.hazards.create(x,y,'spike').setOrigin(0,1); s.refreshBody(); return s; };
    spikes(1520, 620); spikes(1550, 620); spikes(1580, 620); spikes(2300, 560);

    // players
    this.players = this.add.group();
    const p1 = new Player(this, 120, 200, 'ant1', { left:'A', right:'D', up:'W', attack:'F' });
    const p2 = new Player(this, 160, 200, 'ant2', { left:'LEFT', right:'RIGHT', up:'UP', attack:'SLASH' });
    this.players.addMultiple([p1,p2]); p1.postCreate(); p2.postCreate();

    // inimigos
    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this, 800, 560));
    this.enemies.add(new Enemy(this, 1350, 500));
    this.enemies.add(new Enemy(this, 2200, 520));

    // colisões
    this.physics.add.collider(this.players, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.players, this.hazards, (pl)=> pl.takeDamage(1));
    this.physics.add.overlap(this.players, this.enemies, (pl, en)=>{
      if(pl._invuln && pl._invuln > performance.now()) return;
      pl.takeDamage(1);
      const kb = 220 * (pl.x < en.x ? -1 : 1);
      pl.setVelocityX(kb); pl.setVelocityY(-220);
    });

    // câmera no ponto médio
    this.cameraTarget = this.add.rectangle(200,200,2,2,0xffffff,0);
    this.cameras.main.startFollow(this.cameraTarget, true, 0.1, 0.1);

    // HUD
    this.hud = new HUD(this);

    // reset
    this.input.keyboard.on('keydown-R', () => this.scene.restart());
  }

  preUpdate(time, delta){
    // atualizar ponto médio para câmera
    if(this.players.getLength() >= 2){
      const [a,b] = this.players.getChildren();
      const mx = (a.x + b.x)/2, my = (a.y + b.y)/2;
      this.cameraTarget.x = Phaser.Math.Clamp(mx, this.cameras.main.width/2, this.levelW - this.cameras.main.width/2);
      this.cameraTarget.y = Phaser.Math.Clamp(my, this.cameras.main.height/2, this.levelH - this.cameras.main.height/2);
    }
  }

  update(time, delta){
    this.hud.update();
  }
}
