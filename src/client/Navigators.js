import React from 'react';
import {NavLink} from 'react-router-dom';

class Navigators extends React.Component {
    render() {
        return (
            <div className="Navigators">
                <NavLink exact to="/"> </NavLink>
                <NavLink to="/statics">  </NavLink>
            </div>
        );
    }
};
export default Navigators;