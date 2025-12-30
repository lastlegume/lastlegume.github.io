---
layout: post
title: LaTeX gradetables based on section names with the exam class
date:   2025-11-08 1:00:00 -0500
category: latex
author: lastlegume
tags: latex scioly
---
<!-- Thank you Stack Overflow! https://stackoverflow.com/questions/8160514/is-there-css-for-typesetting-the-latex-logo-in-html -->
<style type="text/css" media="screen">
.tex sub, .latex sub, .latex sup {
      text-transform: uppercase;
    }

    .tex sub, .latex sub {
      vertical-align: -0.5ex;
      margin-left: -0.1667em;
      margin-right: -0.125em;
    }

    .tex, .latex, .tex sub, .latex sub {
      font-size: 1em;
      font-family: Times New Roman;
    }

    .latex sup {
      font-size: 0.85em;
      vertical-align: 0.15em;
      margin-left: -0.36em;
      margin-right: -0.15em;
    }
</style>

I love <span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>, as is probably apparent based on the content of this site. I write all of my exams in <span class="latex">L<sup>a</sup>T<sub>e</sub>X</span> for many reasons (citation coming soon!), primarily because I find it faster to write in, nicer looking, and more feature rich. Additionally, <span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>, and the [exam class](http://mirrors.ctan.org/macros/latex/contrib/exam/examdoc.pdf) specifically, avoids a very common pitfall that I used to see a lot as a test reviewer - people updating their tests but not their keys or vice versa, requiring another round of revisions each time.  

But anyways, over time, I've grown less and less satisfied with the standard exam class gradetable. This post applies to both grade and pointtables, as well as their multirow/column varieties, but for the rest of the post, I'll just refer to them as gradetables. I typically write exams with over a hundred questions, mostly low valued multiple choice questions, so making gradetables by question doesn't work for me, and gradetables by page are less intuitive, although they are convenient for grading. But on a class set test for example, the page gradetable is not very useful for anyone, not providing competitors with much more than the total number of points. You could just user very few questions with many parts, but with exams with many multiple choice questions, I find the alphabetical numbering to be confusing, and you still don't give competitors information about what each question is on. For example, for Science Olympiad tests for an event like Water Quality, you might want to indicate how many points are in each of the three sections. Similarly, some station writers name their stations, so the gradetable should say how many points each station is worth.

So what we really seem to want is **a gradetable that displays the number of points in each section**. This gradetable should maintain the normal characteristics of gradetables, automatically updating with new questions, but should display scores by section name instead of question or page number. 

I'll explore two different approaches to doing this, both with (in my opinion) some noticeable drawbacks. Additionally, we will be staying entirely within the exam class, so this post won't talk about what is likely the simplest solution for someone experienced with <span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>, which would be to just modify the exam class a bit to include these features.  

This post is somewhat technical, so if you're only interested in the implementation, scroll to [the end of the post](#better) and read the instructions on how to use this. 

## First (worse) method

The first idea I had was to use grading ranges with a custom command for sections. I used stations for all of my commands here, but stations and sections are functionally identical anyways so the names don't really matter. Importantly, `section` is already defined as a counter, so you can't name any of your commands or counters `section` because of the article class, which has already defined `\section` and the counter `section`. From here on, I'll just refer to sections as stations for this method since it's simpler.

This solution uses [arrayjobx](http://mirrors.ctan.org/macros/generic/arrayjobx/arrayjob.pdf) and [multido](http://mirrors.ctan.org/macros/generic/multido/multido-doc.pdf), so you need to add those to the preamble to make this work. Additionally, note that all code written here will be in the preamble.

```latex
\usepackage{arrayjobx}
\usepackage{multido}

\newarray\stations
\newarray\stationPoints
\newcounter{stationCounter}
```

Then, we define a new array to hold the station names and station point values. These will be automatically filled. I also made a counter for the stations so the header for each station automatically updated which number it was. 

```latex
\newcommand{\station}[2]{
\newpage
\stepcounter{stationCounter}
\fullwidth{\section*{Station \arabic{stationCounter}: #1}}
\begingradingrange{#1}
#2
\endgradingrange{#1}
\stations(\thestationCounter)={#1}
\stationPoints(\thestationCounter)={\pointsinrange{#1}}
}
```

The most important part of this method is the custom function `\station{name}{questions}`. It first starts a newpage (which is optional but looks cleaner and is generally preferred in my opinion) and adds 1 to the counter. Counters start at 0, so stepping the counter first makes the first station be number 1. You could move this and make the first station be numbered 0, but that doesn't seem too useful unless it's a computer science exam :). Then, we create a section header with `\section*` (again, this is preference, but I prefer not having automatically numbered sections) with the first argument and start a grading range of the same name as the station. Inside this section, we place the second argument, and then immediately after, we close the grading range. 

You might be thinking something along the lines of "doesn't that mean that questions can be hundreds of lines?" and that is correct. This is a minor annoyance with this method, although not the worst of our issues as we will see later. It's pretty simple and easy to just wrap all of your questions with braces ( `{}` ) to make it an argument, so this isn't the biggest drawback. After ending the grading range, we simply set the station array (which is 1-indexed, so if you switched the stations to start at 0, you need to add 1 to the counter using `\numexpr`) at index `stationCounter`  to the name of the station and `stationPoints` at the same index to the number of points using the exam class's `\pointsinrange`.

Overall, this command takes in the name of the station and all of the questions in the station and creates a header and grading range with the station name, placing all questions inside this range, and storing the name and points in an array.

```latex
\newcommand{\stationgradetable}{
\begin{center}    
    \begin{tabular}{|c|c|}
    \hline
       Section: & Points:  \\
       \hline
       \begingroup
         \let\\\relax
         \let\stations\relax
         \let\stationPoints\relax
       \let\hline\relax
       \multido{\i=1+1}{\thestationCounter}{
       \xdef\lstations{\lstations
       \stations(\i) & \stationPoints(\i)\\ \hline}}
       \endgroup
       \lstations
    \end{tabular}
\end{center}
}
```

Now, we define a new command that loops over the array to produce a table. This code is from an example in the documentation for arrayjobx with some variables changed and generates a table with all of the station names in one column and all of the station point values in the other. So this seems like exactly what we want, besides the fact that this only works with a single column and is vertical (both of which could probably be changed), right?

This seems fine on first glance, but it has a huge flaw that makes it impossible to recommend which is that **`\stationgradetable` must go after all questions were written** (i.e. on the last page). This goes against a big part of the motivation for this section/station grade table and is thus a fatal flaw. I include this in the post, however, because I think it is the cleanest approach if one wanted to modify the .cls file for the exam class. The exam class already needs 2 runs to generate the gradetable, so if you could implement this in the class file to store the point values in the first run then draw the table on the second run, this would work well and most likely be ideal solution. I haven't checked the .cls file for the exam class too closely, but I would guess (and vaguely remember reading something about this) that the class itself does something similar with the normal gradetable, summing points in the first run and then drawing it on a subsequent run (which can take up to 4 runs for a gradetable based on pages).

For now though, I don't know how to write use LaTeX2e and don't have time to learn and edit the class file myself, although I probably will at some later date, so we will have to work within the exam class and do our best. And fortunately, the other method presented next is significantly better with only one (minor) drawback.

## Second (much better) method 

In this method, we use my first idea, which is to fake section titles with titled questions. This has the added bonus of not needing extra packages. All of this is in the preamble as before.


```latex
\newcounter{sectionCounter}

\renewcommand{\thepartno}{\arabic{partno}}
\renewcommand{\partlabel}{\thepartno.}

\renewcommand{\thesubpart}{\alph{subpart}}
\renewcommand{\subpartlabel}{(\thesubpart)}

\renewcommand{\thesubsubpart}{\roman{subsubpart}}
\renewcommand{\subsubpartlabel}{\thesubsubpart.}

%Fixes part spacing
\renewcommand{\partshook}{
    \setlength{\leftmargin}{0pt}
    \setlength{\labelwidth}{-\labelsep}
}
```

Like before, we create a new counter the section number. However, unlike before, I also redefine parts, subparts, and subsubparts to look like the type one above them (e.g. parts look like questions, subparts look like parts, subsubparts look like subparts). The reason for this will be apparent very soon. However, we also need to redefine the parts hook to reduce the margin for parts so that we can pass off parts as questions as the redefinitions above suggest. You could also achieve a similar effect with the uplevel environment, as my first version of this post did, but this will run into issues for multipage long sections because uplevel environments are not able to have page breaks within them.


```latex
\newcommand{\qsection}[2]{
    \newpage
    \stepcounter{sectionCounter}
    \fullwidth{\section*{Section \arabic{sectionCounter}: #1}}

    \titledquestion{#1}
    \vspace{-1em}
    \begin{parts}
        #2
    \end{parts}
}

\qformat{}
```

Then, we define a new command `\qsection` (although there are many better names for this) which, like before, starts a new page and creates a section header with the counter and the name of the section. However, it then creates a title question with the name of the section as the title and begins a parts environment. Next, we insert the questions, which are again an argument, into the parts, and close everything and end the command. This simple command does almost everything, but we do one more thing, which is defining the format of the questions ( `\qformat` ) to be blank. This does have a side effect of not letting you use questions, but with this system, you shouldn't ever anyways.

From here, simply using the built in gradetable command works! If you use the argument `questions`, then it will create a gradetable with the section names as titles instead of question numbers. For example, `\multicolumnpointtable{3}[questions]`.

This has the obvious, and pretty annoying, drawback that you have to use `\part` when you want to add a new question, `\subpart` to add a new part, and so on. Additionally, the numbering for "questions" will reset after each station since they are secretly just parts of a fake titledquestion. I'm not sure that this second part is even a bad thing though, as somethimes you would want the questions to restart at each new section (for example, for a exam with multiple stations). However, I have a workaround for both of these with a single fix - simply define a new wrapper command for (sub)parts that adds to a new counter, and number parts based on this counter. For example, 

```latex
\newcounter{questionNumber}
\renewcommand{\thepartno}{\arabic{questionNumber}}

\newcommand{\q}{
    \stepcounter{questionNumber}
    \part
}
```

This is a very minimal example, but it gets the point across. We make a new counter which stores the current question number, and then set the part number to be the number of that counter. Under the hood, the exam class stores what it thinks the part number should be in a counter (which is what we used in the previous section), but we can just create our own counter and tell the exam class to use that instead. This way, the question number will not reset after each section. Then, we create a new command called `\q` (again, really bad name, but some other class has already taken `\question` from us, so options are limited). `\q` just increments the question counter and creates a part. 

Note how we don't take a parameter for the point value of the question. My first attempt did, but I realized that if you write the brackets after `\q` as you would with a `\question` (e.g. `\q[1]`), it'll work anyways because all that it's doing behind the scenes is expanding the command, and after expansion, as long as `\part` is the last thing in the command, the bracketed points will end up right after `\part` anyways. 

Alternatively, you could add an argument to `\q` and instead define it as `\newcommand{\q}[1][<default point value>]` and add a reference to `#1` by changing it to `\part[#1]`. Here's an implementation of how you might do that. 

```latex
%Alternate version - forces every part to have a point value, but lets you set a default point value
\newcommand{\q}[1][
    1 % This is our default point value - change it to whatever you want
    ]{
    \stepcounter{questionNumber}
    \part[#1]
}
```

This allows you to set a default point value, but has the downside of forcing everything to have a point value, which may not be ideal for a question with parts where you want to give the parts point values. 

Overall, this solution is much better than the other one, and works reasonably well. In fact, it would be difficult to tell that these were secretly parts if you were just looking at the final pdf, so I measure that as a success. The only real limitation with this method is the fact that you cannot use normal questions anywhere anymore. Additionally, if you want questions to be outside of a section, then they won't be titled and will instead appear with a number. But both of these seem useless to me - why would you need normal questions anymore when you have the `\q` command to do the same thing, and why would you want questions that aren't a part of a section? Regardless, these are real drawbacks to consider. I'm glad to say everything else that I've noticed like the question numbering and use of parts has a reasonably easy fix/workaround.

Now, we'll discuss how to use it, although it should already be apparent from the description of how it works.

<h2 id="better"> Using the better method in a test </h2>

Here's [a link to an Overleaf project with the better method](https://www.overleaf.com/read/vhpbkbzbbdgt#be8181). It's built upon my [my template](https://www.overleaf.com/latex/templates/science-olympiad-test-template/bmwwkvsbhkhj) since I wanted a template for this example, but otherwise it's quite simple. Everything mentioned here is reproduced in code, and writing questions remains simple. Let's take the first section as an example.

```latex
\qsection{History}{
    \q[2] What language is this?
    \begin{subparts}
        \subpart[4] Who created this language??
        \begin{subsubparts}
            \subsubpart[1] How do you know?
        \end{subsubparts}
    \end{subparts}
    \q[2] Where was it made?
    \q[2] Why?
}
```

There are only a few differences between this and a normal exam class file. First, sections are started with `\qsection{name}{` (note the open brace). Then, we place all of our questions, which use the custom command `\q`, inside of this open brace as the second argument for `\qsection` and close the brace after writing all of our questions. You could redefine the subparts environment name and subpart command pretty easily, and here's s how you could redefine the subparts/subsubparts to another more sensical name (you can't use `\part` because the exam class defines that). As before, all of this goes in the preamble. I apologize in advance for the terrible naming convention.

```latex
\newcommand{\p}{
    \subpart
}

\newcommand{\subp}{
    \subsubpart
}

\newenvironment{qparts}
    {\begin{subparts}}
    {\end{subparts}}

\newenvironment{qsubparts}
    {\begin{subsubparts}}
    {\end{subsubparts}}
```

The example given above would thus be rewritten as

```latex
\qsection{History}{
    \q[2] What language is this?
    \begin{qparts}
        \p[4] Who created this language??
        \begin{qsubparts}
            \subp[1] How do you know?
        \end{qsubparts}
    \end{qparts}
    \q[2] Where was it made?
    \q[2] Why?
}
```

which is quite a bit more intuitive. As a reminder, this is in [the linked Overleaf project](https://www.overleaf.com/read/vhpbkbzbbdgt#be8181) and can be copied if desired. I would recommend against copying this file though and would instead recommend that you copy only the part in the preamble that tells you to copy it (it's about 60 lines, starting on line 25 as of writing this, and also reproduced below). As you can see, it's very simple to use, having only a few minor differences from the typical exam class that mostly amount to using slightly differently named commands and environments. You can also rename these to anything you can very easily, and I would recommend this, as my names are mostly meant as a proof of concept.

I hope you found this useful, or at the very least somewhat interesting. I know that I will definitely be trying this on future exams, and I hope it ends up being useful to you as well!




Edit: In the interest of convenience, I've reproduced the section I recommend copying into the preamble here. So if you want to use this, just copy the code below into the preamble and start writing!

Note: this reproduced code omits the `\newpage` in `\q` to make it more easily fit into other tests. It's easy to add back in if desired though

```latex

\newcounter{sectionCounter}
\newcounter{questionNumber}

\renewcommand{\thepartno}{\arabic{questionNumber}}
\renewcommand{\partlabel}{\thepartno.}

\renewcommand{\thesubpart}{\alph{subpart}}
\renewcommand{\subpartlabel}{(\thesubpart)}

\renewcommand{\thesubsubpart}{\roman{subsubpart}}
\renewcommand{\subsubpartlabel}{\thesubsubpart.}

%Fixes part spacing
\renewcommand{\partshook}{
    \setlength{\leftmargin}{0pt}
    \setlength{\labelwidth}{-\labelsep}
}


% Change \qsection to whatever name you want
\newcommand{\qsection}[2]{
    \stepcounter{sectionCounter} 
    \fullwidth{\section*{Section \arabic{sectionCounter}: #1}}
    
    \titledquestion{#1}
    \vspace{-1em}
    \begin{parts}
        #2
    \end{parts}
}

\qformat{}
%Change \q to whatever name you want
\newcommand{\q}{
    \stepcounter{questionNumber}
    \part
}
%Change \p to whatever name you want
\newcommand{\p}{
    \subpart
}
%Change \subp to whatever name you want
\newcommand{\subp}{
    \subsubpart
}

\newenvironment{qparts}
    {\begin{subparts}}
    {\end{subparts}}

\newenvironment{qsubparts}
    {\begin{subsubparts}}
    {\end{subsubparts}}

```

Changelog:

November 19: added the quick copy code.

November 21: fixed a bug in the code due to uplevel and switched to using `\partshook` to change indentation. Uplevel is limited to only a single page and cannot have a page break inside of it.

Special thanks to [this Stack Overflow post](https://stackoverflow.com/questions/8160514/is-there-css-for-typesetting-the-latex-logo-in-html) for the CSS for the <span class="latex">L<sup>a</sup>T<sub>e</sub>X</span> logo.