/**
 * 
 */
var startTijd, totaalTijd = 0, aantalTijden = 0;
// StartTijd is de tijd dat het huidige spel begonnen is. 
// Totaaltijd is de som van de tijd van alle gespeelde spelletjes, aantaltijden is het aantal spelletjes 
var firstCard, secondCard;
// De eerste en tweede kaart die zijn omgedraaid.
var karakter;
// Het teken dat op de achterkant van de kaart getoond wordt
var intervalID,tijdID;
// De ID's voor de timeouts voor het terugdraaien van de kaarten en het bijwerken van de tijdweergave

var numberOfCards;
// Aantal kaarten op het bord
var numberOfCardsLeft;
// Aantal kaarten dat nog op het bord ligt
var topScores = [
                 {name:"Barack Obama", time:200},
                 {name:"Bernie Sanders", time:300},
                 {name:"Hillary Clinton", time:400},
                 {name:"Jeb Bush", time:500},
                 {name:"Donald Trump", time:600}
                 ]


function initGame(size) { 
	initVars(size);
	vulSpeelveld(size);
	showScores();
}

function initVars(size){
	// Initialiseer alle benodigde variabelen en de velden op het scherm 
	setTijden();
	showScores();
	getSeconds();
}
function vulSpeelveld(size){
	// Bouw de size x size table speelveld op. Elk <td> element van de tabel
	// moet een karakter toegewezen worden. Hiervoor kan de nextletter functie
	// gebruikt worden. Ook moet de eventlistener cardClicked aan de cell gekoppeld worden
	// en de opmaak juist gezet worden.
	var getletter = new nextLetter(size);
	var speeldveld = documennt.getElementsByID("speelveld");
	$(speeldveld).empty();
	speelveldbody = document.createElement("speelveldbody");
	for(var rows = 0; rows <size;rows++){
		var tr = document.createElement("tr");
		for(var coloms = 0; coloms<size;coloms++ ){
			var td = document.createElement("td");
				td. className = "inactive";
				td.addEventListener('click',
					function(){cardClicked(this);},
					false
				);
				let cards = document.createElement('cards');
				let text = document.createTextNode(getletter());
				cards.appendChild(text);
				cards.className  = 'letterParagragh'
				td.appendChild(cards);
				cards = document.createElement("cards");
				 text = document.createTextNode(karakter);
				 cards.appendChild(text);
				 cards.className = 'karakterParagragh';
				 td.appendChild(cards);	
				 tr.appendChild(td)
		}
			speelveldbody.appendChild(tr);
	}
	speelveld.appendChild(speelveldbody);
}
/*function addcard(){
 
	
	let cards = document.createElement('p');
	 let text = document.createTextNode(getletter());
	 cards.appendChild(text);
	 cards.className  = 'letterParagragh'
	 tr2.appendChild(cards);
	 cards = document.createElement("p");
		text = document.createTextNode(karakter);
		cards.appendChild(text);
		cards.className = 'karakterParagragh';
		tr2.appendChild(cards);	

}*/
function clearGrid(){
	$(".grid").remove();
}
function refreshGrid(){
	var z = prompt("how many boxes per side?");
	clearGrid();
	createGrid(size);
}	

function showScores(){
	// Vul het topscore lijstje op het scherm.
	let topScoresList = document.getElementById("topscore");
	$(topScoresList).empty();
	topScores.sort((a,b) => a.time - b.time)
	for (let i =0;i<5;i++){
			let score = topScoresList[i];
			let item = document.createElement("li");
		let waarde = document.createTextNode(score.name+":"+ score.time);
			item.appendChild(waarde);
			topScoresList.appendChild(item);	
	}
	
}

function setTijden(){
	// bereken de verlopen tijd, de gemiddlede tijd en het verschil tussen 
	// de huidige speeltijd en de gemiddelde tijd en vul de elementen in de HTML.
	// Vul ook het aantal gevonden kaarten
	let verlopenTijd = (typeof startTijd === "undefined") ? 0 : getSeconds() - startTijd;
	let verlopenTijdSpan = document.getElementById("tijd");
	verlopenTijdSpan.innerHTML = verlopenTijd;

	let gevondenParen = (numberOfCards - numberOfCardsLeft) / 2;
	let gevondenParenSpan = document.getElementById("gevonden");
	gevondenParenSpan.innerHTML = gevondenParen;

	let gemiddeldeTijd = (aantalTijden === 0) ? 0 : Math.round(totaalTijd / aantalTijden);
	let verschilGemiddeldeTijd = (typeof startTijd === "undefined") ? 0 : (getSeconds() - startTijd) - gemiddeldeTijd;
	let gemiddeldSpan = document.getElementById("gemiddeld");
	let sign = (verschilGemiddeldeTijd >= 0) ? "+" : "";
	gemiddeldSpan.innerHTML = gemiddeldeTijd + "s (" + sign + verschilGemiddeldeTijd + "s)";
}


function getSeconds(){
	// Een functie om de Systeemtijd in seconden in plaats van miliseconden 
	// op te halen. Altijd handig.
	let datum = new Date();
	let millisecond = datum.getTime();
	 
	var afrond = Math.round(millisecond/1000);
	return afrond;
}

var nextLetter = function(size){
	var letterArray = "AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ".substring(0,size*size).split('');
	var idx=0;
	letterArray=shuffle(letterArray);
	return function() {
		var letter = letterArray[idx++]; 
		return letter;
	}
} 

function cardClicked(card) {}
	checkStarttijd();
	checkDerdeKaart();
	var draaiKaartOm = turnCard(card);
	if (draaiKaartOm==2){
		checkKaarten();
	}
const deck = document.querySelector(".deck");
function startGame(){
		var shuffledCards = shuffle(cards);
		for (var i= 0; i < shuffledCards.length; i++){
      [].forEach.call(shuffledCards, function(item){
         deck.appendChild(item);
      });
		}
}
window.onload = startGame();
function checkStarttijd(){
	// Controleer of de startijd van het spel gezet is, i.e. het spel al gestart was.
	// Als dat niet zo is doe dat nu, en start de timeOut voor het bijhouden van de tijd.
	if (typeof startTijd === 'undefined') {
		startTijd = getSeconds();
		tijdBijhouden();
	}
}

function checkDerdeKaart(){
	// Controleer of het de derde kaart is die wordt aangeklikt.
	// Als dit zo is kunnen de geopende kaarten gedeactiveerd (gesloten) worden.
	if (firstCard != '' && secondCard != '') {
		deactivateCards();
	}
}

function turnCard(card){
	// Draai de kaart om. Dit kan alleen als de kaart nog niet geopend of gevonden is.
	// Geef ook aan hoeveel kaarten er nu zijn omgedraaid en return dit zodat in de 
	// cardClicked functie de checkKaarten functie kan worden aangeroepen als dat nodig is.
	if (firstCard == card) {
		return 1;
	} else if (firstCard == '' ) {
		firstCard = card;
		toggleCard(card);
		return 1;
	} else if (secondCard == '') {
		secondCard = card;
		toggleCard(card);
		return 2;
	}

	return 0;
}

function deactivateCards() { 
	// Functie om de twee omgedraaide kaarten weer terug te draaien
	firstCard.className = "inactive"
	firstCard = '';
	secondCard.className = "inactive";
	secondCard = '';
	$("#timeLeft").animate({width: "185px"}, 0);
}

function toggleCard(element) {
	// Draai de kaart om, als de letter getoond wordt, toon dan de achterkant en 
	// vice versa. switch dus van active naar inactive of omgekeerd.
	/*this.classList.toggle("open");
   this.classList.toggle("show");
   this.classList.toggle("disabled");
	*/
	if (element.className == "active") {
		element.className = "inactive"
	} else if (element.className == "inactive") { 
		element.className = "active"
	};
	}

function checkKaarten(){
	// Kijk of de beide kaarten gelijk zijn. Als dit zo is moet het aantal gevonden paren 
	// opgehord worden, het aantal resterende kaarten kleiner worden en ervoor  
	// gezorgd worden dat er niet meer op de kaarten geklikt kan worden. De kaarten
	// zijn nu found.
	// Als de kaarten niet gelijk zijn moet de timer gaan lopen van de toontijd, en 
	// de timeleft geanimeerd worden zodat deze laat zien hoeveel tijd er nog is.
	let firstCardLetter = firstCard.childNodes[0].innerText;
	let secondCardLetter = secondCard.childNodes[0].innerText;
	if (firstCardLetter == secondCardLetter) {
		firstCard.className = "found";
		secondCard.className = "found";
		firstCard = '';
		secondCard = '';
		numberOfCardsLeft -= 2;
	} else {
		setTimeout(deactivateCards, intervalID);
		$("#timeLeft").animate({width: "0px"}, intervalID);
	
}

// De functie tijdBijhouden moet elke halve seconde uitgevoerd worden om te controleren of 
// het spel klaar is en de informatie op het scherm te verversen.
function tijdBijhouden(){
	if (numberOfCardsLeft==0) {
		endGame();
	}
	else{
		setTijden();
	// Roep hier deze functie over 500 miliseconden opnieuw aan		
	}
}

function endGame(){
	// Bepaal de speeltijd, chekc topscores en doe de overige
	// administratie.
}

function updateTopScores(speelTijd){
	// Voeg de aangeleverde speeltijd toe aal de lijst met topscores
}

// Deze functie ververst de kleuren van de kaarten van het type dat wordt meegegeven.
function setColor(stylesheetId) {
	var valueLocation = '#value'+stylesheetId.substring(3);
	var color = $(valueLocation).val();
	$(stylesheetId).css('background-color', '#'+color );
  }

// knuth array shuffle
// from https://bost.ocks.org/mike/shuffle/ 
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

$(document).ready(function(){
    $("#opnieuw").click(function(){
        initGame($("#size").val());
    });
});


