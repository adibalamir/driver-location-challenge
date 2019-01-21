import React, { Component } from 'react'
import './App.scss'
import Canvas from './Canvas'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      driver: {
        activeLegID: '',
        legProgress: '',
        x: undefined,
        y: undefined,
      },
      bonusDriver: {
        x: '',
        y: '',
        bonusLeg: ''
      },
      stops: [],
      legs: [],
      legInput: '',
      bonusDriverInput: {},
      isLoading: false,
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    this.fetchData()
  }

  fetchData = async () => {
    try {
      let [driverRes, stopsRes, legsRes, bonusDriverRes] = await Promise.all([
        fetch('/driver'),
        fetch('/stops'),
        fetch('/legs'),
        fetch('bonusDriver')
      ])

      const driver = await driverRes.json()
      const stops = await stopsRes.json()
      const legs = await legsRes.json()
      const bonusDriver = await bonusDriverRes.json()

      this.setState(
        {
          driver,
          stops,
          legs,
          bonusDriver
        },
        this.getDriverCoordinates
      )
    } catch (err) {
      console.log(err)
    }
  }

  getStopCoordinates = (stopName, stopsArray) => {
    for (let i = 0; i < stopsArray.length; i++) {
      if (stopsArray[i].name === stopName) {
        return { x: stopsArray[i].x, y: stopsArray[i].y }
      }
    }
  }

  getDriverCoordinates = async () => {
    this.setState({ legInput: this.state.driver.activeLegID })
    let xy1 = await this.getStopCoordinates(
      this.state.driver.activeLegID.charAt(0),
      this.state.stops
    )
    let xy2 = await this.getStopCoordinates(
      this.state.driver.activeLegID.charAt(1),
      this.state.stops
    )
    let progress = Number(this.state.driver.legProgress)
    let x = xy1.x + (progress / 100) * (xy2.x - xy1.x)
    let y = xy1.y + (progress / 100) * (xy2.y - xy1.y)
    this.setState({
      driver: {
        x,
        y,
        activeLegID: this.state.driver.activeLegID,
        legProgress: progress,
      },
      isLoading: false,
    })
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.setState({ loading: true })
    const response = await fetch('/driver', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        progressInput: this.state.driver.legProgress,
        leg: this.state.legInput,
      }),
    })
    const json = await response.text()
    const body = JSON.parse(json)

    this.setState(
      {
        driver: {
          ...this.state.driver,
          legProgress: body.progressInput,
          activeLegID: body.leg,
        },
      },
      this.getDriverCoordinates
    )
  }

  getBonusLeg = (stops) => {
    let bonusDriver = this.state.bonusDriver
    let closestStop = {x: stops[0].x, y: stops[0].y}
    console.log(bonusDriver.x)
    console.log(closestStop.x)
    console.log()
    let distance = Math.sqrt(Math.pow((closestStop.y - bonusDriver.y), 2) + Math.pow((closestStop.x - bonusDriver.x), 2))
    console.log(distance)
    for (let i = 1; i < stops.length; i++) {
      let currDistance = Math.sqrt(Math.pow((stops[i].y - bonusDriver.y), 2) + Math.pow((stops[i].x - bonusDriver.x), 2))
      if (currDistance < distance) {
        distance = currDistance
        closestStop = stops[i]
      }
    }
    this.setState({bonusDriver: {...this.state.bonusDriver, bonusLeg: closestStop}})
  }

  handleBonusSubmit = async e => {
    e.preventDefault()
    this.setState({ loading:true })
    const response = await fetch('/bonusDriver', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        xInput: this.state.bonusDriverInput.x,
        yInput: this.state.bonusDriverInput.y
      })
    })
    const json = await response.text()
    const body = JSON.parse(json)

    this.setState({
      bonusDriver: {
        ...this.state.bonusDriver,
        x: body.xInput,
        y: body.yInput,
      }
    })
    this.getBonusLeg(this.state.stops)
  }

  handleClick = e => {
    this.setState({ legInput: e.target.value })
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <div className="App">
          <h1 className="App-header">Rose Rocket Challenge</h1>
          <div id="canvas">
            {
              <Canvas
                driver={this.state.driver}
                bonusDriver={this.state.bonusDriver}
                getDriver={this.getDriverCoordinates}
                stops={this.state.stops}
                legs={this.state.legs}
                isSubmit={this.state.isSubmit}
              />
            }
          </div>
          <div id="position-form">
            <form onSubmit={this.handleSubmit}>
              <p className="header">Edit Driver Location</p>
              <div className="choose-leg">
                <p>Choose a leg: </p>
                <select onClick={this.handleClick} name="legs" multiple>
                  {this.state.legs.map(leg => {
                    if (leg.legID === this.state.driver.activeLegID) {
                      return (
                        <option key={leg.legID} selected={true} value={leg.legID}>
                          {leg.legID}
                        </option>
                      )
                    } else {
                      return <option key={leg.legID} value={leg.legID}>{leg.legID}</option>
                    }
                  })}
                </select>
              </div>
              <hr />
              <div className="choose-progress">
                <p>Progress (0-100%): </p>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={this.state.driver.legProgress}
                  onChange={e =>
                    this.setState({
                      driver: {
                        ...this.state.driver,
                        legProgress: e.target.value,
                      },
                    })
                  }
                />
                %
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
          <form className="bonus-driver-form" onSubmit={this.handleBonusSubmit}>
            x:<input 
              type="number"
              min="0"
              max="200"
              value={this.state.bonusDriverInput.x}
              onChange={e => this.setState({bonusDriverInput: {...this.state.bonusDriverInput, x: e.target.value}})}
            />
            y:<input
              type="number"
              min="0"
              max="200"
              value={this.state.bonusDriverInput.y}
              onChange={e => this.setState({bonusDriverInput: {...this.state.bonusDriverInput ,y: e.target.value}})}
            />
            <button>Submit</button>
          </form>
        </div>
      )
    } else {
      return <p>Loading...</p>
    }
  }
}

export default App
