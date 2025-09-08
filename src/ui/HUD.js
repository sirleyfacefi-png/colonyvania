// src/ui/HUD.js
export default class HUD {
  constructor(scene){
    this.el = document.getElementById('hud');
    this.scene = scene;
  }
  update(){
    const [p1,p2] = this.scene.players.getChildren();
    this.el.innerHTML = `
      <span class="pill">P1 ❤ ${p1 ? p1.health : 0}/5</span>
      <span class="pill">P2 ❤ ${p2 ? p2.health : 0}/5</span>
      <span class="pill">Mobs: ${this.scene.enemies.getLength()}</span>
    `;
  }
}
