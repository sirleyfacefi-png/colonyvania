// src/objects/Enemy.js
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y){
    super(scene, x, y, 'stone');
    scene.add.existing(this); scene.physics.add.existing(this);
    this.setScale(0.6);
    this.body.setSize(28,18).setOffset(2,6);
    this.setBounce(0.05);
    this.speed = 70 + Math.random()*30;
    this.dir = Math.random() > 0.5 ? 1 : -1;
    this.maxHealth = 3; this.health = 3;
  }
  takeDamage(n=1){
    this.health = Math.max(0, this.health - n);
    this.setTint(0xffc7c7);
    this.scene.time.delayedCall(100, ()=> this.clearTint());
  }
  preUpdate(time, delta){
    super.preUpdate(time, delta);
    this.setVelocityX(this.dir * this.speed);
    if(this.body.blocked.left || this.body.blocked.right) this.dir *= -1;
    if(this.health <= 0) this.destroy();
  }
}
