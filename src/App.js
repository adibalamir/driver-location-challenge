import React, { Component } from 'react';
import './App.css';


class App extends Component {

  state = {
    driver: '',
    stops: '',
    legs: '',
    post: '',
    responseToPost: '',
  };

  componentDidMount() {
    console.log('hi')
    this.callAPI()
      .then(res => this.setState({response: res[0].name}))
      .catch(err => console.log(err))
  }

  // callAPI = async () => {
  //   const response = await fetch('/stops')
  //   const body = await response.json()

  //   if (response.status !==200) throw Error(body.message)

  //   return body
  // }

  getStops = async () => {
    const response = await fetch('/stops')
    const body = await response.json()

    if (response.status !==200) throw Error(body.message)

    return body
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
        <canvas width='960' height='500' id='canvas'></canvas>
        <p>{this.state.response}</p>
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
