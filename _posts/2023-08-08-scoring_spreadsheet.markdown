---
layout: post
title:  Scoring Spreadsheet
date:   2023-08-08 17:40:30 -0500
category: scioly
author: lastlegume
tags: scioly
---

Over the past summer, I've been working on a [spreadsheet](https://drive.google.com/drive/folders/1DF87DjKOUex4asVBe3NNlvypM_p7HEZ0?usp=drive_link) that automates many parts of tournament scoring in Science Olympiad, and it's finally finished. From creating a scoresheet for release to generating a slideshow for award ceremonies to making histograms of individual events, the spreadsheet has a lot of useful features for tournaments. Using only raw scores for each event and team names, it can rank every team and event automatically, highlighting ties to be broken manually. It can handle up to 249 teams and 28 events with the ability to choose individual events to be dropped for each team in a manner similar to tournaments like Texas State or just trial certain events easily. The sheets also support participation points, no shows, disqualifications, tiers, and events where the lowest score wins (like Scrambler or Robot Tour). 

Most importantly, I've integrated some app scripts to automate certain processes into sheets, usable through the menu under the file name. Using a template slide, the spreadsheet is able to compile the results for each event into a slideshow, with each slide being updated with the top teams for that event. The format of the slide, how many teams are shown, and the format of the text is all customizable from a custom sidebar. Additionally, another script can generate histograms of the raw scores for each event (this doesn't take tiers into account), while another creates a scoresheet in the format of the national tournament with the option to be ranked by team number or rank.   

I've also chosen to not include automatic tiebreaking; however, ties are marked with red, so they should be easy to fix by adding a decimal to the raw score. I wanted to keep the amount of values to be entered at a minimum, so only raw scores are accepted, thereby making tiebreaking (especially in builds) impossible to do through the sheet.

To see how to use it, check [this link](https://docs.google.com/document/d/1CCglZCkHo_RaGaMjVx0MpuHMKf2cjOdX48RMITGZ7OU/edit?usp=sharing).   

Note: The [spreadsheet made by Chalker](https://sourceforge.net/projects/soscoring/) is similar, is updated to each year's events, and has some unique features, so it is also a good resource to consider for scoring. However, it lacks the template-based automatic award slideshow generation and histogram generation of the Google Sheets spreadsheet shown here. It's also easier to collaborate with a large group of people in Google Sheets than Excel. Use your own discretion to decide which spreadsheet better fits your own needs.  

Because of the way that tiers are calculated, if teams have raw scores above 10000000 (10 million or 10^7) in an event, tiers may no longer function properly. Some parts of the spreadsheet might also be slightly unintuitive due to my wish to prioritize customizability over simplicity. 

### Guide to the custom formats of the slideshow generator

The slideshow generator attempts to provide as much flexibility as possible. As a result, the phrase in the textboxes for placements is customizable using custom formats. 
When writing a custom format for the slideshow generator, everything that is not a special key will remain constant in every text box. A list of the keys is below:  

Key | Meaning
---|---
#N# | Place number (1, 2, 3, etc.)
#P# | Place (1st, 2nd, 3rd, 4th, etc.)
#TN# | Team Number 
#NAME# | Team Name

With these keys, it's possible to easily create simple formats for the slideshow. For example, a format `#P#. #TN# - #NAME#` could be used. With the previous example, if the winning team was Random High School (Team number C5), what would the resulting phrase be?  

<details>
    <summary>Answer</summary>
    1st. C5 - Random High School
</details>




  
