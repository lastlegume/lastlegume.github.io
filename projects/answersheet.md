---
layout: default
title: Answer Sheet Generator
permalink: /answer-sheet
tools: 2
---

<script defer src = "/assets/scripts/answersheet.js"></script>
<style type="text/css" media="screen">
    .half {
        text-align: center;
        display:inline-block;
        vertical-align:top;
    }
    .larger{
        min-width: 55%;
        max-width: 55%;
    }
    .smaller{
        text-align: left;
        z-index: 1;
    background-color: rgb(56, 56, 56);
    padding: 10px;
    overflow: hidden;
    font-size: smaller;
            min-width: 40%;
        max-width: 40%;
    }
    select{
        max-width: 80%;
    }

</style>
<h1>LaTeX Answer Sheet Generator</h1>
A tool to convert a (presumably class set) test or set of stations with only questions into an answer sheet to write on. The tool works by taking in the LaTeX of the test and using it to create LaTeX for an answer sheet. Any multiple choice questions are automatically recognized as such and processed into the appropriate format of your choice. For any free response question, the line after the line with ```\question``` should start with % (or your chosen character sequence) and have the answer in it. The output goes entirely within the questions environment (i.e. after ```\begin{questions}``` and before ```\end{questions}```). Any line that isn't a question or its answer (images, lists, section headers) is removed automatically to remove anything that is needed only on the test. See [the bottom of the page](#example). For a basic test writing tutorial in LaTeX, see [my tutorial](/blog/latex_tutorial), which includes a [template](/blog/tex_template) for use with this tool.
<div class="half larger">
<div style = "text-align:center;">
<h2>Test/Stations Code</h2>
<textarea id="input" name="input" rows="15" cols="60"></textarea><br>
<button class = "btn btn-submit" id = "convert">Convert</button><br><br>
<h2>Answer Sheet Code</h2>
<textarea id="output" name="output" rows="15" cols="60"></textarea>
</div>
</div>
<div class="half smaller">
<h2>Settings</h2>
<label ><input type="text" id="marker" value = "%"> Character marking answers <span class = "descriptor" hover-text = "The character that marks that the line is the answer to the previous line. % by default because % comments out the answers on the test, but can be changed to any character sequence.">?</span><br></label>
<label ><select id="frqtype">
      <option value="default">Decide whether to use fillin or solutionbox depending on length of answer</option>
      <option value="forceFIB">Force all FRQs to fillin</option>
      <option value="forcesolutionbox">Force all FRQs to solutionbox</option>
      <option value="forcesolution">Force all FRQs to solution</option>
      <option value="forcesolutionorbox">Force all FRQs to solutionorbox</option>
      <option value="forcesolutionorlines">Force all FRQs to solutionorlines</option>
      <option value="forcesolutionordottedlines">Force all FRQs to solutionordottedlines</option>
      <option value="forcesolutionorgrid">Force all FRQs to solutionorgrid</option>
    </select> <span class = "descriptor" hover-text = "Changes whether free response questions have blanks or boxes/lines/spaces to write answers in. Each environment is described in the documentation or my tutorial on the subject.">?</span><br></label>
   
<label id="FIBThresholdLabel"><input type="number" id="FIBThreshold" value = 25 min = 0> Max character count for a FIB <span class = "descriptor" hover-text = "How many characters an answer can be before being considered a short answer question and not a fill in the blank">?</span><br></label>
<label id = "FIBsizeLabel"><input type="text" id="FIBsize" value = ".85\\textwidth"> Length of fillin lines <span class = "descriptor" hover-text = "A fixed length for how long the blanks for fill in the blank questions should be. .85\\textwidth is roughly an entire line.">?</span><br></label>
<label id="autoCalcSASizeLabel"><input type="checkbox" id="autoCalcSASize" checked> Calculate SA solution sizes based on answer length <span class = "descriptor" hover-text = "Use the length of the answers to decide how large the solution writing space should be">?</span><br></label>
<label id = "SAsizeLabel"><input type="text" id="SAsize" value = "3cm"> Size of short answer solutions <span class = "descriptor" hover-text = "A fixed length that all solutions/solutionboxes will be">?</span><br></label>


<label ><select id="mcq">
      <option value="default">Use the environment from the test</option>
      <option value="forcenormal">Force environment to choices or checkboxes</option>
      <option value="forceonepar">Force environment to oneparchoices or oneparcheckboxes</option>
      <option value="longblanks">Use line length blanks instead of letters</option>
      <option value="shortblanks">Use short blanks instead of letters</option>
      <option value="multiblanks">Use short blanks in multiple columns instead of letters</option>
    </select> <span class = "descriptor" hover-text = "Changes how the multiple choice questions are processed. Any option mentioning environments will show the letters of the answer choices on the answer sheet, while any option with blanks will create empty blanks where the letter can be written. Number of columns and length of short blanks are both decided based on the maximum number of answer choices in a single question.">?</span><br></label>
    <label id="showAnswerChoicesLabel"><input type="checkbox" id="showAnswerChoices" > Display answer choices <span class = "descriptor" hover-text = "The text of answer choices will be copied over in addition to the letters corresponding to each answer choice."> ? </span><br></label>
    <label><input type="checkbox" id="includeAll"> Include all non-question lines <span class = "descriptor" hover-text = "All non-question lines (i.e. lists, figures, etc.) will be retained in the answer sheet."> ? </span><br> </label>
    <label><input type="checkbox" id="includeSection" checked> Include section headers <span class = "descriptor" hover-text = "Any section headers (\section, \subsection, \section*, etc.) will be added to the answer sheet.">?</span><br></label>
    <label><input type="checkbox" id="includeParts" checked> Include part environments <span class = "descriptor" hover-text = "Needed if the test uses any of the parts environments. Includes the begin and end parts lines in the answer sheet.">?</span><br></label>
    <label><input type="checkbox" id="includeFullwidth" > Include full width/bold/noindent text <span class = "descriptor" hover-text = "Any bold or fullwidth text (\textbf, \fullwidth, \noindent) will be added to the answer sheet.">?</span><br></label>
    <label><input type="checkbox" id="includeFullwidth" > Include questions without a point value <span class = "descriptor" hover-text = "Any \question without a point value will be added to the answer sheet verbatim.">?</span><br></label>

    <label><input type="checkbox" id="linegoal" > Use linegoal for fillin line lengths <span class = "descriptor" hover-text = "Uses the linegoal package to make the fillin line fill the rest of the line. Very buggy and will introduce errors, but appears to work. Requires the linegoal package."> ? </span><br></label>
    <p style = "padding-bottom:100px"></p>


</div>

<h2 id = "example">Example</h2>

```latex
\question[1] Darling-58 is the name of a transgenic variant of what tree species on the 2024 National Tree List? Answer with the common name. 
%American Chestnut
\question[1] Bark is defined as all tissue outside of which structure?\\
\begin{oneparchoices}
    \choice Sapwood
    \correctchoice Vascular cambium
    \choice Secondary Phloem
    \choice Phelloderm
    \choice Cork cambium
\end{oneparchoices}
```

To use this tool, simply write multiple choice questions normally and add the answer to free response questions to the line after in comments like seen above. It is VERY important that no lines are skipped between the questions and the answer choices or the commented answer because the program will not recognize the answer if lines are skipped in between. Questions are from CWRU Invitational 2024 Forestry C. 