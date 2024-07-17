---
layout: default
title: Pokemon TCG Deck Probabilities
permalink: /deck-probs
tools: 6
---

<style type="text/css" media="screen">
    .card{
        width:75px;
        height: 150px;
        border: 3px solid silver;
        display: inline-block;
        vertical-align: top;
        padding: 8px 3px;
        margin-right: 5px;
        margin-bottom: 5px;
        border-radius: 15px;
        text-align: center;
        font-size: smaller;
    }
    .highlight{
        border: 3px solid yellow;
        background-color: rgba(255,255,0,.3);

    }
    .btn{
        margin: 10px 0px;
    }
    


</style>
<script src="/assets/scripts/deckProbabilities.js" defer></script>

# Pokémon TCG Deck Probabilities

### Enter in the decklist

Accepts the PTCGL and Limitless export format. Once you have inputted the deck, click on a card to see probabilities for it. Because of certain limitations, some cards may rarely be incorrectly matched as a Stage 1, Stage 2, or Basic. If a card is marked as a basic and is not (or vice versa), select the card and press the button below the probabilities to correct it as the number of basics in deck is important to finding the correct probability.   

<label>Deck Name: <input type="text" value="" id="name"></label>
<textarea id="input" name="input" rows="15" cols="120"></textarea><br>
<button class = "btn btn-submit" id = "add">Add deck</button><br>
<select id = "deckList">
    <option selected ="true" disabled="true" hidden>Choose A Deck</option>
</select>
<div id="decks">

</div>
<div id="exactOutput">

</div>
<button class = "btn btn-submit hide" id="toggleBasic">This should be a basic</button><br>
<button style="margin-top: 60px;" class="btn small" id="clearStorage">Clear local decks</button><br>
