const canvas = document.getElementById("playground");
const g = canvas.getContext("2d");
const baseConfig = {
  updateDelay: 30,
  player1Playing: false,
};
const createUUID = () => {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};
const config = {
  updateDelay: 30,
  player1Playing: false,
  player2Playing: false,
  botProfile1: "bob2",
  botProfile2: "bob1",
  shallClear: false,
  id: createUUID(),
  autoRespawn: false,
  alwaysRender: false,
};
const config2 = {
  updateDelay: 30,
  player1Playing: false,
  player2Playing: false,
  botProfile1: "bob1",
  botProfile2: "bob1",
  shallClear: false,
  player1Color: "#ff33ee",
  player2Color: "#ebebeb",
  id: createUUID(),
  alwaysRender: false,
};
const randomTo255 = () => Math.random() * 255;
const games = [];
// games.push(createGame({ g, canvas, ...config }));
// games.push(createGame({ g, canvas, ...config2 }));
console.log(randomTo255());
games.push(
  createGame({
    g,
    canvas,
    ...config,
    player1Color: `rgb(${randomTo255()},${randomTo255()},${randomTo255()})`,
    player2Color: `rgb(${randomTo255()},${randomTo255()},${randomTo255()})`,
  })
);
games.push(
  createGame({
    g,
    canvas,
    ...config2,
    player1Color: `rgb(${randomTo255()},${randomTo255()},${randomTo255()})`,
    player2Color: `rgb(${randomTo255()},${randomTo255()},${randomTo255()})`,
  })
);

const start = (games) => {
  setInterval(() => {
    g.clearRect(0, 0, 1280, 720);
    games.forEach((game) => game.run());
  }, 30);
};
start(games);

const evolution = createDumbPongEvolution({mutationrate: 0.01})
evolution.createBot(games[0]);