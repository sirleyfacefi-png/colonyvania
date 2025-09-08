// src/main.js
import { VIEW_W, VIEW_H } from './config.js';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: VIEW_W,
  height: VIEW_H,
  backgroundColor: '#0a0f1a',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1100 }, debug: false }
  },
  scene: [BootScene, GameScene]
};

new Phaser.Game(config);
