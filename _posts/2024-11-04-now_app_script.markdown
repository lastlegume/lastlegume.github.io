---
layout: post
title: Do Google Apps Scripts update cells with time dependent functions like now() when the spreadsheet is closed?
date:   2024-11-04 1:00:00 -0500
category: Apps script
author: lastlegume
tags: cs spreadsheets apps_script
---

Yes. Or at least, as of November 2024, the answer appears to be yes.   

First, let's set up the problem. Let's say that I have an Apps Script on a [spreadsheet](https://docs.google.com/spreadsheets/d/197LescivqlE4TWGDbm3ZTTJyzIhax1ghI4AfTEX03Co/edit?usp=sharing) that gets the first sheet and copies the value in a cell to another cell each hour (done using a time-driven trigger). What happens if the value in this cell is ```now()``` (or some other equivalent function that changes with time) and the spreadsheet is completely closed? Similarly, what if the script copies a cell whose value is a modification of a cell that has a function like ```now()```? Will it update the value for ```now()``` and the cell that modifies it when the trigger runs the script while the spreadsheet is closed, or does the spreadsheet have to be opened for the value of ```now()``` to update?    

From my [test spreadsheet](https://docs.google.com/spreadsheets/d/197LescivqlE4TWGDbm3ZTTJyzIhax1ghI4AfTEX03Co/edit?usp=sharing), the answer to both is yes. The function test, replicated below, was run using a time-driven trigger every hour, copying a cell with ```now()``` and a cell that relied on the cell with ```now()``` into a new column. 

```js
function test() {
  let ss = SpreadsheetApp.openById("197LescivqlE4TWGDbm3ZTTJyzIhax1ghI4AfTEX03Co");
  let sheet = ss.getSheets()[0];
  let val = sheet.getRange(1,1).getValue();
  sheet.getRange(1,1).setValue(++val);
  sheet.getRange(3,val).setValue(sheet.getRange(2,2).getValue());
  sheet.getRange(4,val).setValue(sheet.getRange(2,2).getFormula());

  sheet.getRange(6,val).setValue(sheet.getRange(5,2).getValue());
}
```

As you can see, the script, which has been running for weeks without being opened by me, has copied the value of ```now()``` as they were when it ran, not when the spreadsheet last opened. Likewise, for the cell that modified ```now()```, its values are also correct. This is the expected behavior, but I couldn't find confirmation anywhere, so I tested this to make sure before I relied on something with a potential flaw like this.    

I work with Apps Scripts a fair amount, so I've struggled to find answers to questions like this a few times, so I wanted to create a few posts about niche questions like this in the hope that someone eventually can use this to answer the same question. I had a pretty sensitive script that relied on this question, and I couldn't find anything that answered it, so I thought I would write something in the hopes that someone with a similar question in the future doesn't have to test it themselves like I had to. 