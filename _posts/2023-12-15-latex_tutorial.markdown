---
layout: post
title:  LaTeX Test Tutorial for Science Olympiad 
date:   2023-12-15 08:00:00 -0500
category: scioly
author: lastlegume
tags: latex scioly
---

LaTeX is amazing for writing Scioly tests: it has beautiful formatting, simple collaborative editing, and automatic key generation. A lot of people get intimidated by the code-like interface of LaTeX, but it's really simple to use and (in my opinion) is significantly faster to write in than Google Docs or Word because of its many nice features for test writers. Today, I wanted to go through every choice in [my template](https://www.overleaf.com/read/hxqbzhngffmg#97c754) and show what the code does and why I chose to add it. The [exam class documentation](https://math.mit.edu/~psh/exam/examdoc.pdf) is the best resource for this, but its comprehensiveness puts off many people who just want to know how to write a multiple choice question. For that reason, I'll start with formatting questions and explain the preamble and title page choices later down. The preamble choices will contain significantly more personal preference for decisions, so feel free to experiment with different code. Examples of everything discussed here are available within the template.

# Basic LaTeX skills

This [tutorial](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes) from Overleaf is very detailed and should teach the basics of how to use LaTeX. In short, there is a header called a preamble that is used for configuring settings, and the rest of the document is shown in the pdf unless commented. Exactly what is written will not be shown, but this allows for a wide variety of customization and interesting formatting. From here on, I'll assume that anyone reading knows the content of the tutorial at least somewhat well so that explanations can be simplified. Keep in mind that newline is `\\` in LaTeX and not just enter.

# Question Writing

To start writing questions, within the document, type `\begin{questions}`. Because questions is inside the brackets, this is called the questions environment. I will be using the term environment a lot going forward, so make sure to understand that environments apply formatting effects and are defined by a `\begin{environment}` and `\end{environment}` From this point on, `\question[point value]` can be used to start writing questions. After `\question`, write any text needed for the question. For example, a one point question with the text, "what is the color of the sky?", how would you write it?

<details style = "padding-bottom:8px">
    <summary>Code</summary>
        <pre class="highlight"><code><span class="k">\question</span><span class="na">[1]</span> What is the color of the sky?
</code></pre>
</details>

## Multiple Choice Questions (MCQ)

There are two primary ways to write MCQ: using the choices environment or the oneparchoices environment.    

### Choices

Use `\begin{choice}` to start the environment. Inside this section, type `\choice` followed by a space and the answer. LaTeX will automatically label it A., B., C., etc. and leave a newline after each choice. To indicate the correct answer, type `\correctchoice` instead of `\choice`, and when answers are being printed, the correct choice will be emphasized. After all choices are added, type `\end{choices}` to close the environment. 

Example: to add choices for the numbers 1-4, what would you type? Assume the correct answer is 4. 
<details style = "padding-bottom:8px">
    <summary>Code</summary>
    <pre class="highlight"><code><span class="nt">\begin{choices}</span>
    <span class="k">\choice</span> 1
    <span class="k">\choice</span> 2
    <span class="k">\choice</span> 3
    <span class="k">\correctchoice</span> 4
<span class="nt">\end{choices}</span>
</code></pre>
</details>

### Oneparchoices

To use oneparchoices, simply replace the choices in `\begin{choices}` and `\end{choices}` with oneparchoices. Thie environment places all of the choices on the same line, so a newline (`\\`) after the question is usually important in formatting the answer choices. It doesn't really work if answer choices are very long, but in most cases, this is the better choice of environment because of the space it saves.  

### True or False

This is just an extension of multiple choice. Just use choices or oneparchoices with two answer choices (true and false)

### Multiple Select

Another extension of the multiple choice format. You can add multiple correct answers by simply marking more choices as `\correctchoice`. To make the questions appear distinct, you can also use the checkboxes or oneparcheckboxes environment. 

## Fill In The Blank (FIB)

To add FIB questions, use `\fillin[answer][length]` with length as a LaTeX measurement. You do not need either of the bracketed sections (brackets indicate that a parameter is optional), but it is usually better to include them. A default length can be set in the preamble with `\setlength\fillinlinelength{length}` with length as a LaTeX measurement. I usually add a newline (`\\`) after the question and set the default length to the width of the text (`\setlength\fillinlinelength{\textwidth}`), so that there is a fillin line underneath the question spanning the full length of the page for the answer to be written on. 

## Short Answer Questions (SAQ)

The best way to create SAQs is with the solutionbox environment. It places a box of a specified size that contains the answer when answers are shown. It is started with `\begin{solutionbox}{size}` with size being some LaTeX size measurement like 5cm. Because of the use of braces, the size of the box is mandatory. Inside the environment (between begin and end), write the answer, and it will appear when `\printanswers` is used. After the solution is finished, write `\end{solutionbox}`. The main advantage of solutionbox is that the size of the box is constant between when printanswers is run and not run.      
Alternatively, the solution environment will leave a blank space of a specified size and turn into a box with the solution in it when answers are being shown. Importantly, the box with the solution does not have the same size as the white space, so formatting would have to be different between the key and the test. The solutionorbox environment is similar, producing a box of the specified size instead of a white space. Importantly, these environments differ from solutionbox in that the size parameter is optional and therefore enclosed in brackets ([]). In addition to the aforementioned environments, solutionorlines, solutionordottedlines, and solutionorgrid all work in the same way and do exactly what it sounds like they do. For examples of all of these environments, check the [template](https://www.overleaf.com/read/hxqbzhngffmg#97c754) or read the exam class documentation.

# Preamble and Other Information

From here, I'll start going over the purpose of the code in the preamble. 

```latex
\documentclass[addpoints]{exam}
```

Defines the class of the document, so we can use the commands of the exam class like question. The bracketed addpoints is used to count up the points in the exam for the gradetable. 

```latex
\usepackage{graphicx}
```

This package is needed to insert images. Technically not necessary if there are no images in your test, but it's so useful that I just always keep it added. 


```latex
\usepackage{color}
```

This is the package that specifies text color (shocking, I know). In this case, I use it later to specify that correct answers appear in red.   
These are the only two packages that I include in the preamble. There are a lot of other useful ones like mhchem, amsmath, or circuitikz, but since the template does not require any more, I chose not to add any unneccessary packages.

```latex
% Change "Event" to the name of the event
\newcommand{\event}{Event}
% Change "Tournament" to the name of the tournament
\newcommand{\tournament}{Tournament}
```

These lines define two commands that are used later. To simply things, I use a special command that encodes the name of the tournament and the name of the event so that I can change event across the whole test with only one modification.

```latex
\setlength\fillinlinelength{\textwidth}
```

As described earlier, this line sets the default of line of the fillin lines (for FIB questions) to the full length of the text. I usually add a newline after the question and then a fillin to make the line last the full length of the page. 

```latex
\CorrectChoiceEmphasis{\color{red}\bfseries}
\SolutionEmphasis{\color{red}\bfseries}
```

Both of these lines do the same thing: they set the emphasis for correct answers to red bold text instead of the default bolding. This is completely subjective, but I like the red color because I feel that it stands out better than just bolding correct answers. 

```latex
\setlength\answerclearance{2pt}
```

This makes the lines from the fillin command appear lower. Also personal preference, but I dislike the slight clipping that occurs without this of the bottom of the letters with the line. 

```latex
\titlespacing\section{0pt}{3pt plus 2pt minus 2pt}{3pt plus 2pt minus 2pt}
```

This is commented by default, but if you are using the `\section{}` command, then this will reduce the amount of padding above and below the section, leaving less white space around the section text. Keep in mind that you will also need the titlesec package in the preamble to use this command. 

```latex
\pagestyle{headandfoot}
\runningheadrule
\runningheader{\event}{\tournament}{Team Number:\hspace{1cm}}
\runningfootrule
\runningfooter{}{Page \thepage\   of \numpages}{}
```

These lines create the header and footer. The first line sets up the page to have a header and footer. `\runningheadrule` creates the line at the top of the page. `\runningheader{}{}{}` decides what text is shown in the header. Each set of braces corresponds to a part of the header, with the first being the left part of the header, second being middle, and third being right (i.e. text is right aligned). The next two lines do the same but for the footer. With these parameters, the header includes the event, tournament, and a space for team number, and the footer includes the page number and the total number of pages.       
Interestingly, the documentation states that `\pagestyle` "determines whether the exam will have headers, footers,
both, or neither.", but removing this command does not change anything (the header and footer both still appear). Therefore, this first line might not be needed, but I've kept it in to make sure that it will still work if the default pagestyle changes. 

With the use of `\begin{document}`, the preamble has ended. This preamble is relatively simple because I dislike excessive package use, so I've limited it to only essential packages and commands. I will continue to describe the title page of the document just for some extra information because of some interesting choices.  

```latex
\begin{center}
    {\huge Science Olympiad \\ \event
    % Writes key if the answers are shown, otherwise writes test
    \ifprintanswers 
     \space Key
    \else 
     \space Test 
    \fi \\ \vspace{3mm}\tournament\vspace{1mm}}
\end{center}
```

These lines create a centered title. `\ifprintanswers` does exactly what it sounds like, use `\else` to specify what to show otherwise, and `\fi` to end the conditional. I use it here to toggle between the title being "Key" if answers are shown or "Test" if not. 

```latex
\begin{figure}[h]
    \centering
    % The braces include the reference to the image, so they must be changed to add/change to a new image 
    \includegraphics[height=.3\textheight]{Logo.png}
\end{figure}
```

Figures allow for the insertion of an image. You do not need a figure to insert an image, but it's usually better to use one instead of just using includegraphics. The `[h]` after the environment begins is a float specifier which you can read more about [here](https://www.overleaf.com/learn/latex/Positioning_images_and_tables), and it tries to place the image where the image is in the text. This often will not work and LaTeX will automatically switch it to [ht], which places it at the top of the page. In this case, this figure is for a cover image if desired (I usually use the logo of the tournament that the test is for). 

```latex
\begin{center}
    Team Name: \ifprintanswers
    \underline{\hspace{3.5cm}}\textbf{KEY}\underline{\hspace{5.5cm}}\\\vspace{5mm}
    \else
        \underline{\hspace{10cm}}\\ \vspace{5mm}
    \fi
    Team Number: \underline{\hspace{10cm}}\\ \vspace{5mm}
\end{center}
```

These lines add a line for teams to write their name on. It changes the team name to key when answers are shown as another visual reminder of the fact that `\printanswers` is active.

```latex
\noindent\textbf{\underline{Directions:}}
\begin{itemize}
    \item This is an instruction
    \item Use \verb+\item+ to add more instructions
\end{itemize}
```

The itemize environment creates a bulleted or unordered list. I use this here to list instructions for the test. 

```latex
\begin{center}
\textit{For grading use only}\\
% The gradetable has a number of rows that automatically updates. This is not very accurate because of the variance in question size, but it can serve as a starting point. You will probably need to manually update the number of rows of the gradetable (change '\the\numexpr\numpages/13+1' to the desired number of rows).
\multirowgradetable{\the\numexpr\numpages/13+1}[pages]    
\end{center}
```

The gradetable shows a list of all of the pages and number of points on each page. It leaves a space underneath the point value for you to write the score of the test taker. If you don't plan on writing on the gradetable, `\multirowpointtable` could be used instead because it lacks the space underneath the points for the score and shows only the page and number of points. Like the comments say, it's probably better to change the formula into a number of rows manually, but the formula can serve as a starting point for the number of rows. 

That's everything in the template explained, so I hope this helps make the meaning behind every line more clear. Thanks for reading to the end, and I hope this helps you write something easier.  
