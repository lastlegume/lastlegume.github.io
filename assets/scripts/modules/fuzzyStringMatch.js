function fuzzy(guess, answer) {
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