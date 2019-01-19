import React, { Component } from 'react'
import { Stage, Layer, Circle, Line /*Text*/ } from 'react-konva'

class Canvas extends Component {
  render() {
    let visitedByDriver = true
    return (
      <Stage
        width={400}
        height={400}
        scaleY={-1}
        offsetY={400}
        draggable={true}
      >
        <Layer offsetX={-50} scaleX={3} scaleY={3}>
          {this.props.stops.map(stop => (
            <Circle
              key={stop.name}
              x={stop.x}
              y={stop.y}
              width={4}
              height={4}
              fill="black"
            />
          ))}
          {this.props.legs.map((leg, i) => {
            if (
              this.props.driver.activeLegID !== leg.legID &&
              visitedByDriver
            ) {
              return (
                <Line
                  key={leg.legID}
                  points={[
                    this.props.stops[i].x,
                    this.props.stops[i].y,
                    this.props.stops[i + 1].x,
                    this.props.stops[i + 1].y,
                  ]}
                  tension={2}
                  close
                  stroke={'#f716ca'}
                  strokeWidth={1}
                  dash={[0, 0]}
                />
              )
            } else if (this.props.driver.activeLegID === leg.legID) {
              visitedByDriver = false
              return (
                <React.Fragment key={leg.legID}>
                  <Line
                    points={[
                      this.props.stops[i].x,
                      this.props.stops[i].y,
                      this.props.driver.x,
                      this.props.driver.y,
                    ]}
                    tension={2}
                    close
                    stroke={'#f716ca'}
                    strokeWidth={1}
                    dash={[0, 0]}
                  />
                  <Line
                    points={[
                      this.props.driver.x,
                      this.props.driver.y,
                      this.props.stops[i + 1].x,
                      this.props.stops[i + 1].y,
                    ]}
                    tension={2}
                    close
                    stroke={'#f716ca'}
                    strokeWidth={1}
                    dash={[3, 3]}
                  />
                </React.Fragment>
              )
            } else if (
              this.props.driver.activeLegID !== leg.legID &&
              !visitedByDriver
            ) {
              return (
                <Line
                  key={leg.legID}
                  points={[
                    this.props.stops[i].x,
                    this.props.stops[i].y,
                    this.props.stops[i + 1].x,
                    this.props.stops[i + 1].y,
                  ]}
                  tension={2}
                  close
                  stroke={'#f716ca'}
                  strokeWidth={1}
                  dash={[3, 3]}
                />
              )
            }
          })}
          <Circle
            x={this.props.driver.x}
            y={this.props.driver.y}
            width={5}
            height={5}
            fill="blue"
          />
        </Layer>
      </Stage>
    )
  }
}

export default Canvas
