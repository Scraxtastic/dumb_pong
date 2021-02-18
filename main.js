const canvas = document.getElementById("playground");
const g = canvas.getContext("2d");
const config = {
  updateDelay: 30,
  player1Playing: true,
  player2Playing: false,
  botProfile1: "bob2",
  botProfile2: "bob1",
  shallClear: false,
};
const config2 = {
  updateDelay: 30,
  player1Playing: false,
  player2Playing: false,
  botProfile1: "bob",
  botProfile2: "bob1",
  shallClear: false,
  player1Color: "#443322",
  player2Color: "#333333",
};
const games = [];
games.push(createGame({ g, canvas, ...config }));
// games.push(createGame({ g, canvas, ...config2 }));

const start = (games ) => {
  console.log("Started")
  setInterval(() => {
    g.clearRect(0, 0, 1280, 720);
    games.forEach((game) => {
      game.run();
    });
  }, 30);
};
start(games);
