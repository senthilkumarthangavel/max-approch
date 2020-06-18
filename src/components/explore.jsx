 import React, { Component } from 'react';
import HCF from './explore/hcf';

class MultiMath extends Component {
    render() {
        return (
            <React.Fragment>
                <HCF {...this.props}/>
            </React.Fragment>
        );
    }

}
export default MultiMath;