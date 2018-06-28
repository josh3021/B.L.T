import React from 'react';
import {XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineSeries} from 'react-vis';
import Tables from './Tables';

class Statics extends React.Component {

    render() {
        const data = [
            {x: 0, y: 8},
            {x: 1, y: 5},
            {x: 2, y: 4},
            {x: 3, y: 9},
            {x: 4, y: 1},
            {x: 5, y: 7},
            {x: 6, y: 6},
            {x: 7, y: 3},
            {x: 8, y: 2},
            {x: 9, y: 0}
        ];
    
    
        return (
            <div>
                <h2>
                    this is statics
                </h2>
                <div className="UserTable">
                    <Tables />
                </div>
                <div>
                    <div className="App">
                        <XYPlot height={300} width={300}>
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis />
                            <YAxis />
                            <LineSeries data={data} />
                        </XYPlot>
                    </div>
                </div>
            </div>
        );
    }
}

export default Statics;