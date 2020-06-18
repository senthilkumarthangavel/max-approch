import React from 'react';
import Audio from  '../assets/audio.png';

const Question = ({question}) => {
return ( <h4>{question} <img src={Audio} alt="" /></h4>  )
};

export default Question;