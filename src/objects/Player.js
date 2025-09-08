// src/objects/Player.js
import { MOVE_SPEED, JUMP_VEL, COYOTE_MS, DOUBLE_SCALE } from '../config.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, controls) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0.05);
    this.body.setSize(36,28).setOffset(10,16);

    this.maxHealth = 5;
    this.health = 5;
    this.facing = 1;
    this.controls = scene.input.keyboard.addKeys(controls);
    this.attackCooldown = 0;

    // movimentação avançada
    this.coyoteTimer = 0;
    this.canDouble = true;

    // efeito de squash/quase-anim
    this.squashTimer = 0;
  }

  postCreate() {
    // partículas simples de pouso — API Phaser 3.60: emitter como GameObject
    this.dustEmitter = this.scene.add.particles(0, 0, 'hitbox', {
      speed: 0,
      lifespan: 220,
      quantity: 0,
      scale: 0.15,
      alpha: 0.2,
      tint: 0x5da8ff,
      follow: this
    });
  }

  takeDamage(n=1){
    this.health = Math.max(0, this.health - n);
    this.setTint(0xff6b6b);
    this.scene.time.delayedCall(100, () => this.clearTint());
    this._invuln = performance.now() + 600;
  }

  doAttack(){
    if(this.attackCooldown > 0) return;
    this.attackCooldown = 250;
    const off = this.facing > 0 ? 28 : -28;
    const hit = this.scene.physics.add.sprite(this.x + off, this.y, 'hitbox').setAlpha(0.6);
    hit.body.allowGravity = false;
    this.scene.time.delayedCall(120, () => hit.destroy());
    this.scene.physics.add.overlap(hit, this.scene.enemies, (h, e)=>{
      e.takeDamage(1);
      e.setVelocityX((this.facing>0?1:-1)*140);
    });
  }

  handleJump(delta){
    const onGround = this.body.blocked.down;
    if(onGround){
      if(this._wasAir) {
        // aterrisagem
        this.setScale(1.08, 0.92);
        this.squashTimer = 100;
        this.dustEmitter.explode(4, this.x, this.y+10);
      }
      this._wasAir = false;
      this.coyoteTimer = COYOTE_MS;
      this.canDouble = true;
    } else {
      this._wasAir = true;
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
      if(this.squashTimer > 0){
        this.squashTimer -= delta;
        if(this.squashTimer <= 0) this.setScale(1,1);
      }
    }

    if(Phaser.Input.Keyboard.JustDown(this.controls.up)){
      if(onGround || this.coyoteTimer > 0){
        this.setVelocityY(JUMP_VEL);
        this.coyoteTimer = 0;
      } else if(this.canDouble){
        this.setVelocityY(JUMP_VEL * DOUBLE_SCALE);
        this.canDouble = false;
      }
    }
  }

  preUpdate(time, delta){
    super.preUpdate(time, delta);

    // movimentação horizontal
    let vx = 0;
    if(this.controls.left.isDown){ vx = -MOVE_SPEED; this.facing = -1; this.setFlipX(true); }
    else if(this.controls.right.isDown){ vx = MOVE_SPEED; this.facing = 1; this.setFlipX(false); }
    this.setVelocityX(vx);

    // pulo
    this.handleJump(delta);

    // ataque
    if(Phaser.Input.Keyboard.JustDown(this.controls.attack)) this.doAttack();
    if(this.attackCooldown > 0) this.attackCooldown -= delta;

    // morte/respawn simples
    if(this.y > this.scene.levelH + 50 || this.health <= 0){
      this.health = this.maxHealth;
      this.setPosition(120, 200);
      this.setVelocity(0,0);
    }
  }
}
