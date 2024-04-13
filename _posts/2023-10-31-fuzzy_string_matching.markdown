---
layout: post
title:  A Simple Algorithm for Fuzzy Text Matching
date:   2023-10-31 12:00:00 -0500
category: cs
author: lastlegume
tags: cs javascript
---

<script defer src="/assets/scripts/fuzzy.js"></script>

Exactly as the title states: a simple, javascript based code segment for matching two strings while allowing for some inaccuracy. Because of the method of matching, this segment is O(N^3), so it should not be used if time is an issue. The code is shown below and an interactive example are below:

## Code (Javascript) 

```javascript
function fuzzy(guess, answer) {
    // normalizes the format of the strings (optional)
    guess = guess.toLowerCase().trim();
    answer = answer.toLowerCase().trim();
    // checks if the strings are equals beforehand to skip the iteration if unnecessary
    if (guess === answer)
        return true;
    // variable that holds the number of correct characters
    let score = 0;
    // number of characters back or forwards a substring is allowed to be before being counted as nonexistent.
    var leniencyFactor = 0.5;
    var leniency = Math.ceil(answer.length ** leniencyFactor);
    // factor that controls the amount that can be wrong
    var fuzzyFactor = -0.45;
    var fuzziness = 1 - answer.length ** fuzzyFactor;
    // maximum possible score (subtracts the length of answer because one character substrings are not being checked)
    var neededFuzzyAmount = ((answer.length) * (answer.length + 1) * (answer.length + 2)) / 6 - answer.length;
    //checks substrings of lengths started at the length of the guess to a length of 2 
    for (let i = guess.length; i >= 2; i--) {
        //moves through the guess string to find all substrings of length i
        for (let s = 0; s <= (guess.length - i); s++) {
            //checks the substrings of guess with equal length substrings in answer from the same index - leniency to the same index + leniency
            for (let a = Math.max(0, s - leniency); a <= Math.min(s + leniency, answer.length - i); a++) {
                // if the substrings are equal, adds the number of correct characters (the length of the substring) to the score
                if (guess.substring(s, s + i) === answer.substring(a, a + i)) {
                    score += i;
                }
            }
            // if a high enough score is reached, it skips the rest of the program
            if (score > neededFuzzyAmount ** fuzziness)
                return true;
        }
    }
    return score > neededFuzzyAmount ** fuzziness;
}
```

## Try It Yourself

Guess: <input type = "text" id = "guess">
Answer: <input type = "text" id = "answer">

<button id = "check" >Check</button><br>
<p id="reply"></p>


<input type="checkbox" id = "exponentialCheck" checked>Use default exponential models (uncheck if you want to manually set leniency and fuzziness) 

<div class = "exponential">

<h3> Fuzzy Factor: </h3>
Factor controlling the amount that can be wrong (almost anything matches when at 0, gets stricter as it decreases)
<br>
<input type = "range" id = "fuzzyf" min = "-2" max = 0 step = ".05" value = "-0.45"><br>
Value: <output id = "fuzzyFIndicator"></output>


<h3> Leniency Factor: </h3>
Factor that affects the leniency (most lenient at 1, least lenient at 0)<br>
<input type = "range" id = "leniencyf" min = 0 max = 1 step = ".05" value = "0.5"><br>
Value: <output id = "leniencyFIndicator"></output>

</div>

<div class = "manual" style = "display:none;">
  
<h3> Fuzziness: </h3>
Controls the amount that can be wrong (0 being that almost anything matches, 1 being that only the exactly correct string works)<br>
<input type = "range" id = "fuzzy" min = 0 max = 1 step = ".05" value = "0.6"><br>

Value: <output id = "fuzzyIndicator"></output>


<h3> Leniency: </h3>
Number of characters away from the correct location a substring can be while still being counted (0 means that substrings must be in the exact same location between both strings)<br>
<input type = "range" id = "leniency" min = 0 max = 6 step = 1 value = 2><br>

Value: <output id = "leniencyIndicator"></output>

</div>

<br>