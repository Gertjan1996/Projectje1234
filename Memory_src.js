/**
 * 
 */

var startTijd, totaalTijd = 0, aantalTijden = 0;
// StartTijd is de tijd dat het huidige spel begonnen is
// Totaaltijd is de som van de tijd van alle gespeelde spelletjes
// Aantaltijden is het aantal spelletjes 

var firstCard = '', secondCard = '';
// De eerste en tweede kaart die zijn omgedraaid

var karakter;
// Het teken dat op de achterkant van de kaart getoond wordt

let intervalID = 2000;
// De ID voor de timeouts voor het terugdraaien van de kaarten en het bijwerken van de tijdweergave

var numberOfCards;
// Aantal kaarten op het bord

var numberOfCardsLeft;
// Aantal kaarten dat nog op het bord ligt

var topScores = [
    { name: "Barack Obama", time: 200 },
    { name: "Bernie Sanders", time: 300 },
    { name: "Hillary Clinton", time: 400 },
    { name: "Jeb Bush", time: 500 },
    { name: "Donald Trump", time: 600 }
]

function initGame(size) {
    initVars(size);
    vulSpeelveld(size);
    showScores();
}

function initVars(size) {
    // Initialiseer alle benodigde variabelen en de velden op het scherm 
    karakter = $("#character").val();
    numberOfCards = size * size;
    numberOfCardsLeft = numberOfCards;
    setTijden();
}

function vulSpeelveld(size) {
    // Bouw de size x size table speelveld op
    // Elk < td > element van de tabel moet een karakter toegewezen worden
    // Hiervoor kan de nextletter functie gebruikt worden
    // Ook moet de eventlistener cardClicked aan de cell gekoppeld worden en de opmaak juist gezet worden
    let speelveld = document.getElementById("speelveld");
    $(speelveld).empty();
    tblBody = document.createElement("tbody");

    let getNextLetter = new nextLetter(size);

    // cells creation
    for (let j = 0; j < size; j++) {
        // table row creation
        let row = document.createElement("tr");

        for (let i = 0; i < size; i++) {
            // create element <td> and text node 
            //Make text node the contents of <td> element
            // put <td> at end of the table row
            let cell = document.createElement("td");
            cell.className = "inactive";
            cell.addEventListener(
                'click',
                function () { cardClicked(this); },
                false
            );

            let p = document.createElement("p");
            let text = document.createTextNode(getNextLetter());

            p.appendChild(text);
            p.className = "letter"
            cell.appendChild(p);

            p = document.createElement("p");
            text = document.createTextNode(karakter);

            p.appendChild(text);
            p.className = "karakter"
            cell.appendChild(p);
            row.appendChild(cell);
        }

        //row added to end of table body
        tblBody.appendChild(row);
    }

    // append the <tbody> inside the <table>
    speelveld.appendChild(tblBody);

}

function showScores() {
    // Vul het topscore lijstje op het scherm.
    let topScoresList = document.getElementById("topscores");
    $(topScoresList).empty();
    topScores.sort((a, b) => a.time - b.time)
    for (let i = 0; i < 5; i++) {
        let score = topScores[i];
        let item = document.createElement("li");
        let value = document.createTextNode(score.name + ": " + score.time);
        item.appendChild(value);
        topScoresList.appendChild(item);
    }
}

function setTijden() {
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

function getSeconds() {
    let date = new Date();
    let millis = date.getTime();
    return Math.round(millis / 1000);
}

let nextLetter = function (size) {
    let letterArray = "AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ".substring(0, size * size).split('');
    let idx = 0;
    letterArray = shuffle(letterArray);
    return function () {
        let letter = letterArray[idx++];
        return letter;
    }
}

function cardClicked(card) {
    checkStarttijd();
    checkDerdeKaart();
    let draaiKaartOm = turnCard(card);
    if (draaiKaartOm == 2) {
        checkKaarten();
    }
}

function checkStarttijd() {
    // Controleer of de startijd van het spel gezet is, i.e. het spel al gestart was.
    // Als dat niet zo is doe dat nu, en start de timeOut voor het bijhouden van de tijd.
    if (typeof startTijd === 'undefined') {
        startTijd = getSeconds();
        tijdBijhouden();
    }
}

function checkDerdeKaart() {
    // Controleer of het de derde kaart is die wordt aangeklikt.
    // Als dit zo is kunnen de geopende kaarten gedeactiveerd (gesloten) worden.
    if (firstCard != '' && secondCard != '') {
        deactivateCards();
    }
}

function turnCard(card) {
    // Draai de kaart om. Dit kan alleen als de kaart nog niet geopend of gevonden is.
    // Geef ook aan hoeveel kaarten er nu zijn omgedraaid en return dit zodat in de 
    // cardClicked functie de checkKaarten functie kan worden aangeroepen als dat nodig is.

    if (firstCard == card) {
        return 1;
    } else if (firstCard == '') {
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
    $("#timeLeft").animate({ width: "185px" }, 0);
}

function toggleCard(element) {
    // Draai de kaart om, als de letter getoond wordt, toon dan de achterkant en 
    // vice versa. switch dus van active naar inactive of omgekeerd.
    if (element.className == "active") {
        element.className = "inactive"
    } else if (element.className == "inactive") {
        element.className = "active"
    };
}

function checkKaarten() {
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
        $("#timeLeft").animate({ width: "0px" }, intervalID);
    }

}

// De functie tijdBijhouden moet elke halve seconde uitgevoerd worden om te controleren of 
// het spel klaar is en de informatie op het scherm te verversen.
function tijdBijhouden() {
    if (numberOfCardsLeft == 0) {
        endGame();
    }
    else {
        setTijden();
        setTimeout(tijdBijhouden, 500);
    }
}

function endGame() {
    // Bepaal de speeltijd, chekc topscores en doe de overige
    // administratie.
    let speelTijd = getSeconds() - startTijd;
    let naam = prompt("Please enter your name", "");
    updateTopScores(naam, speelTijd);
    showScores();
    totaalTijd += speelTijd;
    aantalTijden++;
}

function updateTopScores(naam, speelTijd) {
    // Voeg de aangeleverde speeltijd toe aal de lijst met topscores
    topScores.push({ name: naam, time: speelTijd });
}

// Deze functie ververst de kleuren van de kaarten van het type dat wordt meegegeven.
function setColor(stylesheetId) {
    let valueLocation = '#value' + stylesheetId.substring(3);
    let color = $(valueLocation).val();
    $(stylesheetId).css('background-color', '#' + color);
}

function setCharacterOnCards(c) {
    paragraphs = [...document.getElementsByClassName("karakterParagraph")];
    paragraphs.forEach(p => p.innerHTML = c);
}

// knuth array shuffle
// from https://bost.ocks.org/mike/shuffle/ 
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
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

$(document).ready(function () {
    $("#opnieuw").click(function () {
        initGame($("#size").val());
    });
    $("#character").change(function () {
        setCharacterOnCards($("#character").val());
    });
});