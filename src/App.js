import React, { Component } from 'react'
import './App.css'
import Canvas from './Canvas'

function resolveAfter(t) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved')
    }, t)
  })
}

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
    this.getDriver()
    this.getDriverCoordinates()
  }

  getDriver = async () => {
    const response = await fetch('/driver')
    const body = await response.json()
    this.setState({ driver: body })
  }

  getStops = async () => {
    const response = await fetch('/stops')
    const body = await response.json()
    await this.setState({ stops: body })
  }

  getLegs = async () => {
    const response = await fetch('/legs')
    const body = await response.json()
    await this.setState({ legs: body })
  }

  getStopCoordinates = (stopName, stopsArray) => {
    for (let i = 0; i < stopsArray.length; i++) {
      if (stopsArray[i].name === stopName) {
        return { x: stopsArray[i].x, y: stopsArray[i].y }
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
      let xy2 = await this.getStopCoordinates(
        this.state.driver.activeLegID.charAt(1),
        this.state.stops
      )
      let progress = Number('0.' + this.state.driver.legProgress)
      let x = xy1.x + progress * (xy2.x - xy1.x)
      let y = xy1.y + progress * (xy2.y - xy1.y)
      this.setState({
        driver: {
          x,
          y,
          activeLegID: this.state.driver.activeLegID,
          legProgress: progress,
        },
      })
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
    // this.getStopCoordinates("A", this.state.stops)
    console.log('Rendering app...')
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
    )
  }
}

export default App
