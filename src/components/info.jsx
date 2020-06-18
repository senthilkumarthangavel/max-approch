import React from 'react';

 const Question = ({question}) => {

    var style = {
        color: '#4a4a4a',
        textAlign: 'center',
        fontSize:'20px'
      };   

 return ( <h4 style={style}>{question}</h4> )
};

export default Question;