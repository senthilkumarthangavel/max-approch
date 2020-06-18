import React, { Component } from 'react';
import Banner  from './components/banner.jsx';
import Question  from './components/question.jsx';
import Submission from './components/submission.jsx';
import WorkSpace from './components/workspacer.jsx';
import Answer from './components/answer.jsx';
import url from './api/index.json';
import './style/style.css';
import './style/video-react.css';

//styles
import { Row, Col, Container }  from 'react-bootstrap'


class App extends Component{
  constructor(props){
    super(props);
    this.state = {
        question: '',
        keyChange: '',
        submit: false,
        increquestion: 0
      }
    }

 async componentDidMount(){
   const data = await url.data;
   //console.log('data', data);
    this.setState({question: data.question.ques_name0 })
}

handleOnChange=(val)=>{
  console.log('typeof', typeof(val))
  const getvalue = url.data.question.question0.data.solution;
  console.log('getvalue', typeof(getvalue));
  const verify = parseInt(val) && parseInt(val) === getvalue? true : false;
  if(verify === true){
    this.setState({
      submit: true
     })
    }
  if(verify === false){
     this.setState({
      keyChange: "Feedback",
      submit: false
     })
  }
 }

handleSubmit=(e)=>{
  this.setState({
    increquestion: this.state.increquestion + 1
  });
}

  render(){
    console.log('submitttt', this.state.submit);
   const {question, keyChange, submit, increquestion} = this.state
    console.log('submitttt', this.state.submit);
    return(
      <div className="App app-wrap">
      <Container>
        <div className={'wrapper'}>
        <div className={'banner-content'} width={'100%'}>
          <Banner />
        </div>
        <div className={'wrapper inn'}>
        <div className={'ques-content'}  width={'100%'}> <Question question={question}/> </div>
         <WorkSpace keyChange={keyChange} increment={increquestion}/>
       <Answer selectedOn={this.handleOnChange}/>
      </div>
      <Submission visible={submit} submitFun={this.handleSubmit}/>
      <div className={'footer'}>@All Rights Reserved - KnowledgeQ</div>   
      </div> 
      </Container>
     </div>
    );
  }
}

export default App;
