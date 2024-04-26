function updateScore() {
  if (player.lives < 0) {
    console.log("game over");
  }
  g.score.innerHTML = `Score: ${player.score}`;
  g.lives.innerHTML = `Lives: ${player.lives}`;
}
