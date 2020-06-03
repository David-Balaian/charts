import React, { useState, useRef } from 'react';
import './App.css';

function App() {

  const [inputs, setInputs] = useState([25, 25, 25, 10])
  const [dragging, setDragging] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [last_position, setlast_position] = useState({ x: 0, y: 0 })
  let canvasRef = useRef();


  const handleChange = (value, i) => {
    if (typeof (+value) === "number" && value <= 100) {
      let cloneInputs = [...inputs];
      let currentSum = cloneInputs.reduce((total, item, j) => { if(i===j){return total}else{ return total + item}} ,0) 
      cloneInputs[i] = +value;
      let sum = cloneInputs.reduce((total, item) =>  total + item )
      console.log(sum, value, currentSum)
      if(sum<=100){
        setInputs(cloneInputs)
      }else{
        alert(`The sum of inputs can not be greater than 100 (Calculated max value is: ${100-currentSum}) `)
      }
    }
  }

  const addInput = () => {
    let cloneInputs = [...inputs];
    cloneInputs.push("")
    setInputs(cloneInputs)
  }


  const clearAll = () => {
    setInputs(inputs.map(item => ""))
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    draw(ctx, inputs, true)
  }


  const randomColor = ()=>{
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



  const draw = (ctx, percents, clear = false)=>{
    ctx.clearRect(0, 0, 300, 300);
    let endAlpha = 0;
    let startAlpha = 0;
    let color;
    if (clear) {
      ctx.clearRect(0, 0, 300, 300);
      return
    }

    for (let i = 0; i < percents.length; i++) {
      if (percents[i]) {
        color = randomColor()
        endAlpha += 360 * percents[i] / 100;
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.lineTo(150 + 150 * Math.sin(startAlpha * Math.PI / 180), 150 + 150 * Math.cos(startAlpha * Math.PI / 180));
        ctx.moveTo(150, 150);
        ctx.lineTo(150 + 150 * Math.sin(endAlpha * Math.PI / 180), 150 + 150 * Math.cos(endAlpha * Math.PI / 180));
        ctx.closePath()
        ctx.fillStyle = color;
        ctx.fill()
        ctx.beginPath()
        ctx.arc(150, 150, 150, 360 * Math.PI / 180 - startAlpha * Math.PI / 180 + Math.PI / 2, 360 * Math.PI / 180 - endAlpha * Math.PI / 180 + Math.PI / 2, true);
        ctx.lineTo(150, 150);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill()
        ctx.stroke()
        startAlpha = 360 * percents.reduce((total, item, j) => { if (j <= i) { return total + item } else { return total } }) / 100
      }
    };
  }


  function getMousePos(evt) {
    if (dragging) {
      var deltaX = last_position.x - evt.clientX,
        deltaY = last_position.y - evt.clientY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
        console.log("left")
        setZ(z + 5)
      } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
        setZ(z - 5)
      }


      setlast_position({
        x: evt.clientX,
        y: evt.clientY
      });
    } else {
      return
    }
  }








  return (
    <div className="App">
      <div className="inputs" >
        {inputs.map((input, i) => {
          return <input className="input" key={i}  placeholder="Percent" value={input} onChange={(e) => { handleChange(e.target.value, i) }} />
        })}
        <button className="button" onClick={addInput} > Add Input </button>

      </div>


      <div className="scene" style={{ transform: `rotateZ(${z}deg) rotateX(${x}deg) rotateY(${y}deg)` }} onMouseDown={() => { setDragging(true) }} onMouseUp={() => { setDragging(false) }} onMouseMove={(e) => { e.preventDefault(); getMousePos(e) }}>
        <div className="sphere" >
          <canvas style={{ position: "fixed" }} ref={canvasRef} width="300" height="300"  >
          </canvas>
          <div className="hemisphere">
          </div>
          <div className="hemisphere">
          </div>
        </div>
      </div>
      <div className="inputs">
      <button className="button" onClick={() => {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          draw(ctx, inputs)
        }} > Get Percent </button>
        <button className="button" onClick={clearAll} > Clear </button>
    </div>
    </div>

  );
}

export default App;
