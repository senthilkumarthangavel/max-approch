import React, {Component} from 'react';

class ExplainChild extends Component{
   constructor(props) {
        super(props);
        this.state = {hidden : true};
    }
   componentDidMount() {
        setTimeout(() => {
            this.setState({hidden: false});
        }, this.props.waitBeforeShow);
    }
   render() {
        return this.state.hidden ? '' : this.props.children;
    }
}

export default ExplainChild;