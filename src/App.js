import React, { Component } from 'react'
import './App.scss'
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
        x: -200,
        y: -200,
      },
      stops: [],
      legs: [],
      legInput: 'AB',
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
    await resolveAfter(30)
    if (this.state.stops.length > 0) {
      let xy1 = await this.getStopCoordinates(
        this.state.driver.activeLegID.charAt(0),
        this.state.stops
      )
      let xy2 = await this.getStopCoordinates(
        this.state.driver.activeLegID.charAt(1),
        this.state.stops
      )
      let progress = Number(this.state.driver.legProgress)
      let x = xy1.x + (progress/100) * (xy2.x - xy1.x)
      let y = xy1.y + (progress/100) * (xy2.y - xy1.y)
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
    this.setState({loading: true})
    const response = await fetch('/driver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        progressInput: this.state.driver.legProgress,
        leg: this.state.legInput
      }),
    })
    const json = await response.text()
    const  body = JSON.parse(json)
    console.log(body.leg)

    this.setState({ 
      driver: {
        ...this.state.driver,
        legProgress: body.progressInput,
        activeLegID: body.leg
    } 
    }, this.getDriverCoordinates)
  }

  handleClick = e => {
    this.setState({legInput: e.target.value})
  }

  render() {
    return (
      <div className="App">
      <h1 className="App-header">Rose Rocket Challenge</h1>
      <div id='canvas'>
      {<Canvas
        driver={this.state.driver}
        getDriver={this.getDriverCoordinates}
        stops={this.state.stops}
        legs={this.state.legs}
      />}
      </div>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Edit Driver:</strong>
          </p>
          <select onClick={this.handleClick} name="legs" multiple>
            {this.state.legs.map(leg => <option value={leg.legID}>{leg.legID}</option>)}
          </select>
          <br />
          <input
            type="number"
            min="0"
            max="100"
            value={this.state.driver.legProgress}
            onChange={e => this.setState({ driver: {...this.state.driver, legProgress: e.target.value} })}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default App
