// src/scenes/BootScene.js
// Usa o Phaser global (window.Phaser)
import { redDotBase64 } from '../assets/redDot.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    // Texturas simples geradas via Graphics/Data (sem assets externos)
    this.textures.generate('platform', { data: [
      '7777777777777777',
      '6999999999999996',
      '6999999999999996',
      '7777777777777777'
    ], pixelWidth: 2, palette: { '6': '#32466e', '7': '#1b2947', '9':'#446097' }});

    this.textures.generate('stone', { data: [
      '3333333333333333',
      '3555555555555553',
      '3577777777777753',
      '3555555555555553',
      '3333333333333333'
    ], pixelWidth: 2, palette: { '3':'#1a2439', '5':'#263556', '7':'#33466e'}});

    this.textures.generate('spike', { data: [
      '....3....',
      '...333...',
      '..33333..',
      '.3333333.',
      '333333333'
    ], pixelWidth: 3, palette: { '3':'#7b1e2b' }});

    // hitbox ataque
    const g = this.make.graphics({x:0,y:0, add:false});
    g.fillStyle(0xcde1ff,0.8); g.fillRoundedRect(0,0,36,16,4);
    g.generateTexture('hitbox', 36, 16);

    // sprite incorporado em Base64 para o "red-dot" e fallback gerado para o segundo jogador
    this.load.image('red-dot', redDotBase64);
    this.createAntTexture('ant2', 0xffc38f, false);
  }

  createAntTexture(key, bodyColor, emo=false){
    const g = this.make.graphics({x:0,y:0, add:false});
    g.fillStyle(bodyColor, 1);
    // segmentos
    g.fillEllipse(20, 18, 22, 18);
    g.fillEllipse(40, 22, 22, 18);
    g.fillEllipse(60, 26, 24, 20);
    // cabeça
    g.fillEllipse(18, 10, 18, 14);
    // olhos
    g.fillStyle(0xffffff,1); g.fillCircle(14,10,3); g.fillCircle(20,10,3);
    g.fillStyle(0x0,1); g.fillCircle(14,10,1.5); g.fillCircle(20,10,1.5);
    // pernas
    g.lineStyle(3, bodyColor, 1);
    g.beginPath(); g.moveTo(26,26); g.lineTo(18,34); g.strokePath();
    g.beginPath(); g.moveTo(42,30); g.lineTo(36,38); g.strokePath();
    g.beginPath(); g.moveTo(58,34); g.lineTo(52,42); g.strokePath();
    // antenas (segmentos)
    g.lineStyle(3, bodyColor, 1);
    g.beginPath(); g.moveTo(10,2); g.lineTo(8,0); g.lineTo(6,-1); g.lineTo(4,0); g.strokePath();
    g.beginPath(); g.moveTo(22,2); g.lineTo(24,0); g.lineTo(26,-1); g.lineTo(28,0); g.strokePath();
    if(emo){
      g.fillStyle(0xff3b57,1);
      g.fillTriangle(6,3, 18,2, 10,14);
      g.fillTriangle(10,0, 24,2, 15,10);
    }
    g.generateTexture(key, 70, 50);
  }

  create() {
    this.scene.start('Game');
  }
}
