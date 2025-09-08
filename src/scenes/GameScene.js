// src/scenes/GameScene.js
import { LEVEL_W, LEVEL_H } from '../config.js';
import Player from '../objects/Player.js';
import Enemy from '../objects/Enemy.js';
import HUD from '../ui/HUD.js';
import { connect } from '../network.js';

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

    // inimigos
    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this, 800, 560));
    this.enemies.add(new Enemy(this, 1350, 500));
    this.enemies.add(new Enemy(this, 2200, 520));

    // networking
    const room = prompt('ID da sala:');
    this.socket = connect(room);
    this.waitText = this.add.text(16,16,'Aguardando outro jogador...');
    this.socket.on('start', () => {
      this.waitText.destroy();
      this.spawnPlayers();
    });
    this.socket.on('state', ({id,state}) => {
      if(id !== this.socket.id && this.otherPlayer){
        this.otherPlayer.setPosition(state.x, state.y);
        if(state.flipX !== undefined) this.otherPlayer.setFlipX(state.flipX);
      }
    });
    this.socket.on('end', () => {
      this.scene.restart();
    });

    // reset
    this.input.keyboard.on('keydown-R', () => this.scene.restart());
  }

  spawnPlayers(){
    this.players = this.add.group();

    this.player = new Player(this, 120, 200, 'red-dot', { left:'A', right:'D', up:'W', attack:'F' });
    this.player.postCreate();
    this.players.add(this.player);

    this.otherPlayer = this.add.sprite(160,200,'ant2');
    this.physics.add.existing(this.otherPlayer);
    this.otherPlayer.body.allowGravity = false;
    this.players.add(this.otherPlayer);

    // colisões
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.otherPlayer, this.platforms);
    this.physics.add.collider(this.player, this.hazards, (pl)=> pl.takeDamage(1));
    this.physics.add.overlap(this.player, this.enemies, (pl, en)=>{
      if(pl._invuln && pl._invuln > performance.now()) return;
      pl.takeDamage(1);
      const kb = 220 * (pl.x < en.x ? -1 : 1);
      pl.setVelocityX(kb); pl.setVelocityY(-220);
    });

    // HUD
    this.hud = new HUD(this);

    // câmera no jogador local
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  }

  update(time, delta){
    if(this.player){
      this.hud.update();
      this.socket.emit('state', { x: this.player.x, y: this.player.y, flipX: this.player.flipX });
    }
  }
}
