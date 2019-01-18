import React, { Component } from 'react';
import './App.css';
import Canvas from './Canvas'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      driver: {
        activeLegID: 'AB',
        legProgress: '50',
        x: 20,
        y: 20,
        found: false,
      },
      stops: [],
      legs: [],
    }
  }

  componentDidMount() {
    this.getStops()
    this.getLegs()
  }

  getDriver = async () => {
    const response = await fetch('/driver')
    const body = await response.json()
    this.setState({ driver: body })
    console.log('DRIVER')
    console.log(this.state.driver)
  }

  getStops = async () => {
    const response = await fetch('/stops')
    const body = await response.json()
    this.setState({stops: body})
  }

  getLegs = async () => {
    const response = await fetch('/legs')
    const body = await response.json()
    await this.setState({ legs: body })
    console.log('LEGS')
    console.log(this.state.legs)
  }

  // var x = 'some string';
  // alert(x.charAt(0));

  getStopCoordinates = (stopName, stopsArray) => {
    for (let i = 0; i < stopsArray.length; i++) {
      if (stopsArray[i].name === stopName) {
        return { x: stopsArray[i].x, y: stopsArray[i].y }
        // console.log(stopsArray[i].x)
      }
    }
  }
  getDriverCoordinates = async () => {
    await resolveAfter(1000)
    if (this.state.stops.length > 0) {
      let xy1 = await this.getStopCoordinates(
        this.state.driver.activeLegID.charAt(0),
        this.state.stops
      )
      console.log(xy1)
      let xy2 = await this.getStopCoordinates(
        this.state.driver.activeLegID.charAt(1),
        this.state.stops
      )
      let progress = Number('0.' + this.state.driver.legProgress)
      let x = xy1.x + progress * Math.abs(xy2.x - xy1.x)
      let y = xy2.y + progress * Math.abs(xy2.y - xy1.y)
      // return {x, y}
      console.log(x, y)
      this.setState({
        driver: {
          x,
          y,
          activeLegID: this.state.driver.activeLegID,
          legProgress: progress,
        },
      })
      console.log(this.state.driver)
    }
  }

  handleSubmit = async e => {
    e.preventDefault()
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    })
    const body = await response.text()

    this.setState({ responseToPost: body })
  }

  render() {
    return (
      <div className="App">
        <Canvas
          driver={this.state.driver}
          id="canvas"
          getDriver={this.getDriverCoordinates}
          stops={this.state.stops}
          legs={this.state.legs}
        />
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;
