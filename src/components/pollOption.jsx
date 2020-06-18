import React from 'react';

const PollOption = ({ options, selectedOn, selectedValue }) => {
  return (
    <div className="pollOption">
       
      {options.map((choice, index) => (
      <label key={index}>
        <input type="radio" 
                name="vote" 
                value={choice.label} 
                key={index}
                checked={selectedValue === choice.label}
                onClick={(e) =>selectedOn(e.target.value)}
              />
                <span>{choice.label}</span>
        </label>
      ))}  
    </div>
   );
};


export default PollOption;