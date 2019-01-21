# Rose Rocket Driver Challenge

## How to Run the App

1. Copy or fork and clone the repository.
2. In terminal, run the command 'npm install'
3. Run 'node server.js'
4. In another terminal window, run 'npm start'

## Dependancies

- Node v10.15.0

### Back-end

- express
- body-parser
- npm-run-all

### Front-end

- react
- react-dom
- react-scripts
- konva
- react-konva
- node-sass

## Preview

This is the core app, the "Edit Driver Location Form" can be used to change the main driver's (blue dot) position. Use the dropdown to select the leg, and enter a number to choose what percentage of the leg the driver has completed.

![Preview GIF](/assets/preview.gif)

### Bonus-1

You can place a bonus driver on the map using x and y coordinates. A leg will be drawn between the bonus driver and the closest stop available.

![Bonus-1 GIF](/assets/bonus1.gif)