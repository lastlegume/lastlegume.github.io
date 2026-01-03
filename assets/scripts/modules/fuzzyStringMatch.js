function fuzzy(guess, answer) {
    return levenshteinDistance(guess, answer)<4;
}

//uses the full matrix approach instead of just using two rows
function levenshteinDistance(guess, answer){

    let mat = Array(guess.length+1).fill().map(()=>Array(answer.length+1));
    for(let i = 0;i<=guess.length;i++)
        mat[i][0] = i;
    for(let i = 1;i<=answer.length;i++)
        mat[0][i] = i;

    for(let r=1;r<mat.length;r++){
        for(let c = 1;c<=answer.length;c++){
            let substitutionCost = (guess.charAt(r-1)==answer.charAt(c-1))?0:1;
            mat[r][c] = Math.min(mat[r-1][c-1]+substitutionCost, mat[r-1][c]+1, mat[r][c-1]+1);
        }
    }
    
    return mat[guess.length][answer.length];
}







function oldFuzzy(guess, answer) {
    guess = guess.toLowerCase().trim();
    answer = answer.toLowerCase().trim();
    // checks if the strings are equals beforehand to skip the iteration if unnecessary
    if (guess === answer)
        return true;
    // variable that holds the number of correct characters
    let score = 0;
    //number of characters back or forwards a substring is allowed to be before being counted as nonexistent.
    var leniency = Math.ceil(answer.length ** .5);

    var fuzziness = 1 - answer.length ** -.45;
    //maximum possible score
    var neededFuzzyAmount = ((answer.length) * (answer.length + 1) * (answer.length + 2)) / 6 - answer.length;
    for (let i = guess.length; i >= 2; i--) {
        for (let s = 0; s <= (guess.length - i); s++) {
            for (let a = Math.max(0, s - leniency); a <= Math.min(s + leniency, answer.length - i); a++) {
                if (guess.substring(s, s + i) === answer.substring(a, a + i)) {
                    score += i;
                }
            }
            if (score > neededFuzzyAmount ** fuzziness)
                return true;
        }
    }
    //   console.log(score + " vs needed " + neededFuzzyAmount ** fuzziness)
    return score > neededFuzzyAmount ** fuzziness;
}


