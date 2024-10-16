---
layout: default
title: Lotka-Volterra Model
permalink: /lvmodel
tools: 10
---


<script defer src="/assets/scripts/graph.js"></script>
<script defer src="/assets/scripts/lotkaVolterraModel.js"></script>

# Predator Prey Interactions and modifications of the Lotka-Volterra Model

Still very much a work in progress. There are many bugs left to be ironed out, and I am planning to add a plot to show the ZNGIs (zero net growth isoclines).

<br>
<div class="graph panel" >
    <canvas class="graph" id="timeGraph" height=400 width=610></canvas><br>
    <canvas class="graph" id="slopeGraph" height=400 width=610></canvas>
</div>

<div class="panel" style="min-width:300px;">
    <h3 class="header">Graph Settings</h3>
    <button class = "btn btn-submit" id="play">Play</button><button class = "btn btn-submit" id="step">Step</button><br>
    <label>Method: <select id="method">
            <option value="euler">Euler's method</option>
            <option selected value="rk2">2nd order Runge-Kutta (RK2)</option>
            <!-- <option value="rk4">4th order Runge-Kutta (RK4)</option> -->
        </select></label><br>
    <label>Step size: <input id="step-size" type="number" min=".001" max="10" step="0.01" value="0.1"></label><br>
    <label>Refresh Rate: <input id="refresh-rate" type="number" min="1" max="50" step="1" value="7"></label><br>
    <label for="prey">Prey growth type: </label>
    <label><input class="prey-growth" type="radio" checked name="prey" value="Exponential">Exponential</label>
    <label><input class="prey-growth" type="radio" name="prey" value="Logistic">Logistic</label>
    <br>
    <label for="predator">Predator functional response: </label>
    <label><input class="predator-func-response" type="radio" checked name="predator" value="t1">Type I</label>
    <label><input class="predator-func-response" type="radio" name="predator" value="t2">Type II</label>
    <br>
    <button class = "btn btn-submit x-small" id="reset">Reset</button>
    <h3 class="header" id="expParams">Graph Parameters</h3>
    <label><math>
        <msub>
            <mi>N</mi>
            <mn>0</mn>
        </msub>
    </math>:
    <input type="range" id="N0" min="1" max="50" step="1" value="5"></label><br>

<p id="N0-value"><math>
        <msub>
            <mi>N</mi>
            <mn>0</mn>
        </msub>
    </math> value: </p>
    
    <label><math>
            <msub>
                <mi>P</mi>
                <mn>0</mn>
            </msub>
        </math>:
        <input type="range" id="P0" min="1" max="50" step="1" value="2"></label><br>
    <p id="P0-value"><math>
            <msub>
                <mi>P</mi>
                <mn>0</mn>
            </msub>
        </math> value: </p>

<label id="r-label">r: <input type="range" id="r" min=".1" max="2.5" step=".01" value="1.2"><br>
    <p id="r-value">r value: </p>
</label><br>

<label id="a-label">a: <input type="range" id="a" min="0" max="1" step=".01" value=".5"><br>
    <p id="a-value">a value: </p>
</label><br>

<label id="q-label">q: <input type="range" id="q" min="0" max="1" step=".01" value=".1"><br>
    <p id="q-value">q value: </p>
</label><br>

<label id="f-label">f: <input type="range" id="f" min="0" max="1" step=".01" value=".1"><br>
    <p id="f-value">f value: </p>
</label><br>

<label id="K-label">K: <input type="range" id="K" min="1" max="100" step="1" value="75"><br>
    <p id="K-value">K value: </p>
</label><br>

<label id="h-label">h: <input type="range" id="h" min="0" max="1" step=".01" value="0"><br>
    <p id="h-value">h value: </p>
</label><br>
</div>


Variable names and equations taken from the second edition of Community Ecology by Gary G. Mittelbach & Brian J. McGill. 
<!-- <br>
Prey:

Original:

<math>
    <mfrac>
        <mrow>
            <mi>d</mi>
            <mi>N</mi>
        </mrow>
        <mrow>
            <mi>d</mi>
            <mi>t</mi>
        </mrow>
    </mfrac>
    <mo>=</mo>
    <mi>r</mi>
    <mi>N</mi>
    <mo>-</mo>
    <mi>a</mi>
    <mi>N</mi>
    <mi>P</mi>
</math>

Logistic:

<math>
    <mfrac>
        <mrow>
            <mi>d</mi>
            <mi>N</mi>
        </mrow>
        <mrow>
            <mi>d</mi>
            <mi>t</mi>
        </mrow>
    </mfrac>
    <mo>=</mo>
    <mi>r</mi>
    <mi>N</mi>
    <mrow>
        <mo stretchy="true" form="prefix">(</mo>
        <mrow>
            <mn>1</mn>
            <mo>-</mo>
            <mfrac>
                <mi>N</mi>
                <mi>K</mi>
            </mfrac>
        </mrow>
        <mo stretchy="true" form="postfix">)</mo>
    </mrow>
    <mo>-</mo>
    <mi>a</mi>
    <mi>N</mi>
    <mi>P</mi>
</math>

Type II exponential:

<math>
    <mfrac>
        <mrow>
            <mi>d</mi>
            <mi>N</mi>
        </mrow>
        <mrow>
            <mi>d</mi>
            <mi>t</mi>
        </mrow>
    </mfrac>
    <mo>=</mo>
    <mi>r</mi>
    <mi>N</mi>
    <mo>-</mo>
    <mfrac>
        <mrow>
            <mi>a</mi>
            <mi>N</mi>
            <mi>P</mi>
        </mrow>
        <mrow>
            <mn>1</mn>
            <mo>+</mo>
            <mi>a</mi>
            <mi>h</mi>
            <mi>N</mi>
        </mrow>
    </mfrac>
</math>

Type II logistic

<math>
    <mfrac>
        <mrow>
            <mi>d</mi>
            <mi>N</mi>
        </mrow>
        <mrow>
            <mi>d</mi>
            <mi>t</mi>
        </mrow>
    </mfrac>
    <mo>=</mo>
    <mi>r</mi>
    <mi>N</mi>
    <mrow>
        <mo stretchy="true" form="prefix">(</mo>
        <mrow>
            <mn>1</mn>
            <mo>-</mo>
            <mfrac>
                <mi>N</mi>
                <mi>K</mi>
            </mfrac>
        </mrow>
        <mo stretchy="true" form="postfix">)</mo>
    </mrow>
    <mo>-</mo>
    <mfrac>
        <mrow>
            <mi>a</mi>
            <mi>N</mi>
            <mi>P</mi>
        </mrow>
        <mrow>
            <mn>1</mn>
            <mo>+</mo>
            <mi>a</mi>
            <mi>h</mi>
            <mi>N</mi>
        </mrow>
    </mfrac>
</math>

Predator:

Type I:

<math>
    <mfrac>
        <mrow>
            <mi>d</mi>
            <mi>P</mi>
        </mrow>
        <mrow>
            <mi>d</mi>
            <mi>t</mi>
        </mrow>
    </mfrac>
    <mo>=</mo>
    <mi>f</mi>
    <mi>a</mi>
    <mi>N</mi>
    <mi>P</mi>
    <mo>-</mo>
    <mi>q</mi>
    <mi>P</mi>
</math>

Type II:

<math>
    <mfrac>
        <mrow>
            <mi>d</mi>
            <mi>P</mi>
        </mrow>
        <mrow>
            <mi>d</mi>
            <mi>t</mi>
        </mrow>
    </mfrac>
    <mo>=</mo>
    <mfrac>
        <mrow>
            <mi>f</mi>
            <mi>a</mi>
            <mi>N</mi>
            <mi>P</mi>
        </mrow>
        <mrow>
            <mn>1</mn>
            <mo>+</mo>
            <mi>a</mi>
            <mi>h</mi>
            <mi>N</mi>
        </mrow>
    </mfrac>
    <mo>-</mo>
    <mi>q</mi>
    <mi>P</mi>
</math> -->