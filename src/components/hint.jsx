import React, { Component } from 'react';


const Hint = ({key}) => {
    console.log('value', key);
    return(
        <div>
            <h5>Hint</h5>
           <h5>Euclid&#39;s Division Lemma</h5> 
           <p>&quot;Given positive integers a and b, there exist unique integers q and r satisfying a = bq +
r, 0 &lt;= r &lt;= b&quot;</p>
<h5 className="formula">Note: Dividend (a) = divisor (b) x quotient (q) + remainder (r)</h5>
<h6 className="hint-step">Steps:</h6>
<p>1. For this scenario, take two of the given numbers, divide the greater by the smaller and then
divide the divisor by the reminder. </p>
<p>2. Now again divide the divisor of this division by the next remainder found and repeat this
method until the remainder is zero. </p>
<p>3. The last divisor that is found will be the HCF of the two numbers asked. </p>
<p>4. If there are three numbers given and you need to find the HCF of three numbers then find the
HCF of this two numbers and the third number.</p>
           
        </div>
    );
}

export default Hint;

