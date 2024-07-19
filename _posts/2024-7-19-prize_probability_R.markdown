---
layout: post
title: An Explanation of the R code from Prize Card Probability 
date:   2024-7-19 1:00:00 -0500
category: pokémon
author: lastlegume
tags: pokémon tcg math
toc: true
---

Recently, I wrote a [post about how one can calculate the probability that a given card has a given number of copies in the prize cards in the Pokémon TCG](/blog/prize_probability). If you haven't read that post, please do because this is merely an explanation of how my R program implements the methods described in the post. As a reminder, the card we are finding the probabilities for is referred to as the target card from here this point on. Without further ado, let's get started. Here is a link to the full [Rmarkdown file](/assets/blog/prizeprobs/prizeProbabilitiesRelease.nb.html) for reference.  
In each case, I collected data on the probabilities of a number of copies of the target being in hand and probabilities of a number of copies being in the prize cards. I also found the probabilities of having 1 to 7 basics in the starting hand in the way.   
I tried to use base R as much as possible, though I chose to use extraDistr to simplify the multivariate hypergeometric distribution. Additionally, this post is meant for people with a basic knowledge of R, but I will try a bit to explain things for those unfamiliar with R. I have also chose to exclude some code, such as instantiation of data frames or variables. As a reminder, *R indexes start at 1 and not 0*.


# Naive Case (Ignoring Basics)

As a reminder, this is the case where we ignore the requirement of having at least one basic in the starting hand. For this reason, the probabilities are slightly different. However, one way I verified that my method was working was by checking these naive results with the cases of having 54 basics or more. In these cases, we are guaranteed to have at least one basic in hand (there are not 7 non-basic cards in deck), so the probabilities should be the exact same as these naive results (and they are).  
If you remember that this method is overly complex, I will include some revised code on how to do it more efficiently.  

```R
handProbs <- data.frame(matrix(0, nrow=59, ncol=8)) # stores the probability that a specific number of copies of the target card are in the starting hand
prizeProbs <- data.frame(matrix(0, nrow=59, ncol=8)) # stores the probability that the a specific number of target cards are in the prize cards
colnames(prizeProbs) <- paste(0:6, "Prized")
colnames(prizeProbs)[8] <- "Expected Number Prized" 
row.names(prizeProbs) <- paste(1:59, "Copy(s) of Card Total")

colnames(handProbs) <- paste(0:7, "In Hand")
row.names(handProbs) <- paste(1:59, "Copy(s) of Card Total")
```
First, we instantiate some data frames to hold the results of our data. Data frames are matrixes, so we instantiated them with 59 rows to hold the case for having any number of copies of the target card between 1 and 59. If we have 0 copies of the target card, then we don't need to check the probabilities, and we cannot have 60 copies of any card (the only type of card we can have more than 4 of is energy, and we need at least 1 basic as well).

```R
for(n in 1:59){ # n is the number of copies of the target card in deck, which must be between 1 and 59
  indivProb <- dhyper(0:(min(n,7)),n,60-n,7) # probabilities that 0 to 7 of the target card are in the starting hand
  for(i in max(n-52,1):min(length(indivProb),8)){ # for every non zero probability of copies of target in hand
      curHandProb <- as.numeric(indivProb[i]) # probability that i copies of the target card are in the starting hand
      handProbs[n,i] <- curHandProb
      curPrizeProb <- dhyper(0:min(n,6),n-i+1,52+i-n,6) # probabilities that 0 to 6 of the target card are in the prize cards (i is 1 when 0 are prized, so it needs to be adjusted by 1)
      for(j in 1:length(curPrizeProb)){ # check every probability that 0 to 6 of the target are prized
          prizeProbs[n,j]<-prizeProbs[n,j]+curHandProb*curPrizeProb[j] # add the probability that that number of target cards are prized AND i target cards are in hand to the probability of having j prized
      }
  }
  for(i in 0:6){
      prizeProbs[n,8] <- prizeProbs[n,8] + prizeProbs[n, (i+1)]*i # calculate expected value of number prized
  }

}

```

This is the method I described to calculate the probabilities of being prized. First, we loop through every possible number of target card from 1 to 59 (n). For each value of n, we first find the probabilities of having 0 to 7 copies in hand, which we can do using `indivProb <- dhyper(0:(min(n,7)),n,60-n,7)`. An important note about dhyper is that we can pass it a vector as x (the first parameter: a vector of quantiles), and it will return a vector of the probabilities for each quantile. So, in this case, it will return a 8 element vector containing the probabilities of having 0 in hand, 1 in hand, up until 7 in hand. The min(n,7) makes sure that we don't do extra work finding the probabilities of having more copies in hand than total.    
The next loop ( `for(i in max(n-52,1):min(length(indivProb),8))` ) checks each of the probabilities found previously, sets curHandProb to that the current probability, and finds the probability of having 0 to min(n,6) copies in the prize cards using `dhyper(0:min(n,6),n-i+1,52+i-n,6)`. As with before, the min function allows us to avoid checking probabilities that we know are going to be 0.    
Then, we iterate over each of these probabilities, adding the probability of both having i copies in hand and j copies in the prize cards to the probability of having j copies prized.   
If we repeat this for all values of i and j, we find the exact probabilities that 0 to 6 copies of a card are prized given that they have n copies in deck because we have found every possible case.       


Additionally, just for fun, I found the expected number of copies of the target card prized, which is just multiplying the probability of i copies being prized by i as shown below.    
```r
for(i in 1:6){
      prizeProbs[n,8] <- prizeProbs[n,8] + prizeProbs[n, (i+1)]*i # calculate expected value of number prized
}
``` 


You can also do this more efficiently with the following code because the order of drawing the hand and prize cards does not matter (see the <a href="/blog/prize_probability">previous post</a>). 
```r
for(n in 1:59){ # n is the number of copies of the target card in deck, which must be between 1 and 59
  prizeProbs[n, ] <- dhyper(0:6,n,60-n,6) # probabilities that 0 to 6 of the target card are in the prize cards
}
```
As you can see, this code implements the method described in my previous post in a relatively simple way. Though overcomplicated, the original method is easy to logically follow and useful in demonstrating the method used later.

# Taking Basics Into Account

Keep in mind that this assumes that the target card is not a basic.   
Since this method uses the multivariate hypergeometric distribution, we first start with generating a matrix of quantiles for the different arrangements of basics, targets, and other cards in the starting hand (referred to as hand arrangements). Important to note is the fact that I have removed all of the code I wrote to find the number of basics in hand. It's pretty self explanatory, and I chose to remove it to remove clutter and because you can easily write the dedicated code to find the probabilities in a couple of lines. 

```r
mat <- matrix(0, nrow=28, ncol=3) # needed for the multivariate hypergeometric distribution 
count <- 0
for(b in 1:7){
  for(t in 0:(7-b)){
    count<- count+1
    mat[count,] <- c(7-b-t, b, t) # adds every combination of basic, target, and other cards that adds up to 7 and has at least one basic to the matrix of quantiles for the distribution later
  }
}
```

We define three different types of cards: basics, targets, and other cards. This loop creates a matrix of combinations of card types that could occur in a valid hand. For this reason, it starts with 1 basic, 0 copies of the target card, and 6 other cards and continues to increase the number of basics and copies of target card until every possible combination of the 3 types of cards that is a valid hand is included (1 basic, 0 targets, 6 other; 1 basic, 1 target, 5 other;...; 7 basics, 0 targets, 0 others). For this reason, the number of basics starts at 1 instead of 0.  

```r
for(b in 1:59){ # b is the number of basics in deck
  for(n in 1:(60-b)){ # n is the number of copies of the target card in the deck
    curHandSuccessProb<-1-dhyper(0,b,60-b,7)
    handCombos<-dmvhyper(mat, c(60-b-n, b, n), 7)/(curHandSuccessProb) # p(having 1...7 basics and 0...6 targets in starting hand)/(1-p(not having basic in starting hand))
     for(c in 1:length(mat[,1])){
      if(handCombos[c]!=0){
        h <- mat[c,3] # number of the target card in hand
        handProbs[n,h+1]<- handProbs[n,h+1]+handCombos[c] # adds to the probability of having h copies of the card in the starting hand
        curPrizeProb <- dhyper(0:6,max(0,n-h),min(53+h-n, 53),6) # actual probabilities for having 0...6 copies of the card prized given that h copies are in hand and n total
        
        for(j in 1:length(curPrizeProb)){ 
          prizeProbs[n,j]<-prizeProbs[n,j]+curPrizeProb[j]*handCombos[c] # add the probability of having j copies prized given that we got this hand arrangement AND getting the hand arrangement of mat[c,] to the total probability of having j copies prized
        }
        
      }
    }
    
  }

  
}
```

We start with a loop for every number of basics from 1 to 59, represented by the value b. We stop at 59 because there needs to be at least one copy of the target card (if there isn't, what are we even doing). A typical number of basics is roughly 8 to 16 (I didn't do any math regarding this, this is just an estimation straight from my head), so anything above 25 is already pretty useless. However, for the sake of completion, I just went ahead and found the probabilities for every possible number of basic.    
For each one of these possible values of b (copies of basics in deck), we check every possible number of copies of the target card, which ends up being from 1 to 60-b copies. Then, we find the probability of getting a hand with at least one basic (which is `1-dhyper(0,b,60-b,7)` ) and adjust all of the probabilities of getting specific hand arrangements (which are found using extraDistr's dmvhyper in `dmvhyper(mat, c(60-b-n, b, n), 7)` ) by dividing them by the probability of having at least one basic in hand. This gives us the conditional probability that we get a specific hand arrangement given that our starting hand has a basic. This is the actual probability of drawing a hand that has a specific combination of the three types cards as your starting hand because you draw hands until you have a hand with at least one basic, meaning that all starting hands must have one basic.   
From here, it's the same as the previous method. If the hand arrangement has a nonzero chance of happening, then we find the probabilities of 0 to 6 copies of the target card being in the prize cards given that the specific hand arrangement occured. I defined h as the number of copies of the target card in the current hand arrangement, so we check the probability of having copies of the target card in the prizes given that there are n-h copies of the target in deck (using `dhyper(0:6,max(0,n-h),min(53+h-n, 53),6)`). Then, just add the probability of having j copies prized multiplied by the probability of getting hand arrangement mat\[c].  
As you can see, this method is extremely similar to the previous method. All that changes is that we switched to finding the probabilities of hand arrangements instead of number of target card copies in hand. By dividing the probabilities of valid hand arrangments by the probability of having a valid hand, we get the actual probability of drawing that arrangement as the starting hand (you can verify this by adding all the adjusted probabilities together, which yields 1), which serves the exact same purpose as the number in hand in the naive method.

# If The Target Is A Basic

This ends up being almost the exact same, but the first difference lies in the creation of the matrix of quantiles mat. Please keep in mind that because of the way I coded it, the number of basics ends up not including the target card, so it really means the number of other basics.

```r
mat <- matrix(0, nrow=36, ncol=3) # needed for the multivariate hypergeometric distribution 
count <- 0
for(b in 0:7){ # since the target card is a basic now, we can also have 0 basics but one target
  for(t in max(0, 1-b):(7-b)){
    count<- count+1
    mat[count,] <- c(7-b-t, b, t) 
  }
}
```

All that is different here is we also find the probabilities of getting hand arrangements that have 0 basics and at least 1 copy of the target card since it is now also a valid hand. 

```r
for(b in 0:59){ # b is the number of other basics in deck
  for(n in 1:min(4,60-b)){ # n is the number of copies of the target card in the deck
    curHandSuccessProb<-1-dhyper(0,b+n,60-b-n,7)
    handCombos<-dmvhyper(mat, c(60-b-n, b, n), 7)/(curHandSuccessProb) # p(having 1...7 basics and 0...7 targets in starting hand)/(1-p(not having basic in starting hand))
    for(c in 1:length(mat[,1])){
      if(handCombos[c]!=0){
        h <- mat[c,3] # number of the target card in hand
        handProbs[n,h+1]<- handProbs[n,h+1]+handCombos[c] # adds to the probability of having h copies of the card in the starting hand
        curPrizeProb <- dhyper(0:6,max(0,n-h),min(53+h-n, 53),6) # actual probabilities for having 0...6 copies of the card prized given that h copies are in hand and there are n total
        
        for(j in 1:length(curPrizeProb)){ 
          prizeProbs[n,j]<-prizeProbs[n,j]+curPrizeProb[j]*handCombos[c] # add the probability of having j copies prized given that we got this hand arrangement AND getting the hand arrangement of mat[c,] to the total probability of having j copies prized
        }
        
      }
    }
    
  }
}
```

Again, almost the exact same code as before. The matrix mat is different in this case as seen above, and the probability of getting a valid hand is `1-dhyper(0,b+n,60-b-n,7)` instead because b does not include the copies of the target card. Aside from those two minor differences, everything else is the same.

# Conclusion

The code shown is a direct implementation of the methods described in the <a href="/blog/prize_probability">previous post</a>. This was a bit of a rushed post, but most of the code is fairly simple and requires no explanation, so I hope you'll forgive the lack of detail. Again, to see the full code, check the [R markdown file](/assets/blog/prizeprobs/prizeProbabilitiesRelease.nb.html). Thanks for reading!