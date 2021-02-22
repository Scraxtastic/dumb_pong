const createDumbPongEvolution = ({ mutationrate = 0.01, addRate = 5, groupingAmount = 10 }) => {
  let minId = 1;
  const botConfig = { mutationrate };
  const moveMapping = {
    nothing: 0,
    up: 1,
    down: 2,
  };
  let bots = [];

  /**
   * Helper functions
   */
  const randomMoveMappingValue = () => {
    return moveMapping[number.parseInt(moveMapping.length * Math.random())];
  };

  /**
   * Visible functions
   */
  const createBot = (game) => {
    const moves = [];
    const mutate = () => {
      if (Math.random() < mutationrate) return false;
      const maxChanges = moves.length * mutationrate;
      let changes = 0;
      for (let i = 0; i < moves.length; i++) {
        if (Math.random() < mutationrate) {
          if (changes > maxChanges) i = moves.length;
          moves[i] = randomMoveMappingValue();
        }
      }
    };

    const move = () => {
      const currentMove = randomMoveMappingValue();
      moves.push(currentMove);
      return currentMove;
    };
    const injectMoves = (movesToInject)=>{
      moves.push(...movesToInject);
    }
    const replaceMoves = (newMoves)=>{
      moves.splice(0, moves.length);
      moves.push(...newMoves);
    }

    bots.push({
      ...botConfig,
      game,
      mutate,
      move,
      fitness = 0,
      id = minId,
      injectMoves,
      replaceMoves,
      moves,
    });
    minId++;
  };

  const getBot = (uuid) => {
    return bots.filter((bot) => {
      if (bot.game.uuid == uuid) return bot;
    });
  };

  const getBots = () => {
    return bots;
  };

  const setMutationRate = (mutationrate) => {
    mutationrate = mutationrate;
  };

  const replaceWithNewGeneration = ()=>{
    const sortedBots = bots.sort((bot1, bot2)=>{
      if(bot1l.fitness == bot2.fitness) return 0;
      if(bot1.fitness>bot2.fitness)return 1;
      return -1
    });
    const bestBots = []
    let groupCount = groupingAmount < bots.length ? groupingAmount : bots.length;
    for(let i = 0 ; i < groupCount; i++){
      bestBots.push(sortedBots[i]);
    }
    for(let i = bestBots.length; i < sortedBots.length; i++){
      sortedBots[i].replaceMoves(bestBots[i%bestBots.length].moves)
    }
    mutateAll();
  }
  
  const mutateAll = ()=>{
    bots.forEach(bot=>bot.mutate());
  }

  return {
    createBot,
    getBot,
    getBots,
    setMutationRate,
    replaceWithNewGeneration,
    mutateAll,
    moveMapping,
  };
};
