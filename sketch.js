const rows = 40
const columns = 40
const direcciones = [ 'arriba', 'derecha', 'abajo', 'izquierda' ]
const fpsLimiter = 5
let culebra
let fruta
let playing
let frames

class Culebra{
  constructor(){
    this.cabeza = {
      fila: Math.round(random(rows*0.2,rows*0.8)),
      columna: Math.round(random(columns*0.2,columns*0.8)),
      }
    this.direccion = '',
    this.cola = []
  }  
  mover(){
    this.moverCola()
    switch (this.direccion) {
      case 'arriba':
        this.cabeza.fila-- 
        break;
      case 'derecha':
        this.cabeza.columna++ 
        break;
      case 'abajo':
        this.cabeza.fila++ 
        break;
      case 'izquierda':
        this.cabeza.columna-- 
        break;
    }
  }
  crecer(){
    const newPedazo = [this.cabeza.fila,this.cabeza.columna]
    this.cola.push(newPedazo)
  }
  moverCola(){
    if(this.cola.length > 0){
      let newCola = this.cola.reverse()
      newCola = newCola.map( (pedazo, index) => {
        if(index<newCola.length-1)
          return newCola[index+1]
      })
      this.cola = newCola.reverse()
      this.cola[0] = [this.cabeza.fila,this.cabeza.columna]
    }
  }
  dibujar(){
    this.dibujarCola()
    this.dibujarCabeza()
  }
  dibujarCabeza(){
    const squareWidth = width/columns
    const squareHeight = height/rows
    stroke(30,20,60)
    fill(0,200,100)
    const x = squareWidth*this.cabeza.fila
    const y = squareHeight*this.cabeza.columna
    rect(x,y,squareWidth,squareHeight)
  }
  dibujarCola(){
    const squareWidth = width/columns
    const squareHeight = height/rows
    stroke(30,20,60)
    fill(0,200,100)
    this.cola.map( (pedazo,index) => {
      if(index<this.cola.length){
        const x = squareWidth*pedazo[0]
        const y = squareHeight*pedazo[1]
        rect(x,y,squareWidth,squareHeight)
      }
    })
  }
  checkComida(){
    if(fruta.posicion[0] === this.cabeza.fila && fruta.posicion[1] === this.cabeza.columna){
      this.crecer()
      fruta = new Fruta(this)
    }
  }
}
class Fruta{
  constructor(culebra){
    this.posicion = this.randomPosition(culebra)
  }
  randomPosition(){
    const newPos = [Math.round(random(1,rows-1)),Math.round(random(1,columns-1))]
    if( culebra.cola.indexOf(newPos) !== -1 || 
    newPos === [culebra.cabeza.fila,culebra.cabeza.columna]){
      return randomPosition(culebra,[rows,columns])
    } 
    return newPos
  }
  dibujar(){
    const squareWidth = width/columns
    const squareHeight = height/rows
    const x = squareWidth*this.posicion[0]- squareWidth/2
    const y = squareHeight*this.posicion[1] - squareHeight/2
    fill(250,0,200)
    ellipse(x,y,squareWidth,squareHeight)
  }
}
function setup(){
  createCanvas(400 , 400)
  frames= 0
  playing = true
  culebra = new Culebra()
  fruta = new Fruta(culebra)
}
function draw(){
  if(frames%fpsLimiter===0){
  background(10);
  fruta.dibujar()
  culebra.dibujar()
  checkLimites(culebra)
  culebra.checkComida()
  culebra.mover()
  }
  frames++
}
function checkLimites(){
  if(culebra.direccion){
    const proximaCasilla = getCasilla(culebra.direccion)
    if(proximaCasilla[0] >= rows || proximaCasilla[0] < 0){
      culebra = new Culebra()
      fruta = new Fruta(culebra)
    }
    if(proximaCasilla[1] >= columns || proximaCasilla[1] < 0){
      culebra = new Culebra()
      fruta = new Fruta(culebra)
    }
  }
}
function keyPressed(){
  if( culebra.direccion !== direcciones[2] && ( keyCode === 65 || keyCode === 37))// W o arriba
    return culebra.direccion = direcciones[0]
  if(culebra.direccion !== direcciones[3] && ( keyCode === 83 || keyCode === 40))// D o derecha
    return culebra.direccion = direcciones[1]
  if(culebra.direccion !== direcciones[0] && ( keyCode === 68 || keyCode === 39))// S o abajo
    return culebra.direccion = direcciones[2]
  if(culebra.direccion !== direcciones[1] && ( keyCode === 87 || keyCode === 38)) //A o izquierda
  return culebra.direccion = direcciones[3]
}
function getCasilla( direccion ){
  const fila = culebra.cabeza.fila
  const columna = culebra.cabeza.columna
  switch (direccion) {
    case 'arriba':
      return [fila, columna-1]
    case 'derecha':
      return [fila+1,columna]
    case 'abajo':
      return [fila, columna+1]
    case 'izquierda':
      return [fila-1,columna]
    }
}
