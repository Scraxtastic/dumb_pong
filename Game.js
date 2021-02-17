document.body.addEventListener('keydown', ()=>{})
const createGame = ({ g, canvas, updateDelay, playerPlaying }) => {
  const colors = { frame: "rgb(230,230,230)", ball: "#ff0000" };
  const state = { running: true, run: 0, interval: null };
  const canvasClientRect = canvas.getBoundingClientRect();
  const screenWidth = canvasClientRect.width;
  const screenHeight = canvasClientRect.height;
  /**
   *
   */
  const ball = {
    x: screenWidth / 2,
    y: screenHeight / 2,
    size: 5,
    speed: 1
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
    renderFrame();
    renderBall();
  };

  const renderFrame = () => {
    g.fillStyle = colors.frame;
    const { frameHeight, frameThickness } = calcFrameSize({
      screenWidth,
      screenHeight,
    });
    g.fillRect(0, 0, screenWidth, frameHeight);
    g.fillRect(screenWidth - frameThickness, 0, frameThickness, screenHeight);
    g.fillRect(0, screenHeight - frameHeight, screenWidth, frameHeight);
    g.fillRect(0, 0, frameThickness, screenWidth);
  };

  const renderBall = () => {
    g.fillStyle = colors.ball;
    const ellipse = g.ellipse(ball.x, ball.y, ball.size, ball.size, 0, 0, 180);
    g.fill(ellipse);
  };

  /**
   * logic functions
   */
  const update = () => {};

  const updateBot = () => {

  }

  const updatePlayer = () => {

  }
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
      if (!state.running || window.gamePaused) return;
      render();
      state.run++;
    }, updateDelay);
  };

  const pauseAllGames = () => {
    window.gamePaused = true;
  };

  const resumeAllGames = () => {
    window.gamePaused = false;
  };

  return {
    start,
    stop,
    pauseAllGames,
    resumeAllGames,
  };
};

