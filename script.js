/* ------------------GLOBAL VARIABLES---------------------------- */
// this variable stores the ouput for the cards i.e. the yellow box
var scoreBoard = 'Cards will be shown here!';

// Store game data
var deckOfCards = [];
var playerCardsArray = [];
var dealerCardsArray = [];
var playerSumOfCards = 0;
var dealerSumOfCards = 0;
var showPlayersCards = '';
var currentPlayerState = {
  player: {
    stateBurst: 'burst',
    stateStand: 'stand',
  },
  dealer: {
    stateBurst: 'burst',
    stateStand: 'stand',
  },
  both: {
    restart: 'restart',
  },
};

// game modes
var FIRST_ROUND_DEALING_GAME_MODE = 'FIRST_ROUND_DEALING_GAME_MODE';
var HITORSTAND_GAME_MODE = 'HITORSTAND_GAME_MODE';
var DEALER_TURN_GAME_MODE = 'DEALER_TURN_GAME_MODE';
var GAME_ENDS_MODE = 'GAME_ENDS_MODE';
// declare starting game mode
gameMode = FIRST_ROUND_DEALING_GAME_MODE;

// restart game
var restartGame = function () {
  deckOfCards = [];
  playerCardsArray = [];
  dealerCardsArray = [];
  playerSumOfCards = 0;
  dealerSumOfCards = 0;
  showPlayersCards = '';
  gameMode = FIRST_ROUND_DEALING_GAME_MODE;
  myOutputValue = 'Hello! Welcome to a game of Black Jack. Click submit to start!';
  scoreBoard = 'Cards will be shown here!';
  return myOutputValue;
};

/* ------------------FUNCTIONS---------------------------- */

// STATMENT FUNCTION
var printResults = function (who, result) {
  var results = {
    player: {
      normal21: 'Hey player, you got 21! I suggest you stand',
      burst: 'Hey player, you bursted! Click submit to restart!',
      continue: 'Hey player, would you like to hit or stand',
      wins: 'PLAYER WINS Click submit to restart!',
    },
    dealer: {
      normal21: 'Dealer got 21!',
      burst: 'Dealer Bursted, you win! Click submit to restart!',
      stand: 'Dealer chooses to stand, time to compare Click submit to see results',
      wins: 'DEALER WINS Click submit to restart!',
    },
    both: {
      tie: 'IT IS A TIE. Click submit to restart!',
    },
  };
  return results[who][result];
};

// CARD FUNCTIONS
var createSingleCardSuit = function (currentSuit, startRange) {
  // card logic (cards 2-10 as is, jack/queen/king equals 10, ace is 1 for now)
  var nameCounter = 1;
  var rankCounter = startRange;
  while (nameCounter <= 13) {
    var cardName = nameCounter;
    // make a single card object variable
    var card = {
      name: cardName,
      suit: currentSuit,
      rank: rankCounter,
    };
    // 1, 11, 12 ,13
    if (cardName == 1) {
      card.name = 'ace';
      card.rank = 1;
    } else if (cardName == 11) {
      card.name = 'jack';
      card.rank = 10;
    } else if (cardName == 12) {
      card.name = 'queen';
      card.rank = 10;
    } else if (cardName == 13) {
      card.name = 'king';
      card.rank = 10;
    }
    // add the card to the deck
    deckOfCards.push(card);
    // increase counter
    nameCounter += 1;
    rankCounter += 1;
  }
};
var createDeckOfCards = function () {
  createSingleCardSuit('diamonds', 1);
  createSingleCardSuit('clubs', 1);
  createSingleCardSuit('hearts', 1);
  createSingleCardSuit('spades', 1);
  return deckOfCards;
};
var shuffleDeck = function (deck) {
  var cardIndex = 0;
  while (cardIndex < deck.length) {
    var randomNumber;
    var placeHolder;
    randomNumber = cardIndex + Math.floor(Math.random() * (deck.length - cardIndex));
    placeHolder = deck[randomNumber];
    deck[randomNumber] = deck[cardIndex];
    deck[cardIndex] = placeHolder;
    cardIndex += 1;
  }
  return deck;
};

// DEAL CARD FUNCTIONS
var dealCards = function (whoToDealTo) {
  if (whoToDealTo == 'everyone') {
    // player is dealt 1 faceup card picked from top of deck
    playerCardsArray.push(deckOfCards.pop());
    // dealer is dealt 1 faceup card
    dealerCardsArray.push(deckOfCards.pop());
    // player is dealt 1 more faceup card
    playerCardsArray.push(deckOfCards.pop());
    // dealer is dealt 1 more card that is faced down
    dealerCardsArray.push(deckOfCards.pop());
  } else if (whoToDealTo == 'player') {
    // player is dealt 1 more faceup card
    playerCardsArray.push(deckOfCards.pop());
  } else if (whoToDealTo == 'dealer') {
    // dealer is dealt 1 more card that is faced down
    dealerCardsArray.push(deckOfCards.pop());
  }
};

// CHECK CARD FUNCTIONS
var showCards = function (player, cardArray) {
  var statement = [];
  var printShowCards = '';
  for (var i = 0; i < cardArray.length; i += 1) {
    var cardNumOnHand = 'Card ' + [i + 1] + ': ';
    var chosenCardName = cardArray[i].name;
    var chosenCardSuit = cardArray[i].suit;
    statement.push(cardNumOnHand + chosenCardName + ' of ' + chosenCardSuit + '<br>');
  }
  console.log(player + statement);
  // store sum of cards
  playerSumOfCards = totalCardValue(playerCardsArray);
  dealerSumOfCards = totalCardValue(dealerCardsArray);
  // if dealer and when player is drawing, only show the first card
  if (player == 'dealer' && (gameMode == HITORSTAND_GAME_MODE || gameMode == FIRST_ROUND_DEALING_GAME_MODE)) {
    printShowCards = `${player}'s cards` + '<br><br>' + `${statement[0]}` + 'Card 2: Hidden<br>' + 'Sum: Hidden';
  } else if (player == 'player') {
    printShowCards = `${player}'s cards` + '<br><br>' + `${statement}` + `Sum: ${playerSumOfCards}`;
  } else if (player == 'dealer') {
    printShowCards = `${player}'s cards` + '<br><br>' + `${statement}` + `Sum: ${dealerSumOfCards}`;
  }
  return printShowCards;
};

// Add cards on hand
var totalCardValue = function (cardArray) {
  var sumOfCards = 0;
  for (var i = 0; i < cardArray.length; i += 1) {
    sumOfCards += cardArray[i].rank;
  }
  return sumOfCards;
};

/* ------------------LOGIC---------------------------- */
// Check if burst
var checkIfBurst = function (player, cardArray) {
  // conditions for player
  if (player == 'player') {
    var checkIfPlayerBurstOutputValue = '';
    // check players card by adding all the numbers
    var sumOfCards = totalCardValue(cardArray);
    // if 21
    if (sumOfCards == 21) {
      checkIfPlayerBurstOutputValue = printResults(player, 'normal21');
      // if burst
    } else if (sumOfCards > 21) {
      checkIfPlayerBurstOutputValue = printResults(player, 'burst');
      // change playerState for player
      playerState = currentPlayerState.player.stateBurst;
      console.log('PLAYESTATE ' + playerState);
      gameMode = GAME_ENDS_MODE;// end the game
    // if less than 21
    } else if (sumOfCards < 21) {
      checkIfPlayerBurstOutputValue = printResults(player, 'continue');
      gameMode = HITORSTAND_GAME_MODE; // continue the game
    }
    return checkIfPlayerBurstOutputValue;
  }
  // conditions for dealer
  if (player == 'dealer') {
    gameMode = DEALER_TURN_GAME_MODE; // continue the game, dealer makes decisions
    var checkIfDealerBurstOutputValue = '';
    // check dealers card by adding all the numbers
    var sumOfCards = totalCardValue(cardArray);
    // if card is lower than 14 draw cards
    while (sumOfCards < 14) {
      dealCards('dealer');
      console.log('dealer drew card');
      // update cardArray
      sumOfCards = totalCardValue(cardArray);
    }
    // if 21
    if (sumOfCards == 21) {
      checkIfDealerBurstOutputValue = printResults(player, 'normal21');
      return checkIfDealerBurstOutputValue;
    // if burst
    } if (sumOfCards > 21) {
      checkIfDealerBurstOutputValue = printResults(player, 'burst');
      // change playerState for dealer
      playerState = currentPlayerState.dealer.stateBurst;
      console.log('PLAYESTATE ' + playerState);
      gameMode = GAME_ENDS_MODE;// end the game
      return checkIfDealerBurstOutputValue;
    }
    // change playerState for dealer
    playerState = currentPlayerState.dealer.stateStand;
    console.log('PLAYESTATE ' + playerState);
    checkIfDealerBurstOutputValue = printResults(player, 'stand');
    gameMode = GAME_ENDS_MODE;// end the game
    return checkIfDealerBurstOutputValue;
  }
};

var compareValuesReturnWinner = function (playerCardsCombined, dealerCardsCombined) {
  var winningStatement = printResults('both', 'tie');
  if (playerCardsCombined > dealerCardsCombined) {
    winningStatement = printResults('player', 'wins');
  } else if (playerCardsCombined < dealerCardsCombined) {
    winningStatement = printResults('dealer', 'wins');
  }
  return winningStatement;
};

/*-------------------------------------------------*/
/* -----------------MAIN FUNCTION-------------------*/
/*-------------------------------------------------*/
var main = function (input) {
  var playerInput = input;
  var myOutputValue = '';
  if (gameMode == FIRST_ROUND_DEALING_GAME_MODE) {
    // deck of cards is created & shuffled
    shuffleDeck(createDeckOfCards());
    console.log(deckOfCards);
    // Deal first round of cards
    dealCards('everyone');
    // show player card + dealer's first card & ask player to make choice to hit or stand
    scoreBoard = showCards('player', playerCardsArray) + '<br><br>' + showCards('dealer', dealerCardsArray);
    myOutputValue = printResults('player', 'continue');
    // switch gameMode
    gameMode = HITORSTAND_GAME_MODE;
    return myOutputValue;
  }
  if (gameMode == HITORSTAND_GAME_MODE) {
    if (playerInput == 'hit') {
      // deal one more card to player
      dealCards('player');
      // check if player cards burst
      var burstResult = checkIfBurst('player', playerCardsArray);
      // if burst EXIT
      if (gameMode == GAME_ENDS_MODE) {
        myOutputValue = burstResult;
        scoreBoard = showCards('player', playerCardsArray) + '<br><br>' + showCards('dealer', dealerCardsArray);
        return myOutputValue;
      }
      myOutputValue = burstResult;
    } else if (playerInput == 'stand') {
      // switch gameMode
      gameMode = DEALER_TURN_GAME_MODE;
      myOutputValue = 'You chose to stand, its the dealers turn...Click submit to reveal dealers second card and see if they draw or stand';
      // change playerState for player
      playerState = currentPlayerState.player.stateStand;
      console.log('PLAYESTATE ' + playerState);
      return myOutputValue;
    } else {
      myOutputValue = 'YOU HAVE TO TYPE EITHER \'hit\' OR \'stand\'' + '<br><br>' + showPlayersCards;
    }
    scoreBoard = showCards('player', playerCardsArray) + '<br><br>' + showCards('dealer', dealerCardsArray);
    return myOutputValue;
  }
  if (gameMode == DEALER_TURN_GAME_MODE) {
    // check dealers card
    var burstResult = checkIfBurst('dealer', dealerCardsArray);
    // if burst EXIT
    if (gameMode == GAME_ENDS_MODE) {
      myOutputValue = burstResult;
      scoreBoard = showCards('player', playerCardsArray) + '<br><br>' + showCards('dealer', dealerCardsArray);
      return myOutputValue;
    }
    myOutputValue = burstResult;
    // show player card + dealer's cards
    scoreBoard = showCards('player', playerCardsArray) + '<br><br>' + showCards('dealer', dealerCardsArray);
  }
  if (gameMode == GAME_ENDS_MODE) {
    // if player or dealer bursts OR Time to restart game
    if (playerState == currentPlayerState.player.stateBurst || playerState == currentPlayerState.dealer.stateBurst || playerState == currentPlayerState.both.restart) {
      // restart game
      myOutputValue = restartGame();
      return myOutputValue;
    } }
  // if comparing
  if (playerState == currentPlayerState.dealer.stateStand) {
    myOutputValue = compareValuesReturnWinner(playerSumOfCards, dealerSumOfCards);
    // change state of game to restart on next click
    playerState = currentPlayerState.both.restart;
    return myOutputValue;
  }
};
