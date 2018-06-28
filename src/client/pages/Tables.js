import React from 'react';
import axios from 'axios';

class Tables extends React.Component {
    constructor() {
        super();

        this.state = {
            main: []
        };
    }
    componentDidMount(){
        axios('/statics/user')
        .then(result => {
            let Dan = result.data.UserDan;
            let Rep = result.data.UserRep;
            let Main = new Array();
            let danDiv = Dan.map(dan => {
                return (
                    <div className="UserDan">{dan}</div>
                )
            });
            let repDiv = Rep.map(rep => {
                return (
                    <div className="UserRep">{rep}</div>
                )
            });
            for(let i in numDiv) {
                Main.push(danDiv[i].props.children+', '+repDiv[i].props.children);
            }
            this.setState({
                main:Main
            });
        })
    }

    render() {
        
        return (
            <div className="User">
                {this.state.main}
                <br />
            </div>
        )
    }
}

export default Tables