console.log("JS working")
// cached constants
gameElement = document.querySelector("#game")
newGameButtonElement = document.querySelector("#new-game")
messageElement = document.querySelector("#message")
stockElement = document.querySelector("#stock")
wasteElement = document.querySelector("#waste")
pileElement = document.querySelectorAll(".pile")
foundationElement = document.querySelectorAll(".foundation")

console.log(gameElement)
console.log(newGameButtonElement)
console.log(messageElement)
console.log(stockElement)
console.log(wasteElement)
console.log(pileElement)
console.log(foundationElement)

// constants
const suits =["hearts", "diamonds", "clubs", "spades"]
const ranks = [1, 2, 3, 4, 5, 6 ,7 ,8 ,9, 10, 11, 12, 13]

// variables
let stock = []
let waste = []
let foundations = [[],[],[],[]]
let tableau = [[],[],[],[],[],[],[]]
let selected = null

// Functions
function createDeck(){
    let deck = []
    for(const suit of suits){
        for( let rank = 1; rank <=13; rank++){
            deck.push({suit: suit, rank: rank, faceUp: false})
        }
    }
    return deck
}

function shuffle(deck){
    const shuffled =[]
    while (deck.length>0){
        const randomCard = Math.floor(Math.random() * deck.length)
        const card = deck.splice(randomCard,1)[0]
        shuffled.push(card)
    }
    return shuffled
}

function newGame(){
    stock = []
    waste = []
    foundations = [[],[],[],[]]
    tableau = [[],[],[],[],[],[],[]]
    selected = null

    const deck = shuffle(createDeck())

    for(let i = 0; i <7; i++){
        for(let j = 0; j<i+1; j++){
            tableau[i].push(deck.pop())
        }
        tableau[i][tableau[i].length - 1].faceUp = true;
    }
    stock = deck
}

// Event Listener
newGame()

// tableau.map(pile > pile.length)   
// stock.length                      
// tableau[3][3].faceUp              
// tableau[3][2].faceUp               