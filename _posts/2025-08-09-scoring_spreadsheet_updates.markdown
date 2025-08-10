---
layout: post
title: Updates to the Scoring Spreadsheet
date:   2025-08-09 1:00:00 -0500
category: scioly
author: lastlegume
tags: scioly
---

A bit under two years ago, I publicly released [my scoring spreadsheet](https://drive.google.com/drive/folders/1DF87DjKOUex4asVBe3NNlvypM_p7HEZ0?usp=drive_link), a project that took me several months and many failed iterations to create. A few months later, [Duosmium Scoring](https://scoring.duosmium.org/) came out<a href="#footnote1"><sup id="sup1">[1]</sup></a> (which is more polished than a spreadsheet maintained by a single person busy with competing), and I decided that it probably wouldn't be worth it to keep adding features when a great tool with more consistent support came out. 

Ultimately, however, I kept working on it because a tournament I was involved in used it, and I've added many new features since that initial post. Also, I still think there are advantages to an approach that is done entirely within Google products and the web, not requiring extra accounts or apps like Microsoft Excel to be installed. Many organizations give their employees/students Google accounts, so using only Google makes it as easy as possible for anyone to access a free and easy to use scoring system. Given that, I want to describe some of the new additions both to highlight all of the changes and improvements that have occurred in the past few months.


Changes include:
 - added new set up dialogue to help start using the spreadsheet
    - settings now uses date picker for date in both set up and spreadsheet
 - styled all custom sidebars with CSS
 - updated documentation
    - includes a new description of each permission used, what it's used for, and what happens if the permission is denied
 - separated set up commands from extra actions in menu
 - updated quick commands
 - pale blue indicator added to the trialed events to show what is not being counted towards team scores
 - designed new overall spreadsheet formula using ```indirect``` that is the same for every cell
 - updated the change events script to move sheets if they already exist, meaning that events can be added to any place after scores have already been added
 - change events preserves trial and event supervisor information
 - slide generator now supports multiple template slides that it cycles between and a special slide for overall results
 - slide generator can place each team in the overall results on a separate slide with a custom format for the overall slides
 - overall slides can have a different number of teams than normal events
- added the ability to automatically break team ties using [the National tiebreaker](https://www.soinc.org/scoring-guidelines)
- added automatic resizing method to fit team names
 - support for any number of tiers and a fix to the bug where an empty value for tier was treated as tier 0 (now treats an empty cell as tier 1)
     - this is still susceptible to floating point errors, so if there are scores that are different by a factor of 10^9 in the same tier, then the program could fail to rank them properly. But if scores differ by a billion, then there's probably something wrong with the method of scoring
 - addition of a new event supervisors sheet
     - added the ability to enter in event supervisor emails and create spreadsheets for each event and share with event supervisors so that event supervisors can only access their own event
     - data from individual spreadsheets can automatically be read in
     - supports either the [default spreadsheet](https://docs.google.com/spreadsheets/d/1nZjNN_LYoxAWJE3ar4nA1AzDzaikxdwAY8A52hSHvFw/edit?usp=sharing) or a custom spreadsheet like the [official scoresheets](https://www.soinc.org/scoresheets) for each event (custom spreadsheets require certain ranges to be named as stated in the [documentation](https://docs.google.com/document/d/1CCglZCkHo_RaGaMjVx0MpuHMKf2cjOdX48RMITGZ7OU/edit?usp=sharing))
 - Added error messages to various methods
 - Added validation to extra actions that protect from accidental movements of sheets 
 - Various efficiency increases to scripts, hopefully shortening run time
 - Disabled buttons after use when necessary to prevent problematic double clicking
 - Various other bug fixes




<p><a href="#sup1"><sup id="footnote1">[1]</sup></a> I don't actually know when Duosmium Scoring officially got released; the first I saw of it was several months after my spreadsheet was publicly released (which was about 5 months after I started working intermittently on the spreadsheet), but it really doesn't matter which came first.