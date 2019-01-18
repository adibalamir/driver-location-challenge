import React, { Component } from 'react';
import './App.css';
import Canvas from './Canvas'


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      stops: [],
      legs: []
    };
  }

  componentDidMount() {
    this.getStops()
    this.getLegs()
  }

  getStops = async () => {
    const response = await fetch('/stops')
    const body = await response.json()
    this.setState({stops: body})
  }

  getLegs = async () => {
    const response = await fetch('/legs')
    const body = await response.json()
    this.setState({legs: body})
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
        <Canvas stops={this.state.stops} legs={this.state.legs} />
        {this.state.stops.map(stop=> <p key={stop.name}>{stop.name}</p>)}
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
