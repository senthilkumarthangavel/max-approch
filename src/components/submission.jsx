import React from 'react';
import Button from 'react-bootstrap/Button';

 const Submission = ({visible, submitFun}) => {
console.log('visi', visible)

    if(visible !== false){
       document.getElementById('submit').style.pointerEvents = "all";
    }
 return ( <div className={'Submit'}>{
    <Button variant="primary" id="submit" className="submit-btn" onClick={(e)=>submitFun(e)}>Submit</Button>
     }</div> )
};

export default Submission;