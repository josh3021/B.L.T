import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Home, Statics } from './pages';
import Navigators from './Navigators';
import axios from 'axios';

class App extends React.Component {
    
    render() {
        return (
            <Router>
                <div>
                    <Navigators />
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/statics" component={Statics} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;

