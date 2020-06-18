import React, { Component } from 'react';

import Child from './child.jsx';

const Explain = props => (
    <div>
<h5>Use Euclid's division algorithm to find the HCF of 135 and 225 </h5>
<h5>Euclid&#39;s Division Lemma</h5> 
<p>&quot;Given positive integers a and b, there exist unique integers q and r satisfying a = bq +
r, 0 &lt;= r &lt;= b&quot;</p>
<h6 className="formula">Note: Dividend (a) = divisor (b) x quotient (q) + remainder (r)</h6>

    <Child waitBeforeShow={2000}>
      <p>1. Treat the smallest number i.e 135, as divisor (b) and bigger number i.e 225, as dividend (a) </p>
    </Child>
        <Child waitBeforeShow={7000}>
        <p>2. Apply Euclid's division lemma, to a and b. So, we find whole number, q and r such that  a = bq +
        r, 0 &lt;= r &lt;= b&quot; </p>
    </Child>
    <Child waitBeforeShow={9000}>
    <p>3. The last divisor that is found will be the HCF of the two numbers asked. </p>
    </Child>
    <Child waitBeforeShow={10000}>
    <p>4. Repeat Step 3 till the r is Zero</p>
    </Child>
</div>
)

export default Explain;

