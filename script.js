var main = function (input) {
  var myOutputValue = '';
  // deck of cards is created & shuffled
  shuffleDeck(createDeckOfCards());
  console.log(deckOfCards);
  // Deal first round of cards
  dealCards();
  // show player card
  var showPlayersCards = showCards('Player one', playerCardsArray) + '<br><br>' + showCards('Computer', computerCardsArray);
  // add up player card then computer card
  var playerCardsCombined = addCards(playerCardsArray);
  var computerCardsCombined = addCards(computerCardsArray);
  // compare player and computers card & print winner
  var winner = compareValuesReturnWinner(playerCardsCombined, computerCardsCombined);
  myOutputValue = showPlayersCards + '<br>' + winner;
  // if 21 win
  // if more than 21 bust
  // if less than 21 user can decide if they want another card
  // reveal computer card
  // if 21 win
  // if more than 21 bust
  // if less than 21 computer can decide if they want another card
  return myOutputValue;
};

/* ------------------GLOBAL VARIABLES---------------------------- */
var deckOfCards = [];
var playerCardsArray = [];
var computerCardsArray = [];

/* ------------------FUNCTIONS---------------------------- */

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
var dealCards = function () {
  // player is dealt 1 faceup card picked from top of deck
  playerCardsArray.push(deckOfCards.pop());
  // computer is dealt 1 faceup card
  computerCardsArray.push(deckOfCards.pop());
  // player is dealt 1 more faceup card
  playerCardsArray.push(deckOfCards.pop());
  // computer is dealt 1 more card that is faced down
  computerCardsArray.push(deckOfCards.pop());
};

// CHECK CARD FUNCTIONS
var addCards = function (cardArray) {
  var addAllCards = 0;
  for (var i = 0; i < cardArray.length; i += 1) {
    addAllCards += cardArray[i].rank;
  }
  return addAllCards;
};
var compareValuesReturnWinner = function (playerCardsCombined, computerCardsCombined) {
  var winningStatement = 'IT IS A TIE';
  if (playerCardsCombined > computerCardsCombined) {
    winningStatement = 'PLAYER WINS';
  } else if (playerCardsCombined < computerCardsCombined) {
    winningStatement = 'COMPUTER WINS';
  }
  return winningStatement;
};
var showCards = function (player, cardArray) {
  var statement = [];
  for (var i = 0; i < cardArray.length; i += 1) {
    var partOne = 'Card ' + [i + 1] + ': ';
    var partTwo = cardArray[i].name;
    var partThree = cardArray[i].suit;
    statement.push(partOne + partTwo + ' of ' + partThree + '<br>');
  }
  return `${player}'s cards` + '<br><br>' + `${statement}`;
};
