import React, { Component } from 'react'
import { Stage, Layer, Circle, Line /*Text*/ } from 'react-konva'

class Canvas extends Component {
  render() {
    let bonusDriver
    

    if (
      this.props.bonusDriver.x !== '' &&
      this.props.bonusDriver.bonusLeg !== undefined
    ) {
      bonusDriver = (
        <React.Fragment key={this.props.bonusDriver.bonusLeg.name}>
          <Circle
            x={this.props.bonusDriver.x}
            y={this.props.bonusDriver.y}
            width={4}
            height={4}
            fill="red"
          />
          <Line
            points={[
              this.props.bonusDriver.x,
              this.props.bonusDriver.y,
              this.props.bonusDriver.bonusLeg.x,
              this.props.bonusDriver.bonusLeg.y,
            ]}
            stroke={'black'}
            strokeWidth={0.8}
          />
        </React.Fragment>
      )
    }
    let visitedByDriver = true
    return (
      <Stage
        width={400}
        height={400}
        scaleY={-1}
        offsetY={380}
        draggable={true}
      >
        <Layer offsetX={0} scaleX={3} scaleY={2.5}>
          {this.props.stops.map(stop => (
            <Circle
              key={stop.name}
              x={stop.x}
              y={stop.y}
              width={2.5}
              height={2.5}
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
                  strokeWidth={0.8}
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
                    strokeWidth={0.8}
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
                    strokeWidth={0.8}
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
                  strokeWidth={0.8}
                  dash={[3, 3]}
                />
              )
            }
          })}
          <Circle
            x={this.props.driver.x}
            y={this.props.driver.y}
            width={4}
            height={4}
            fill="blue"
          />
          {bonusDriver}
        </Layer>
      </Stage>
    )
  }
}

export default Canvas
