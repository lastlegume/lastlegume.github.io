---
layout: default
title: Answer Sheet Generator
permalink: /answer-sheet
header: true
---

<script defer src = "/assets/scripts/answersheet.js"></script>
<h1>LaTeX Answer Sheet Generator (Beta)</h1>
A tool to convert a (presumably class set) test or set of stations with only questions into an answer sheet to write on. The tool works by taking in the LaTeX of the test and using it to create LaTeX for an answer sheet. The output should go entirely within the questions environment (i.e. after ```\begin{questions}```) Answers to open ended questions should be written as comments using % after the question. Currently in beta and only working with the specific parameters that I use, but I will update this in the future to be more versatile. 
<div style = "text-align:center;">
<h2>Test/Stations Code</h2>
<textarea id="input" name="input" rows="15" cols="100"></textarea><br>
<button id = "convert">Convert</button><br><br>
<h2>Answer Sheet Code</h2>
<textarea id="output" name="output" rows="15" cols="100"></textarea>
</div>
