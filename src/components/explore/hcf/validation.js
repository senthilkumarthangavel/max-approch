export const validate = (json, index, state) => {

    let a = state.q1, b = state.q2, q = getQuotient(a, b), r = getReminder(a, b);

    console.log('aaa', a);
    if (index > 0) {
        a = state && state.data && state.data[index - 1] && state.data[index - 1]['b'] ? state.data[index - 1]['b'] : state.q2;
        b = state && state.data && state.data[index - 1] && state.data[index - 1]['r'] ? state.data[index - 1]['r'] : state.q1;
        q = getQuotient(a, b);
        r = getReminder(a, b);
    }


    console.log('value_index', index)
    console.log("result ", json);
    console.log("state ", state);
    console.log("a ", a);
    console.log("b ", b);
    console.log("q ", q);
    console.log("r ", r);


    //condition1 -  Dividend check
    console.log('json', json)
     const q1_num = json.num ? json.num : json.arg[0].num;
     if (parseInt(q1_num) !== parseInt(a)) {
        return "Dividend is not correct!";
    }

    //condition2 - first operand check
    const operand_one = json.fn;
     if (operand_one !== 'equal') {
        return "String must have equal!";
    }

    // condition3 -  divisor check
    const q2_num = json.arg[1].num ? json.arg[1].num : json.arg[1].arg[0].arg[0].num;
    if (parseInt(q2_num) !== parseInt(b)) {
        return "Divisor is not correct"
    }

    // condition4 - second operand check

    const operand_two = json.arg[1].arg[0].fn ? json.arg[1].arg[0].fn : json.arg[1].fn;
   // console.log('operand_two', operand_two);
    if (operand_two !== 'multiply') {
        return "String must have Multiply"
    }

    /// condition5 - quotient check
    const q3_num = json.arg[1].arg[0].arg[1].num;
    //console.log('q3_numm', q3_num);
    if(parseInt(q3_num) !== parseInt(q)){
        return "quotient is not correct"
    }

    //  condition6 - third operand check
    const operand_three = json.arg[1].fn;
    if(operand_three !== 'add'){
        return "String must have Addition"
    } 

    //  condition7 - remainder check
    const q4_num = json.arg[1].arg[1].num;
    //console.log('q4_num', q4_num);
    if(parseInt(q4_num) !== parseInt(r)){
        return "Remainder is not correct"
    } 

    return true;
};

export const getResultObject = (json, index, state) => {

    const q1_num = parseInt(json.arg[0].num);
    console.log('q1_numm', q1_num);
    const q2_num = parseInt(json.arg[1].num ? json.arg[1].num : json.arg[1].arg[0].arg[0].num);
    console.log('q2_numm', q2_num)
    const q3_num = getQuotient(q1_num, q2_num);
    console.log('q3_numm', q3_num)
    const q4_num = getReminder(q1_num, q2_num);
    console.log('q4_numm', q4_num);
   

    let Obj = {
        'a': q1_num,
        'b': q2_num,
        'q': q3_num,
        'r': q4_num,
    };

    let data = state && state.data ? state.data : {};
    data[index] = Obj;

    return data;
}

const getReminder = (q1, q2) => {

    let remainder_num;

    if (q1 > q2) {
        remainder_num = (Math.floor(q1 % q2));
    }
    return remainder_num;
}

const getQuotient = (q1, q2) => {

    let quotient_num;

    if (q1 > q2) {
        quotient_num = (Math.floor(q1 / q2));
    } 

    return quotient_num;
}