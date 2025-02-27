---
layout: default
title: Predator-Prey Interactions
permalink: /lvmodel
tools: 10
---


<script defer src="/assets/scripts/graph.js"></script>
<script defer src="/assets/scripts/lotkaVolterraModel.js"></script>

<style type="text/css" media="screen">
    .stretch {
  position: relative;
  left: calc(-50vw + 50%);
    }
    .pad-right-20{
        padding-right: 20px;
    }

</style>

# Predator-Prey Interactions and modifications of the Lotka-Volterra Model

Still very much a work in progress. Addition of a plot to show the ZNGIs (zero net growth isoclines) is planned for the future.

<br>
<div class="graph panel pad-right-20" >
    <canvas class="graph" id="timeGraph" height=400 width=400></canvas><br>
    <canvas class="graph" id="slopeGraph" height=400 width=400></canvas>
</div>

<div class="panel" style="min-width:300px;">
    <h3 class="header">Current Equations</h3>
    <p id="prey-eq"></p>
    <p id="pred-eq"></p>
    <h3 class="header">Graph Settings</h3>
    <button class = "btn btn-submit" id="play">Play</button><button class = "btn btn-submit" id="step" title="Steps forward by one step size using the method specified below.">Step</button><br>
    <label>Method: <select id="method">
            <option value="euler">Euler's method (RK1)</option>
            <option value="rk2">2nd order Runge-Kutta (RK2)</option>
            <option selected value="rk4">4th order Runge-Kutta (RK4)</option>
        </select></label><br>
    <label>Step size: <input id="step-size" type="number" min=".001" max="10" step="0.01" value="0.1"></label><br>
    <label>Scale graph based on step size: <input id="step-scaling" type="checkbox" checked> <span class = "descriptor" hover-text = "When checked, the graph will increment by step size for each pixel of the graph, so a larger step size would cause the graph to be horizontally compressed and a smaller step size would cause horizontal stretching. When unchecked, this no longer applies, and each pixel will always correspond to 0.1 units of time. Therefore, if the step size is 0.01, the program will do 10 consecutive approximations to find each pixel.">?</span> </label><br>
    <label>Refresh Rate: <input id="refresh-rate" type="number" min="1" max="50" step="1" value="7"></label><br>
    <label for="prey">Prey growth type: </label>
    <label><input class="prey-growth" type="radio" checked name="prey" value="Exponential">Exponential</label>
    <label><input class="prey-growth" type="radio" name="prey" value="Logistic">Logistic</label>
    <label><input class="prey-growth" type="radio" name="prey" value="Logistic">Regrowth</label>
    <br>
    <label for="predator">Predator functional response: </label>
    <label><input class="predator-func-response" type="radio" checked name="predator" value="t1">Type I</label>
    <label><input class="predator-func-response" type="radio" name="predator" value="t2">Type II</label>
    <label><input class="predator-func-response" type="radio" name="predator" value="t2">Type III</label>
    <br>
    <button class = "btn btn-submit x-small" id="reset">Reset</button><br>
    <button class = "btn btn-submit x-small" id="graph-all" title="Graphs everything that has been calculated since the initial conditions at the bottom of the page. You will have to scroll sideways to see everything.">Graph all</button>
    <button class = "btn btn-submit x-small" id="download" title="Downloads the numbers for both populations with respect to time.">Download numbers</button>


    <h3 class="header" id="expParams">Graph Parameters</h3>
    <label class="var-lab" id="N-label"><math>
        <msub>
            <mi>N</mi>
            <mn>0</mn>
        </msub>
    </math>:
    <input type="range" id="N0" min="1" max="50" step="1" value="5">

<p id="N0-value"><math>
        <msub>
            <mi>N</mi>
            <mn>0</mn>
        </msub>
    </math> value: </p></label>
    <label class="var-lab" id="P-label"><math>
            <msub>
                <mi>P</mi>
                <mn>0</mn>
            </msub>
        </math>:
        <input type="range" id="P0" min="1" max="50" step="1" value="2"><br>
    <p id="P0-value"><math>
            <msub>
                <mi>P</mi>
                <mn>0</mn>
            </msub>
        </math> value: </p></label>

<label class="var-lab" id="r-label">r: <input type="range" id="r" min=".1" max="2.5" step=".01" value="1.2"><br>
    <p id="r-value">r value: </p>
</label>

<label class="var-lab" id="a-label">a: <input type="range" id="a" min="0" max="1" step=".01" value=".5"><br>
    <p id="a-value">a value: </p>
</label>

<label class="var-lab" id="q-label">q: <input type="range" id="q" min="0" max="1" step=".01" value=".1"><br>
    <p id="q-value">q value: </p>
</label>

<label class="var-lab" id="f-label">f: <input type="range" id="f" min="0" max="1" step=".01" value=".1"><br>
    <p id="f-value">f value: </p>
</label>

<label class="var-lab" id="K-label">K: <input type="range" id="K" min="1" max="100" step="1" value="10"><br>
    <p id="K-value">K value: </p>
</label>

<label class="var-lab" id="h-label">h: <input type="range" id="h" min="0.01" max="1" step=".01" value="0.1"><br>
    <p id="h-value">h value: </p>
</label>
</div>

<canvas class="graph hide stretch" id="allGraph" height=400 width=610></canvas><br>


Variable names and equations taken from the second edition of Community Ecology by Gary G. Mittelbach & Brian J. McGill. 
