import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import { Row, Col, Container, TabContainer, Tab, Tabs}  from 'react-bootstrap';
import Elaborat from './elaborat.jsx'
import Hint from './hint.jsx';
import Feedback from './feedback.jsx';
import Explain from './explain.jsx';
import MultiMath from './explore.jsx';
import LoadContent from './loadcontent.jsx';
import Logo from  '../assets/logo.svg';
import Hintimg from  '../assets/hint.svg';

class WorkSpace extends Component{

  constructor(props){
      super(props);
      this.state={
        plusopen: false,
        inputValue:'',
        key: '',
        defaultContent: false
      }
   }

componentDidMount(){
  this.setState({
    defaultContent: true
  })
}

componentDidUpdate(previousProps, previousState) {
  if (previousState.key !== this.state.key) {
      this.setState({
        defaultContent: false
      })
  }
}

setKey(k){
   if(k !== this.state.key){
      console.log('kkkk', k);
      this.setState({
        key: k,
      })
    }
  }

 
static getDerivedStateFromProps(props, state) {
  console.log('poppy', props);
   if (props.keyChange === "Feedback" && props.keyChange !== state.key) {
      console.log('receuved');
      return {
        key: props.keyChange
      };
    }
    return null;
  }
    render(){
      const {inputValue, defaultContent, key} = this.state
      const { increment, keyChange } = this.props;

     console.log('key', this.state.key)
        return(
          
          <div className={'wrkarea'}>
              
            <Tabs id="controlled-tab-example" activeKey={this.state.key}  onSelect={(k) => this.setKey(k)} key={key}> 
                <Tab eventKey="hint" title="Hint" >
                     <Hint/>
                </Tab>
                <Tab eventKey="explore" title="Explore">
                     <MultiMath active={key} increquestion={increment}/>
                </Tab>
                <Tab eventKey="explian" title="Explian" >
                    <Explain />
                </Tab>
                <Tab eventKey="elaborate" title="Elaborate" >
                    <Elaborat />
                </Tab>
                <Tab eventKey="Feedback" title="FeedBack">
                    <Feedback feedback={keyChange}/>
                  </Tab>
                <Tab eventKey="Chatbots" title="Chatbots">
                 </Tab>
                <Tab eventKey="Ask the teacher" title="Ask the teacher" >
                </Tab>
             </Tabs>
            { defaultContent ? (<LoadContent />): ''} 
          </div>
        );
    }
};

export default WorkSpace;