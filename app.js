console.log("JS working")
// cached constants
const gameElement = document.querySelector("#game")
const newGameButtonElement = document.querySelector("#new-game")
const messageElement = document.querySelector("#message")
const stockElement = document.querySelector("#stock")
const wasteElement = document.querySelector("#waste")
const pileElement = document.querySelectorAll(".pile")
const foundationElement = document.querySelectorAll(".foundation")

console.log(gameElement)
console.log(newGameButtonElement)
console.log(messageElement)
console.log(stockElement)
console.log(wasteElement)
console.log(pileElement)
console.log(foundationElement)

// constants
const suitSymbols = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" }
const ranks = ["A", 2, 3, 4, 5, 6 ,7 ,8 ,9, 10, "J", "Q", "K"]
const suits = ["hearts", "diamonds", "clubs", "spades"]

// variables
let stock = []
let waste = []
let foundation = [[],[],[],[]]
let tableau = [[],[],[],[],[],[],[]]
let selected = null

// Functions
function createDeck(){
    let deck = []
    for(const suit of suits){
        for( let rank = 1; rank <=13; rank++){
            deck.push({suits: suit, rank: rank, faceUp: false})
        }
    }
    return deck
}

function shuffle(deck){
    const shuffled =[]
    while (deck.length>0){
        const randomCardIndex = Math.floor(Math.random() * deck.length)
        const card = deck.splice(randomCardIndex,1)[0]
        shuffled.push(card)
    }
    return shuffled
}

function newGame(){
    stock = []
    waste = []
    foundation = [[],[],[],[]]
    tableau = [[],[],[],[],[],[],[]]
    selected = null

    const deck = shuffle(createDeck())

    for(let i = 0; i <7; i++){
        for(let j = 0; j<i+1; j++){
            tableau[i].push(deck.pop())
        }
        tableau[i][tableau[i].length - 1].faceUp = true
    }
    stock = deck
}

function getColor(card){
    if(card.suits === "hearts" || card.suits === "diamonds"){
        return "red"
    }
    else{
        return "black"
    }
}

function getSymbol(card){
  const label = ranks[card.rank - 1]
  return label + suitSymbols[card.suits]
}

function createCardElement(card, pileType, pileIndex, cardIndex){
    const cardElement = document.createElement("div")
    cardElement.classList.add("card")
    if(card.faceUp){
        cardElement.textContent = getSymbol(card)

        if(getColor(card) === "red"){
            cardElement.classList.add("red")
        }
    }
    else{
        cardElement.classList.add("face-down")
    }
    cardElement.dataset.pileType = pileType
    cardElement.dataset.pileIndex = pileIndex
    cardElement.dataset.cardIndex = cardIndex

    return cardElement
}

function renderTableau(){
    for(let i=0; i < 7; i++){
        pileElement[i].innerHTML = ""
        for(let j=0; j < tableau[i].length; j++){
            const card = tableau[i][j]
            const cardElement = createCardElement(card, "tableau", i, j)
            cardElement.style.top = j * 20 + "px"
            pileElement[i].appendChild(cardElement)
        }
    }
}

function renderStock(){
    stockElement.innerHTML = ""
    if(stock.length > 0){
        const card = stock[stock.length - 1]
        const cardElement = createCardElement(card, "stock", 0, stock.length - 1)
        stockElement.appendChild(cardElement)
  }
}

function renderWaste(){
    wasteElement.innerHTML = ""
    if(waste.length > 0){
        const card = waste[waste.length - 1]
        const cardElement = createCardElement(card, "waste", 0, waste.length - 1)
        wasteElement.appendChild(cardElement)
    }

}

function renderFoundation(){
    for(let i=0; i < 4; i++){
        foundationElement[i].innerHTML = ""
        if(foundation[i].length > 0){
            const card = foundation[i][foundation[i].length - 1]
            const cardElement = createCardElement(card, "foundation", i, foundation[i].length - 1)
            foundationElement[i].appendChild(cardElement)
        }
    }
}

function render() {
  renderTableau()
  renderStock()
  renderWaste()
  renderFoundation()
}
// Start the game
newGame()
render()