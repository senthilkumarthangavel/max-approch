import React, { Component } from 'react';
import url from '../api/index.json';
import PollOption from './pollOption.jsx';

class Answer extends Component{
    
    constructor(props){
        super(props);
        this.state = {selectedOption:''}
         }

   render(){
        const answer = url.answer;
        const { selectedOn } = this.props;
        
        return(
            <div className={'answer-area'}>
                <PollOption
                options={answer}
                selectedOn={selectedOn}
                selectedValue={this.state.selectedOption}
                />
            </div>
        );
    }
}

export default Answer;