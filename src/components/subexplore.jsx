import React, { Component } from 'react';
import { MathFieldComponent } from 'react-mathlive';
import MathLive from 'mathlive';


class subexplore extends Component{

    constructor(){
        super();
        this.targetRef = React.createRef();
        this.state={
            count: [1],
            add: false
        }
    }



    handleClick(e){

        const target = e.target;
     
        if (target) {
         console.log('target', target);
       const mathField = MathLive.makeMathField(target);
       console.log('mathField', mathField);
 
       mathField.$setConfig({
         virtualKeyboardMode: 'onfocus',
         virtualKeyboards: 'all',
      
         onContentDidChange: mathfield => {
           try {
               const ast = MathLive.latexToAST(mathfield.$text());
               document.getElementById(
                   'output'
               ).innerHTML = JSON.stringify(
                   mathJsonToMathjs(ast, {}).eval()
               );
               // document.getElementById('output').innerHTML = JSON.stringify(ast);
           } catch (e) {
               document.getElementById('output').innerHTML = '😕';
           }
         },
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
                    arsinh: '         asinh',
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

    

    addQuestion = () =>{
        let counter = this.state.count.concat([''])
        this.setState({
            count: counter,
            add: (!this.state.add)
        })
       
        
    }

     handleDelete = i => e => {
        e.preventDefault()
        let newarr = [
          ...this.state.count.slice(0, i),
          ...this.state.count.slice(i + 1)
        ]
        this.setState({
             count: newarr
        })
      }

    render(){
         const { count } = this.state
         
        return(
            <div>
                    
      <div className="App">
          <p>Use Math editor for calculation </p>
      { count.length > 0 && count !== 0 ? (count.slice(0, 4).map((count, index ) => (
        
          <div key={index} className="wrap-set">
        <p>Step:&nbsp;{parseInt(`${index}`) + 1}</p>

         <span className={'fieldwrap'} ref={this.targetRef} onClick={(e)=>this.handleClick(e)}></span>  
         
         {parseInt(index) + 1 ===  1 ?
          <><button onClick={this.addQuestion} className={'editor-plus btn btn-primary'}>+</button> </>: 
         <><button onClick={this.handleDelete(index)} className={'editor-plus sub btn btn-primary'}>-</button>
         <button onClick={this.addQuestion} className={'editor-plus btn btn-primary'}>+</button> </>}
          </div>
        ))  ) : null }
     
         <pre id="output"></pre>

      </div>
            </div>
        );
    }


     
}
export default subexplore;