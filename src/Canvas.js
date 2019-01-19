import React, { Component } from 'react'
import { Stage, Layer, Circle, Line /*Text*/ } from 'react-konva'

/* <Line
  points={[stops[0].x, stops[0].y, stops[1].x, stops[1].y]}
  tension={0.5}
  closed
  stroke="black"
/> */
/* <Circle
  x={20}
  y={10}
  width={5}
  height={5}
  fill="red"
  shadowBlur={5}
  onClick={this.handleClick}
/> */

class Canvas extends Component {
  render() {
    console.log('Rendering canvas...')
    console.log(this.props.driver)

    let visitedByDriver = true

    return (
      <Stage
        margin={'auto'}
        width={window.innerWidth}
        height={400}
        scaleY={-1}
        offsetY={400}
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
              console.log('already traveled')
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
              console.log('driver on leg')
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
              console.log('progress left')
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
