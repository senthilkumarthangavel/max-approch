import React from 'react';

const Feedback = ({feedback}) => {
console.log('cry',feedback);
    const Feedback =  ("Feedback" === feedback) ? <div>Clicked option was wrong one. Please Explore the methods and choose the correct answer<a>Click Here</a></div> : <div></div>
    console.log('crying', Feedback);
return <div>{Feedback}</div>
}

export default Feedback;