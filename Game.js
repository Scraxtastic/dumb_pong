/**
 * player1 and 2 movement (up & down)
 * 83=s, 87=w, 38=up_arrow, 40=down_arrow
 */
const keyCodes = {
  player1u: 87,
  player1d: 83,
  player2u: 38,
  player2d: 40,
};

window.Game = { keyCodes };
document.body.addEventListener("keydown", ({ keyCode }) => {
  keyHandle({ keyCode, outcome: true });
});
document.body.addEventListener("keyup", ({ keyCode }) => {
  keyHandle({ keyCode, outcome: false });
});
const keyHandle = ({ keyCode, outcome }) => {
  switch (keyCode) {
    case keyCodes.player1u:
      window.Game.player1u = outcome;
      break;
    case keyCodes.player1d:
      window.Game.player1d = outcome;
      break;
    case keyCodes.player2u:
      window.Game.player2u = outcome;
      break;
    case keyCodes.player2d:
      window.Game.player2d = outcome;
      break;
  }
};
const createGame = ({
  g,
  canvas,
  updateDelay = 50,
  player1Playing = false,
  player2Playing = false,
  botProfile1 = "bob",
  botProfile2 = "bob",
  bounceStrength = 10,
  shallClear = true,
  player1Color = "#00ff00",
  player2Color = "#0000ff",
  autoRespawn = true,
  bot,
  id = Math.random(),
  alwaysRender = true,
}) => {
  const speedFactor = updateDelay / 1000;
  const colors = { frame: "rgb(230,230,230)", ball: "#ff0000" };
  const state = { running: true, run: 0, interval: null };
  const canvasClientRect = canvas.getBoundingClientRect();
  const screenWidth = canvasClientRect.width;
  const screenHeight = canvasClientRect.height;
  const points = {
    player1: 0,
    player2: 0,
  };
  /**
   * GameObjects and vars
   */
  let goalHit = false;
  const ballRadius = 5;
  const ballStartPosition = {
    x: screenWidth / 2 - ballRadius,
    y: screenHeight / 2 - ballRadius,
  };
  const ballStartSpeed = {
    xspeed: 600,
    yspeed: 1,
  };
  const ball = {
    x: ballStartPosition.x,
    y: ballStartPosition.y,
    size: ballRadius,
    xspeed: ballStartSpeed.xspeed,
    yspeed: ballStartSpeed.yspeed,
  };

  const playerConfig = {
    height: 100,
    width: 10,
    speed: 300,
    ystart: screenHeight / 2 - 100 / 2,
  };
  const player1 = {
    x: 20,
    y: playerConfig.ystart,
    width: playerConfig.width,
    height: playerConfig.height,
    speed: playerConfig.speed,
    color: player1Color,
  };
  const player2 = {
    x: screenWidth - 20 - playerConfig.width,
    y: playerConfig.ystart,
    width: playerConfig.width,
    height: playerConfig.height,
    speed: playerConfig.speed,
    color: player2Color,
  };

  /**
   * Helper functions
   */

  const calcFrameSize = () => {
    const frameHeight = (screenHeight / 1000) * 16;
    const frameThickness = (screenWidth / 1000) * 9;
    return { frameHeight, frameThickness };
  };

  /**
   * Render functions
   */
  const render = () => {
    if (shallClear) g.clearRect(0, 0, screenWidth, screenHeight);
    renderBall();
    renderPlayer(player1);
    renderPlayer(player2);
    renderFrame();
  };

  const renderFrame = () => {
    g.fillStyle = colors.frame;
    const { frameHeight, frameThickness } = calcFrameSize({
      screenWidth,
      screenHeight,
    });
    g.beginPath();
    g.rect(0, 0, screenWidth, frameHeight);
    g.rect(screenWidth - frameThickness, 0, frameThickness, screenHeight);
    g.rect(0, screenHeight - frameHeight, screenWidth, frameHeight);
    g.rect(0, 0, frameThickness, screenWidth);
    g.fill();
  };

  const renderBall = () => {
    g.fillStyle = colors.ball;
    g.beginPath();
    g.ellipse(ball.x, ball.y, ball.size, ball.size, 0, 0, 360);
    g.fill();
  };

  const renderPlayer = (player) => {
    g.beginPath();
    g.fillStyle = player.color;
    g.rect(player.x, player.y, player.width, player.height);
    g.fill();
  };

  /**
   * logic functions
   */

  const update = () => {
    if (!goalHit) {
      ball.x += ball.xspeed * speedFactor;
      ball.y += ball.yspeed * speedFactor;
      if (player1Playing) updatePlayer1();
      else {
        updateBot({ player: player1, botProfile: botProfile1 });
      }
      if (player2Playing) updatePlayer2();
      else {
        updateBot({ player: player2, botProfile: botProfile2 });
      }
      checkCollisions();
    } else {
      if (autoRespawn) respawnIfGoaled();
    }
  };

  const updateBot = ({ player, botProfile }) => {
    const ballcenterY = ball.y + ball.size;
    const playerCenterY = player.y + player.height / 2;
    const centerDif = Math.sqrt(Math.pow(ballcenterY - playerCenterY, 2));
    const maxPlayerMovement = player1.speed * speedFactor;
    switch (botProfile) {
      case "bob":
        updateBob({
          player,
          ballcenterY,
          playerCenterY,
          centerDif,
          maxPlayerMovement,
        });
        break;
      case "bob1":
        updateBob1({
          player,
          ballcenterY,
          playerCenterY,
          centerDif,
          maxPlayerMovement,
        });
        break;
      case "bob2":
        updateBob2({
          player,
          ballcenterY,
          playerCenterY,
          centerDif,
          maxPlayerMovement,
        });
        break;
      case "bobe":
        updateBobe({
          player,
          ballcenterY,
          playerCenterY,
          centerDif,
          maxPlayerMovement,
        });
        break;
    }
  };

  const updatePlayer1 = () => {
    if (window.Game.player1u) {
      player1.y -= player1.speed * speedFactor;
    }
    if (window.Game.player1d) {
      player1.y += player1.speed * speedFactor;
    }
  };

  const updatePlayer2 = () => {
    if (window.Game.player2u) {
      player2.y -= player2.speed * speedFactor;
    }
    if (window.Game.player2d) {
      player2.y += player2.speed * speedFactor;
    }
  };

  const resetPositions = (player1Point) => {
    goalHit = true;
    if (player1Point) points.player1 += 1;
    else points.player2 += 1;
    ball.x = ballStartPosition.x;
    ball.y = ballStartPosition.y;
    ball.xspeed = player1Point ? -ballStartSpeed.xspeed : ballStartSpeed.xspeed;
    ball.yspeed = ballStartSpeed.yspeed;
    player1.y = playerConfig.ystart;
    player2.y = playerConfig.ystart;
  };

  /**
   * Bot functions
   */

  const updateBob = ({
    player,
    ballcenterY,
    playerCenterY,
    centerDif,
    maxPlayerMovement,
  }) => {
    if (ballcenterY < playerCenterY) {
      if (centerDif > maxPlayerMovement) {
        player.y -= player.speed * speedFactor;
      } else {
        player.y -= centerDif;
      }
    }
    if (ballcenterY > playerCenterY) {
      if (centerDif > maxPlayerMovement) {
        player.y += player.speed * speedFactor;
      } else {
        player.y += centerDif;
      }
    }
  };

  const updateBob1 = ({
    player,
    ballcenterY,
    centerDif,
    maxPlayerMovement,
  }) => {
    const ballUpwards = ball.yspeed < 0;
    const ballDistance = ballUpwards
      ? Math.sqrt(Math.pow(ballcenterY - player.y + player.height, 2))
      : Math.sqrt(Math.pow(ballcenterY - player.y, 2));
    if (ballUpwards && ballcenterY < player.y + player.height) {
      if (ballDistance > maxPlayerMovement) {
        player.y -= maxPlayerMovement;
      } else {
        player.y -= ballDistance;
      }
    }
    if (ballcenterY > player.y + player.height) {
      if (ballDistance > maxPlayerMovement) {
        player.y += maxPlayerMovement;
      } else {
        player.y += centerDif;
      }
    }
  };

  const updateBob2 = ({
    player,
    ballcenterY,
    playerCenterY,
    centerDif,
    maxPlayerMovement,
  }) => {
    const ballUpwards = ball.yspeed < 0;
    if (ballUpwards && ballcenterY < playerCenterY) {
      if (centerDif > maxPlayerMovement) {
        player.y -= player.speed * speedFactor;
      } else {
        player.y -= centerDif;
      }
    }
    if (!ballUpwards && ballcenterY > playerCenterY) {
      if (centerDif > maxPlayerMovement) {
        player.y += player.speed * speedFactor;
      } else {
        player.y += centerDif;
      }
    }
  };

  const updateBobe = ({
    player,
    ballcenterY,
    playerCenterY,
    centerDif,
    maxPlayerMovement,
  }) => {
    if(bot && state.run%5 == 0){
      const botMove = bot.move();
    }
  };

  /**
   * Collision functions
   */

  const checkCollisions = () => {
    if (ball.x > screenWidth) {
      resetPositions(true);
    } else if (ball.x < 0) {
      resetPositions(false);
    }
    const { frameHeight } = calcFrameSize();

    keepBallInField(frameHeight);
    keepPlayerInField({ player: player1, frameHeight });
    keepPlayerInField({ player: player2, frameHeight });
    if (ball.xspeed == 0) {
      ball.xspeed = Math.random() - 0.5 * 200;
      ball.yspeed = Math.random() - 0.5 * 200;
    } else if (ball.xspeed > 0) {
      if (ballHitsPlayer(player2)) {
        const player2yCenter = player2.y + player2.height / 2;
        const d = player2yCenter - ball.y;
        ball.yspeed += d * -bounceStrength;
        ball.xspeed *= -1;
      }
    } else if (ball.xspeed < 0) {
      if (ballHitsPlayer(player1)) {
        const player1yCenter = player1.y + player1.height / 2;
        const d = player1yCenter - ball.y;
        ball.yspeed += d * -bounceStrength;
        ball.xspeed *= -1;
      }
    }
  };

  const keepBallInField = (frameHeight) => {
    if (
      ball.y + ball.size + frameHeight > screenHeight ||
      ball.y - ball.size - frameHeight < 0
    ) {
      ball.yspeed *= -1;
    }
  };

  const keepPlayerInField = ({ player, frameHeight }) => {
    const bottom = screenHeight - frameHeight;
    if (player.y < frameHeight) player.y = frameHeight;
    if (player.y + player.height > bottom) player.y = bottom - player.height;
  };

  const ballHitsPlayer = (player) => {
    return (
      ball.x + ball.size > player.x &&
      ball.x - ball.size < player.x + player.width &&
      ball.y + ball.size > player.y &&
      ball.y - ball.size < player.y + player.height
    );
  };

  /**
   * Visible functions
   */
  const stop = () => {
    state.running = false;
    clearInterval(state.interval);
    1;
  };

  const start = () => {
    state.interval = setInterval(() => {
      run();
    }, updateDelay);
  };

  const pauseAllGames = () => {
    window.gamePaused = true;
  };

  const resumeAllGames = () => {
    window.gamePaused = false;
  };

  const respawnIfGoaled = () => {
    goalHit = false;
  };

  const isGoaled = () => goalHit;

  const setBot = (newBot)=> {
    bot = newBot;
  }

  const run = () => {
    if (!state.running || window.gamePaused) return;
    update();
    if (!goalHit || alwaysRender) requestAnimationFrame(render);
    state.run++;
  };

  return {
    start,
    stop,
    pauseAllGames,
    resumeAllGames,
    run,
    respawnIfGoaled,
    isGoaled,
    setBot,
  };
};
