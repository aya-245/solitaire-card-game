console.log("JS working")
// cached constants
const gameElement = document.querySelector("#game")
const newGameButtonElement = document.querySelector("#new-game")
const messageElement = document.querySelector("#message")
const stockElement = document.querySelector("#stock")
const wasteElement = document.querySelector("#waste")
const pileElement = document.querySelectorAll(".pile")
const foundationElement = document.querySelectorAll(".foundation")
const scoreElement = document.querySelector("#score")
const highestScoreElement = document.querySelector("#highest-score")
const undoDrawElement = document.querySelector("#undo-draw")
const pauseButtonelement = document.querySelector("#pause-button")
const timerElement = document.querySelector("#timer")
const pausePopUpElement = document.querySelector("#pause-popup")

console.log(gameElement)
console.log(newGameButtonElement)
console.log(messageElement)
console.log(stockElement)
console.log(wasteElement)
console.log(pileElement)
console.log(foundationElement)
console.log(scoreElement)
console.log(highestScoreElement)
console.log(undoDrawElement)
console.log(pauseButtonelement)
console.log(timerElement)
console.log(pausePopUpElement)

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
let score = 0
let highestScore = 0
let canUndoDraw = false
let seconds = 0
let timerId = null
let paused = false

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
    score = 0
    canUndoDraw = false
    stopTimer()
    seconds = 0
    paused = false
    pausePopUpElement.classList.add("hidden")
    timerElement.textContent = "Time: 00:00"
    pauseButtonelement.textContent = "Pause"

    updateScore(0)
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
    
    if(selected !== null && selected.pileType === pileType && selected.pileIndex === pileIndex && selected.cardIndex === cardIndex){
        cardElement.classList.add("selected")
    }

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
  //disbale the undo button when the player can't undo
  undoDrawElement.disabled = !canUndoDraw
}

function drawCard(){
    if(paused){
        return
    }

    if(stock.length > 0){
        startTimer()
        const topCard = stock.pop()
        topCard.faceUp = true
        waste.push(topCard)
        canUndoDraw = true
    }
    else if(waste.length > 0){
        startTimer()
        canUndoDraw = false
        updateScore(-20)
        waste.reverse()
        for(const card of waste){
            card.faceUp = false
        }
        stock = waste 
        waste = []   
    }
    selected = null
    render()

}

function handleClick(event){
    if(paused){
        return
    }

   const cardElement = event.target.closest(".card")
   const pileDiv = event.target.closest(".pile")
   const foundationDiv = event.target.closest(".foundation")
   let pileType = null
   let pileIndex = null
   let cardIndex = null
   
    if(cardElement !== null){
        pileType = cardElement.dataset.pileType
        pileIndex = Number(cardElement.dataset.pileIndex)
        cardIndex = Number(cardElement.dataset.cardIndex)
    }

    if(pileType === "stock"){
        return
    }

    let destType = null
    let destIndex = null

    if(pileDiv !== null){
        destType = "tableau"
        destIndex = Number(pileDiv.dataset.index)
    }
    else if(foundationDiv !== null){
        destType = "foundation"
        destIndex = Number(foundationDiv.dataset.index)
    }

    const sameSpot = selected !== null && destType === selected.pileType && destIndex === selected.pileIndex

    if (selected !== null && destType !== null && !sameSpot) {
        console.log(destType, destIndex)
        tryMove(destType, destIndex)
        return
    }

        if (cardElement === null) {
        selected = null
        render()
        return
    }

    let card
    if (pileType === "tableau") {
        card = tableau[pileIndex][cardIndex]
    } 
    else if (pileType === "waste") {
        card = waste[cardIndex]
    } 
    else {
        card = foundation[pileIndex][cardIndex]
    }

    if(!card.faceUp){
        return
    }
    // is the selected card the same card that was selected , if so, disselect it
    if(selected !== null && selected.pileType === pileType && selected.pileIndex === pileIndex && selected.cardIndex === cardIndex){
        selected = null
    }
    else{ // if not, save the newly selected card in an object
        selected = {pileType: pileType, pileIndex: pileIndex, cardIndex: cardIndex}
    }
    render()
}

function canMoveToTableau(card, pile){
    console.log('pile',pile)
    if(pile.length === 0){
        return card.rank === 13
    }
    const topCard = pile[pile.length - 1]

   return getColor(card) !== getColor(topCard) && card.rank === topCard.rank - 1
        
}

function canMoveToFoundation(card, pile){
    if(pile.length === 0){
        return card.rank === 1
    }
    const topCard = pile[pile.length - 1]

    return card.suits === topCard.suits && card.rank === topCard.rank + 1

}
function tryMove(destType, destIndex){
    let source
    if(selected.pileType === "tableau"){
        source = tableau[selected.pileIndex]
    }
    else if(selected.pileType === "waste"){
        source = waste
    }
    else{
        source = foundation[selected.pileIndex]
    }

    const movingCard = source[selected.cardIndex]
    const cardAmount = source.length - selected.cardIndex

    let legal = false
    if (destType === "foundation") { // can move only one crad to the founction
        legal = cardAmount === 1 && canMoveToFoundation(movingCard, foundation[destIndex])
    } 
    else { // can move a stack
        legal = canMoveToTableau(movingCard, tableau[destIndex])
    }

    if (legal) {
        startTimer()
        canUndoDraw = false
        const chunk = source.splice(selected.cardIndex)

        let destination // moves to foundation
    if (destType === "foundation") {
        destination = foundation[destIndex]
    } 
    else { //moves to tableau
        destination = tableau[destIndex]
    }
    // pushed the card to destination
   for (const card of chunk) {
        destination.push(card)
    }

    // Waste to tableau: +5
    // Waste to foundation: +10
    // Tableau to foundation: +10
    // Flipping a face-down tableau card: +5
    // Foundation back to tableau: -15
    // Recycling the waste into the stock: -20

    if(selected.pileType === "waste" && destType === "tableau"){
        updateScore(5)
    }
    else if(selected.pileType === "waste" && destType === "foundation"){
        updateScore(10)
    }
    else if(selected.pileType === "tableau" && destType === "foundation"){
        updateScore(10)
    }
    else if(selected.pileType === "foundation" && destType === "tableau"){
        updateScore(-15)
    }

    if(selected.pileType === "tableau" && source.length > 0){
        const newTop = source[source.length - 1]
        if(newTop.faceUp === false){
            newTop.faceUp = true
            updateScore(5)
        }

    }
    if(checkWin() === true){
        finishGame()
    }
    else if(canAutoWin() === true){
        autoWin()
    }
  }
 
  selected = null
  render()
}

 function resetGame(){
    newGame()
    messageElement.textContent = ""
    render()
}

function updateScore(points){
    score += points
    if(score < 0){
        score = 0
    }
    scoreElement.textContent = "Score: " + score
    highestScoreElement.textContent = "Highest Score: " + highestScore
}

function checkWin(){
    for(let i=0; i < 4; i++){
        if(foundation[i].length !== 13){
            return false
        }
    }
    return true
}

function finishGame(){
    stopTimer()
    if(score > highestScore){
        highestScore = score
        localStorage.setItem("highestScore", highestScore)
    }
    updateScore(0)
    messageElement.textContent = "You won! Score: " + score
}

function canAutoWin(){
    if(stock.length > 0 || waste.length > 0){
        return false
    }
    for(let i=0; i<7; i++){
        for(const card of tableau[i]){
            if(card.faceUp === false){
                return false
            }
        }
    return true
    }
}

function autoWin(){
    let count = 0
    for(let i=0; i<7; i++){
        count += tableau[i].length
    }
    updateScore(count * 10)
    finishGame()
}

function undoDraw(){
    if(paused){
        return
    }
    if(canUndoDraw === false || waste.length === 0){
        return
    }
    const card = waste.pop() 
    card.faceUp = false
    stock.push(card)
    canUndoDraw = false
    selected = null
    render()
}

function formatTime(totalSeconds){ // makes the number look nice by adding padStart
    const minutes = Math.floor(totalSeconds/60)
    const sec = totalSeconds % 60
    // adds a 0 in the beginning of the number: example(02:01)
    return String(minutes).padStart(2, "0") + ":" + String(sec).padStart(2, "0")
}

function tick(){ // adds a second and updates the display
    seconds += 1
    timerElement.textContent = "Time: " + formatTime(seconds) 
}

function startTimer(){
    if(timerId !== null){
        return
    }
    timerId = setInterval(tick, 1000)
}
function stopTimer(){
    clearInterval(timerId)
    timerId = null
}

function togglePause(){
    if(timerId === null && !paused){
        return
    }
    if(paused === false){
        stopTimer()
        paused = true
        pausePopUpElement.classList.remove("hidden")
        pauseButtonelement.textContent = "Resume"
    }
    else{
        paused = false
        pausePopUpElement.classList.add("hidden")
        pauseButtonelement.textContent = "Pause"
        startTimer()
    }
}
// Event Listeners
stockElement.addEventListener("click", drawCard)
gameElement.addEventListener("click", handleClick)
newGameButtonElement.addEventListener("click", resetGame)
undoDrawElement.addEventListener("click", undoDraw)
pauseButtonelement.addEventListener("click", togglePause)

// Start the game
highestScore = Number(localStorage.getItem("highestScore"))
newGame()
render()
