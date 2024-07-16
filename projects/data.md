---
layout: default
title: Random Data Sets
permalink: /datasets/
tools: 7
---
<style>
    h3 > a{
        color: #b5e853;
    }
</style>

# Random Data Sets 

A collection of any datasets and useful csv files I made while working on other projects. I created this page after being unable to find anything online that listed what type of card (Basic, Stage 1, Stage 2, etc.) each pokémon had, so I make these publicly available to save others the trouble I had to go through to create these.

### Pokémon Evolution Lines

Contains each pokémon, what evolution stage they are, and what type of card they are in the TCG right now (so fossils are always stage 1's or over). Data from [PokéAPI](https://pokeapi.co/) and [Pokemon DB](https://pokemondb.net/).  
Columns:
 - **Number**: pokédex number
 - **Name**: name of the pokémon
 - **Evolution Index**: number of times the pokémon has evolved, unless they are a baby pokemon, which is -1. -1 for baby pokémon, 0 for pokémon that are the first stage after a possible baby or do not evolve (i.e. first stage starters, pokemon that evolve once like Archen, or single stage pokémon like Sawk or Walking Wake), 1 for pokémon that have evolved once (i.e. middle stage starters or fully evolved pokémon like Houndoom or Archeops), and 2 for pokémon that have evolved twice (i.e. final stage starters or pokémon like Florges or Stoutland).
 - **TCG Stage**: Which type of pokémon card the card typically is (Basic, Stage 1, Stage 2) currently (in SV block). Fossils start at stage 1 and become a stage 2 when they evolve. Could be inaccurate as it was generated completely automatically.
 - **Is Fossil**: 0 if the pokémon is not a fossil, 1 is the pokémon is a fossil.
 - **Fossil**: `<empty string>`/`""` if the pokémon is not a fossil, FOSSIL if the pokémon is a fossil.   

[Evolution Line Data](https://github.com/lastlegume/lastlegume.github.io/blob/main/assets/blog/prizeprobs/evolutionStages.csv)  


### Pokémon TCG Prize/Hand Probabilities

A table of the probabilities of prizing some number of a specific card given that you have b basics in deck and n copies of that card. Hand probabilities refers to the probability of having some number of copies of a specific card in your starting hand.  
To find the probability:
 - If the card is not a basic, then row (b-1)*60+n contains the probabilities.    
 - If the card is a basic, then row 3536+4*b+n contains the probabilities.    

Row 0 is the headers, so these numbers will work for any programming language that starts at index 0, but will need to be 1 higher for any languages that start at 1.   

Columns are labelled with the leftmost column being 0 in prizes/hand and rightmost being 6 in prizes or 7 in hand.  

[Prize Probabilities](https://github.com/lastlegume/lastlegume.github.io/blob/main/assets/blog/prizeprobs/combinedPrizeProbabilities.csv)  
[Hand Probabilities](https://github.com/lastlegume/lastlegume.github.io/blob/main/assets/blog/prizeprobs/combinedHandProbabilities.csv)  
