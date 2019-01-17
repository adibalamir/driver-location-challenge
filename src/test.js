import * as d3 from "d3";

var canvas = d3.select("canvas").call(d3.zoom().scaleExtent([1, 8]).on("zoom", zoom)),
context = canvas.node().getContext("2d"),
width = canvas.property("width"),
height = canvas.property("height");

let data = [[20,10], [20,20]]

draw(d3.zoomIdentity);

function zoom() {
context.clearRect(0, 0, width, height);
draw(d3.event.transform);
}

function draw(transform) {
let width = 400, height = 400;
for(let i = 0; i < width; i += 10) {
  context.moveTo(0, i)
  context.lineTo(width, i)
}
for(let i = 0; i < height; i += 10) {
  context.moveTo(i, 0)
  context.lineTo(i, height)
}
context.strokeStyle = "lightBlue"
context.stroke()
let j = -1, n = data.length, d;
context.beginPath();
while(++j < n) {
  d = transform.apply(data[j]);
  context.moveTo(d[0], d[1]);
  context.fillText("A", d[0], d[1]);
  console.log(data[j+1])
  if (data[j + 1] !== undefined) {
    context.lineTo(data[j+1][0], data[j+1][1])
  }
}
context.fill()
// panzoom(canvas)
}