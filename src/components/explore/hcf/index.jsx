import React, { Component } from 'react';
import { MathFieldComponent } from 'react-mathlive';
import MathLive from 'mathlive';
import { validate, getResultObject } from './validation';

import url from '../../../api/index.json';

class MultiMath extends Component {

    constructor() {
        super();
        this.ast = undefined;
        this.get_index = undefined;
        this.targetRef = React.createRef();
        this.smallerRef = React.createRef();
        this.greaterRef = React.createRef();
        this.state = {
            num: true,
            count: [1],
            add: true,
            q1: 225,
            q2: 135,
            data: {},
            showfeild: true,
            step: false
        }
    }


    componentDidMount(){
        this.handleEnable(false);
    }
    

    componentDidUpdate() {

        if(this.props.increquestion === 1){
           this.setState({
               q1: url.data.question.question1.data.q1
           })
        }

       if(this.state.add){
        const value =  this.state.num ? this.greaterRef.current: this.smallerRef.current
        if (value) {
            const mathField = MathLive.makeMathField(value);
            mathField.$setConfig({
              virtualKeyboardMode: 'onfocus',
              virtualKeyboards: 'all',
              onContentDidChange: mathfield => {
                if(value === this.greaterRef.current){
                    try {
                        const num = MathLive.latexToAST(mathfield.$text());
                        if(parseInt(num.num) === this.state.q1){
                           console.log('qqq2');
                          this.setState({num: !num})
                          document.getElementById('greaterLabel').innerHTML = "";
                         }
                        else{
                            const labelload = `Please enter the Greater number between ${this.state.q1} and ${this.state.q2}`
                            document.getElementById('greaterLabel').innerHTML = "Please enter the Greater number between 225 and 135";
                           }
                    } catch (e) {
                      /*  document.getElementById('output').innerHTML = '😕';*/
                    }
                }
                if(value === this.smallerRef.current){
                    try {
                        const number = MathLive.latexToAST(mathfield.$text());
                        if(parseInt(number.num) === this.state.q2){
                           console.log('qqq2');
                           const label = document.getElementById('smallerLabel');
                           label.innerHTML = "Now the numbers are ordered in descending order.";
                           label.style.color = '#4CAF50';
                            this.handleEnable(true);
                           }
                        else{
                            const labelload = `Please enter the Smaller number between ${this.state.q1} and ${this.state.q2}`
                            document.getElementById('smallerLabel').innerHTML = labelload;
                            this.handleEnable(false);
                           }
                    } catch (e) {
                      /*  document.getElementById('output').innerHTML = '😕';*/
                    }
                }
              }
            })
          }
       }

        const target = this.targetRef.current
        console.log('target', target);

        if (target && target === this.targetRef.current) {
            const value_index = target.getAttribute('data-value');  //index value
            this.get_index = value_index;
            //console.log('value_index', value_index)                 //index value
            console.log('target', target);
            const mathField = MathLive.makeMathField(target);
            console.log('mathField', mathField);
              mathField.$setConfig({
                virtualKeyboardMode: 'onfocus',
                virtualKeyboards: 'all',
                onBlur: mathfield => {
                    try {
                        const ast = MathLive.latexToAST(mathfield.$text());
                        this.ast = ast;
                        
                        //validate HCF
                        let valid = validate(ast, this.get_index, this.state);
                        
                        console.log("valid ", valid);
                        
                        //valid => true dont hide + and green in textbox 
                        //valid => otherwise hide +, red in textbox and show error message under textbox
                        if (valid === true) { 

                           let getValue = getResultObject(this.ast, this.get_index, this.state);
                            console.log('soole', getValue);
                           if(getValue[this.get_index].r !== 0){
                              var element =  document.getElementById(`${this.get_index}`);
                              element.textContent = url.feedback.postFeedback1;
                            } 
                            if(getValue[this.get_index].r === 0){
                                var element =  document.getElementById(`${this.get_index}`);
                              element.textContent = `${url.feedback.postFeedback2} ${this.state.q1} and ${this.state.q2} is ${getValue[this.get_index].b}`;
                            }
                           
                            if(parseInt(this.get_index) === 0){
                                var d = document.getElementById("add-btn");
                                d.className += "show";
                            }
                            if(parseInt(this.get_index) !== 0){
                                
                             var ele = document.getElementById("add-btn1");
                             if ( ele.classList.contains('show')){
                                ele.classList.remove('show');
                             }
                               else{
                                ele.className += "show";
                                var d = document.getElementById("add-btn");
                                d.classList.remove('show');
                               }
                            }
                           
                        } else {
                            var errElement = document.getElementById(`${this.get_index}`)
                            errElement.innerHTML= valid; 
                            errElement.style.color ='#d80000';
                         }

                       /* document.getElementById(
                            'output'
                        ).innerHTML = JSON.stringify(
                            mathJsonToMathjs(ast, {}).eval()
                        ); */
                        // document.getElementById('output').innerHTML = JSON.stringify(ast);
                    } catch (e) {
                      /*  document.getElementById('output').innerHTML = '😕';*/
                    }
                }
            })
        }

        function applySuperscriptAsPower(mjs, mathJson, config) {
            let result = mjs;
            if (
                typeof mathJson === 'object' &&
                mathJson.sup !== undefined
            ) {
                result = new window.math.expression.node.FunctionNode(
                    'pow',
                    [result, mathJsonToMathjs(mathJson.sup, config)]
                );
            }
            return result;
        }

        function getMathjsArgs(mathJson, config) {
            let result = [];
            if (Array.isArray(mathJson.arg)) {
                for (
                    let index = 0;
                    index < mathJson.arg.length;
                    index++
                ) {
                    result.push(
                        mathJsonToMathjs(mathJson.arg[index], config)
                    );
                }
            } else {
                result = [mathJsonToMathjs(mathJson.arg, config)];
            }
            return result;
        }
        /**
         * Return an array of arguments, with the sub if present as the last argument.
         */
        function getMathjsArgsWithSub(mathJson, config) {
            const result = getMathjsArgs(mathJson, config);
            if (mathJson.sub !== undefined) {
                result.push(mathJsonToMathjs(mathJson.sub, config));
            }

            return result;
        }

        /**
         * Return a mathjs node tree corresponding to the MathjSON object
         * @param {Object.<string,any>} mathJson
         */
        function mathJsonToMathjs(mathJson, config) {
            let result;
            if (mathJson === undefined) return undefined;

            if (
                typeof mathJson === 'number' ||
                mathJson.num !== undefined
            ) {
                let n =
                    typeof mathJson === 'number'
                        ? mathJson
                        : mathJson.num;

                // Convert to BigNum if required
                if (config.number === 'BigNumber')
                    n = window.math.bignumber(n);

                result = new window.math.expression.node.ConstantNode(
                    n
                );

                // Apply the superscript as an operation
                result = applySuperscriptAsPower(
                    result,
                    mathJson,
                    config
                );
            } else if (
                typeof mathJson === 'string' ||
                mathJson.sym !== undefined
            ) {
                const BUILT_IN_CONSTANTS = {
                    π: window.math.pi,
                    τ: window.math.tau, // GREEK SMALL LETTER TAU
                    ℯ: window.math.e, // ℯ SCRIPT SMALL E
                    ⅇ: window.math.e, // ⅇ DOUBLE-STRUCK ITALIC SMALL E
                    e: window.math.e,
                    ϕ: window.math.phi, //  GREEK SMALL LETTER PHI
                    ⅈ: window.math.i, // ⅈ DOUBLE-STRUCK ITALIC SMALL I
                    ⅉ: window.math.i, // ⅉ DOUBLE-STRUCK ITALIC SMALL J
                    i: window.math.i, //
                };
                const symbol =
                    typeof mathJson === 'string'
                        ? mathJson
                        : mathJson.sym;
                if (BUILT_IN_CONSTANTS[symbol]) {
                    result = new window.math.expression.node.ConstantNode(
                        BUILT_IN_CONSTANTS[symbol]
                    );
                }
                result = applySuperscriptAsPower(
                    result,
                    mathJson,
                    config
                );
            } else if (mathJson.op !== undefined) {
                if (
                    mathJson.lhs !== undefined &&
                    mathJson.rhs !== undefined
                ) {
                    const OPERATOR_FUNCTIONS = {
                        '+': 'add',
                        '-': 'subtract',
                        '*': 'multiply',
                        '/': 'divide',
                        // '.*': 'dotMultiply',
                        // './': 'dotDivide',
                        '%': 'mod',
                        mod: 'mod',
                    };
                    const args = [
                        mathJsonToMathjs(mathJson.lhs, config),
                        mathJsonToMathjs(mathJson.rhs, config),
                    ];
                    result = new window.math.expression.node.OperatorNode(
                        mathJson.op,
                        OPERATOR_FUNCTIONS[mathJson.op],
                        args
                    );
                } else if (mathJson.rhs !== undefined) {
                    const UNARY_OPERATOR_FUNCTIONS = {
                        '-': 'unaryMinus',
                        '+': 'unaryPlus',
                        // '~': 'bitNot',
                        // 'not': 'not'
                    };
                    result = new window.math.expression.node.OperatorNode(
                        mathJson.op,
                        UNARY_OPERATOR_FUNCTIONS[mathJson.op],
                        [mathJsonToMathjs(mathJson.rhs, config)]
                    );
                }
            } else if (mathJson.fn) {
                if (
                    mathJson.fn === 'log' ||
                    (mathJson.fn === 'ln' &&
                        mathJson.fn.sub !== undefined)
                ) {
                    result = new window.math.expression.node.FunctionNode(
                        'log',
                        getMathjsArgsWithSub(mathJson, config)
                    );
                } else if (mathJson.fn === 'lb') {
                    const args = getMathjsArgs(mathJson, config);
                    args.push(
                        new window.math.expression.node.ConstantNode(
                            window.math.bignumber(2)
                        )
                    );
                    result = new window.math.expression.node.FunctionNode(
                        'log',
                        args
                    );
                } else if (mathJson.fn === 'lg') {
                    result = new window.math.expression.node.FunctionNode(
                        new window.math.expression.node.SymbolNode(
                            'log10'
                        ),
                        getMathjsArgs(mathJson, config)
                    );
                } else {
                    const fnName =
                        {
                            '+': 'add',
                            '-': 'subtract',
                            '*': 'multiply',
                            '/': 'divide',
                            randomReal: 'random',
                            randomInteger: 'randomInt',
                            Gamma: 'gamma',
                            Re: 're',
                            Im: 'im',
                            binom: 'composition',
                            ucorner: 'ceil',
                            lcorner: 'floor',
                            arccos: 'acos',
                            arcsin: 'asin',
                            arctan: 'atan',
                            arcosh: 'acosh',
                            arsinh: 'asinh',
                        }[mathJson.fn] || mathJson.fn;

                    result = new window.math.expression.node.FunctionNode(
                        fnName,
                        getMathjsArgs(mathJson, config)
                    );
                }
            } else if (mathJson.group) {
                result = applySuperscriptAsPower(
                    mathJsonToMathjs(mathJson.group, config),
                    mathJson,
                    config
                );
            }

            return result;
        }

    }
    addQuestion = i => (e) => {
        e.preventDefault();
        document.getElementById(`action-button-${i}`).style.display = "none";
        document.getElementById(`step-${i}`).style.pointerEvents = "none";
        let counter = this.state.count.concat(['']);
        let data = getResultObject(this.ast, this.get_index, this.state);
    
        this.setState({
            count: counter,
            add: false,
            data: data
           })
        console.log('data', this.state.data)
    }


    handleDelete = i => e => {
        e.preventDefault();
        document.getElementById(`action-button-${i -1}`).style.display = "block";
        document.getElementById(`action-button-${i -1}`).style.display = "block";
        document.getElementById(`step-${i -1}`).style.pointerEvents = "auto";
       console.log('elem')
        let count = [
          ...this.state.count.slice(0, i)
         ]
      console.log('couunter', count);
      this.setState({
        count
      })
    }
    
    handleEnable=(condition)=>{
        if(condition) {
            document.getElementById("enable").style.display = "block";
        } else {
            document.getElementById("enable").style.display = "none";
        }
    }
    render() {
        const { count } = this.state
        console.log("this.state ", this.state);
        const { increquestion } = this.props;
        console.log('increquestion', increquestion);
        const geturl = url.data.question;
       const loadquestion = increquestion === 1 ? geturl.question1.ques_name :geturl.question0.ques_name
    console.log('q222222222222222', this.state.q2);
        return (
            <div>
                <div className="App">
                    <h5> {loadquestion}</h5>
                    <p className="editor-text">Use Math editor for calculation </p>
                    <div className="area-wrap">
                        <p>Enter the Greater number i.e., (a) as dividend and  the smaller number i.e (b) as divisor </p>
                        <span className={'fieldwrap num-area great'} ref={this.greaterRef} ></span>
                        <div className="grt-symbol">></div>
                        <span className={'fieldwrap num-area small'} ref={this.smallerRef}></span>
                        <label id="greaterLabel"></label>
                        <label id="smallerLabel" className="label-err"></label>
                    </div> 
                   
                    <div id="enable"> 
                     <h6 className="formula">Note: Dividend (a) = divisor (b) x quotient (q) + remainder (r)</h6>
                        {count.length > 0 && count !== 0 ? (count.slice(0, 4).map((count, index) => (
                          <div key={index} id={`step-${index}`} className="view-step">
                            <p>Step{(parseInt(`${index}`) + 1)}: &nbsp;
                             {(parseInt(`${index}`) + 1) === 1 ? url.data.step1 : (parseInt(`${index}`) + 1) === 2 ? url.data.step2 :(parseInt(`${index}`) + 1) === 3 ? url.data.step3 : (parseInt(`${index}`) + 1) ?url.data.step3 :url.data.step5 }</p>
                             <div className="wrap-set">
                            <span className={`fieldwrap view ${this.state.showfeild ? "all" : ''}`} ref={this.targetRef} data-value={index}>{/*this.state.data[index]*/}</span>
                            <span id={`${index}`} class="err-text"></span>
                            <span id={`action-button-${index}`}>
                                { parseInt(index) === 0 ? 
                                    (<button onClick={this.addQuestion(index)} className={'btn btn-primary editor-plus '} id="add-btn">+</button>) :
                                    (<><button onClick={this.handleDelete(index)} className={'editor-plus sub btn btn-primary'}>-</button>
                                    <button onClick={this.addQuestion(index)} className={' btn btn-primary editor-plus '} id="add-btn1">+</button> </>)
                                }   
                            </span>
                            </div>
                        </div>
                       ))) : null}
                            </div>
                    <pre id="output"></pre>

                </div>
            </div>
        );
    }

}
export default MultiMath;