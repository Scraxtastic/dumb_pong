const canvas = document.getElementById("playground");
const g = canvas.getContext("2d");
const config = {
  updateDelay: 100,
};
const game = createGame({ g, canvas, ...config });
game.start()

