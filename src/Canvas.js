import React, { Component } from 'react';
import { Stage, Layer, Circle, Text, Line } from "react-konva";


{/* <Line
  points={[stops[0].x, stops[0].y, stops[1].x, stops[1].y]}
  tension={0.5}
  closed
  stroke="black"
/> */}
{/* <Circle
  x={20}
  y={10}
  width={5}
  height={5}
  fill="red"
  shadowBlur={5}
  onClick={this.handleClick}
/> */}

class Canvas extends Component {
  render() {
    return (
      <Stage width={200} height={200} scaleY={-1} offsetY={200}>
        <Layer>
          {this.props.stops.map(stop=> <Circle key={stop.name} x={stop.x} y={stop.y} width={5} height={5} fill="red" shadowBlur={5} />)}
          {this.props.legs.map((leg, i) => <Line key={leg.legID} points={[this.props.stops[i].x, this.props.stops[i].y, this.props.stops[i+1].x, this.props.stops[i+1].y]} tension={0.5} close stroke={"blue"} />)}
        </Layer>
      </Stage>
    )
  }
}

export default Canvas