---
layout: post
title: Restoring Clicking to go to PDF Location to Section Gradetable Exams
date:   2026-01-20 1:00:00 -0500
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

A few months ago, I wrote [a blog post about a new method I designed](/blog/gradetable_section_names) for creating <span class="latex">L<sup>a</sup>T<sub>e</sub>X</span> gradetables by section using the exam class. If you didn't read it, it discusses the motivation and method for how I came up with this, along with an example with instructions for use. This post will do none of that, and builds upon the previous post about this method. 

In the previous post, I briefly mention that the "Go to PDF location in code" feature breaks with this method, which is due to the fact that all the questions are arguments to a macro. I didn't think much of this, but it gets annoying when the sections are multiple pages long, and I did want that to be changed. Thankfully, it's a very easy fix. All we need to do really is remove the second argument from the command and tell the user to start a `parts` environment right after. `parts` feels wrong to write though, since this is for questions, so we can define a new environment, called anything (I chose `questionsection`), and tell people to start that instead. So instead of putting all the questions as arguments for the `qsection` command, we instead just put the title of the section as an argument and put the questions after in our custom wrapper for `parts`.

[Here's an example](https://www.overleaf.com/read/jdtzrxschpqs#3962d9). 

This effectively solves our issue, as the feature is restored, so double (or CTRL/CMD) clicking on the PDF brings the code editor to that point. 

Quick copy code can be found right below this. Just like before, this goes in the preamble, and sections are created with the `\qsection{Title}` command with questions following in the `questionsection` environment.

In the preamble:

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
\newcommand{\qsectiontitle}[1]{
    \newpage
    \stepcounter{sectionCounter} 
    \fullwidth{\section*{Section \arabic{sectionCounter}: #1}}
    
    \titledquestion{#1}
    \vspace{-2em}
}

\qformat{}
%Change \q to whatever name you want
\newcommand{\q}{
    \stepcounter{questionNumber}
    \part
}
%Change \qpart to whatever name you want
\newcommand{\qpart}{
    \subpart
}
%Change \qsubpart to whatever name you want
\newcommand{\qsubpart}{
    \subsubpart
}

\newenvironment{qparts}
    {\begin{subparts}}
    {\end{subparts}}

\newenvironment{qsubparts}
    {\begin{subsubparts}}
    {\end{subsubparts}}

\newenvironment{qsection}
    {\begin{parts}}
    {\end{parts}}


```

Sections (outside the preamble, inside the `questions` environment):

```latex
\qsectiontitle{Title}
\begin{qsection}
    % Insert questions here...
\end{qsection}
```

Like last time, special thanks to [this Stack Overflow post](https://stackoverflow.com/questions/8160514/is-there-css-for-typesetting-the-latex-logo-in-html) for the CSS for the <span class="latex">L<sup>a</sup>T<sub>e</sub>X</span> logo.