const rows = 40
const columns = 40
const direcciones = [ 'arriba', 'derecha', 'abajo', 'izquierda' ]
const fpsLimiter = 5
const PRIMARY_COLOR = '#262626'
let culebra
let fruta
let frames

class Culebra{
  constructor(){
    this.cabeza = {
      fila: Math.round(random(rows*0.2,rows*0.8)),
      columna: Math.round(random(columns*0.2,columns*0.8)),
      }
    this.direccion = '',
    this.ultimoMovimiento = '',
    this.cola = []
  }  
  mover(){
    this.moverCola()
    switch (this.direccion) {
      case 'arriba':
        this.cabeza.columna-- 
        break;
      case 'derecha':
        this.cabeza.fila++ 
        break;
      case 'abajo':
        this.cabeza.columna++ 
        break;
      case 'izquierda':
        this.cabeza.fila-- 
        break;
    }
    this.ultimoMovimiento = this.direccion
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
    stroke(PRIMARY_COLOR)
    noFill()
    const x = squareWidth*this.cabeza.fila
    const y = squareHeight*this.cabeza.columna
    rect(x,y,squareWidth,squareHeight)
    this.dibujarOjos(x,y,squareWidth,squareHeight)
  }
  dibujarOjos(x,y,w,h){
    if(!this.direccion)return
    stroke(PRIMARY_COLOR)
    fill(PRIMARY_COLOR)
    const horizontal = this.direccion === 'arriba'|| this.direccion === 'abajo'
    const eyeWidth = horizontal? w*0.2 : w*0.4
    const eyeHeight = horizontal? h*0.4 : h*0.2
    switch (this.direccion) {
      case 'arriba':
        rect(x+w*0.2,y+h*0.2,eyeWidth,eyeHeight)
        rect(x+w*0.6,y+h*0.2,eyeWidth,eyeHeight)
        break;
      case 'derecha':
        rect(x+w*0.4,y+h*0.2,eyeWidth,eyeHeight)
        rect(x+w*0.4,y+h*0.6,eyeWidth,eyeHeight)
        break;
      case 'abajo':
        rect(x+w*0.2,y+h*0.4,eyeWidth,eyeHeight)
        rect(x+w*0.6,y+h*0.4,eyeWidth,eyeHeight)
        break;
      case 'izquierda':
        rect(x+w*0.2,y+h*0.2,eyeWidth,eyeHeight)
        rect(x+w*0.2,y+h*0.6,eyeWidth,eyeHeight)
        break;
    
      default:
        break;
    }

    
  }
  dibujarCola(){
    const squareWidth = width/columns
    const squareHeight = height/rows
    this.cola.map( pedazo => {
      const x = squareWidth*pedazo[0]
      const y = squareHeight*pedazo[1]
      stroke(PRIMARY_COLOR)
      noFill()
      rect(x,y,squareWidth,squareHeight)
      fill(PRIMARY_COLOR)
      rect(x+squareWidth*0.2,y+squareHeight*0.2,squareWidth*0.6,squareHeight*0.6)
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
    const cabeza = [culebra.cabeza.fila,culebra.cabeza.columna]
    const newPos = [Math.round(random(1,rows-1)),Math.round(random(1,columns-1))]
    if( estaEnMiCola(newPos) || newPos === cabeza){
      return this.randomPosition()
    } 
    return newPos
  }
  dibujar(){
    const squareWidth = width/columns
    const squareHeight = height/rows
    const x = squareWidth*this.posicion[0]+ squareWidth/2
    const y = squareHeight*this.posicion[1] + squareHeight/2
    stroke(PRIMARY_COLOR)
    noFill()
    ellipse(x,y,squareWidth,squareHeight)
    fill(PRIMARY_COLOR)
    ellipse(x,y,squareWidth*0.6,squareHeight*0.6)
    
  }
}
function setup(){
  createCanvas(400 , 400)
  frames= 0
  culebra = new Culebra()
  fruta = new Fruta(culebra)
}
function draw(){
  if(frames%fpsLimiter===0){
  background('#98A682');
  fruta.dibujar()
  culebra.dibujar()
  checkColisiones()
  culebra.checkComida()
  culebra.mover()
  }
  frames++
}
function checkColisiones(){
  if(culebra.direccion){
    const proximaCasilla = getCasilla(culebra.direccion)
    const limiteVertical = proximaCasilla[0] >= rows || proximaCasilla[0] < 0
    const limiteHorizontal = proximaCasilla[1] >= columns || proximaCasilla[1] < 0
    const propioCuerpo = estaEnMiCola([culebra.cabeza.fila,culebra.cabeza.columna]) 
    if( limiteHorizontal || limiteVertical || propioCuerpo){
      restart()
    }
  }
}
function estaEnMiCola( [ fila, columna ] ){
  let siEsta = false
  culebra.cola.map( pedazo => {
    if(pedazo[0] === fila && pedazo[1] === columna)
    siEsta=true
  })
  return siEsta
}
function keyPressed(){
  if( canMove(2,87,38) )// W o arriba 
    return culebra.direccion = direcciones[0]
  if( canMove(3,68,39))// D o derecha
    return culebra.direccion = direcciones[1]
  if( canMove(0,83,40))// S o abajo
    return culebra.direccion = direcciones[2]
  if( canMove(1,65,37) ) //A o izquierda
    return culebra.direccion = direcciones[3]
}
function canMove( opuesto, wasd, flechas ){
  return ( 
    culebra.ultimoMovimiento !== direcciones[opuesto] 
    && ( keyCode === wasd || keyCode === flechas) 
  )
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
function restart(){
  culebra = new Culebra()
  fruta = new Fruta(culebra)
}