const rows = 100
const columns = 100
const direcciones = [ 'arriba', 'derecha', 'abajo', 'izquierda' ]
let board
let squares
let culebra

function setup(){
  createCanvas(1000 , 1000);
  board = []
  for ( let i = 0; i < rows; i++ ){
    board[i] = []
    for( let j = 0; j < columns; j++ )
      board[i][j]= ' '
  }
  culebra = {
    cabeza: {
      fila: Math.round(random(20,80)),
      columna: Math.round(random(20,80)),
    },
    direccion: direcciones[Math.round(random(0,4))],
    cola: [],
  }
}

function draw(){
  const squareWidth = width*0.9/columns
  const squareHeight = height*0.9/rows
  background(30,20,60);
  noStroke()
  fill(10)
  squares = board.map( ( row, rowIndex ) => {
    row.map( ( square, columnIndex) => {
      return rect((width*0.05)+squareWidth*columnIndex,(height*0.05)+squareHeight*rowIndex,squareWidth,squareHeight)
    })
  })
  dibujar(culebra)
  mover(culebra)
}

const dibujar = culebra => {
  const squareWidth = width*0.9/columns
  const squareHeight = height*0.9/rows
  fill(0,200,100)
  const x = (width*0.05)+squareWidth*culebra.cabeza.fila
  const y = (height*0.05)+squareHeight*culebra.cabeza.columna
  rect(x,y,squareWidth,squareHeight)
}

const mover = culebra => {
  switch (culebra.direccion) {
    case 'arriba':
      if(checkCasilla(culebra)) culebra.cabeza.fila-- 
      break;
    case 'derecha':
      if(checkCasilla(culebra)) culebra.cabeza.columna++ 
      break;
      case 'abajo':
      if(checkCasilla(culebra)) culebra.cabeza.fila++ 
      break;
    case 'izquierda':
      if(checkCasilla(culebra)) culebra.cabeza.columna-- 
      break;
    }
}

const checkCasilla = culebra => {
  // let proximaCasilla
  // switch (culebra.direccion) {
  //   case 'arriba':
  //     proximaCasilla = {
  //       fila: culebra.cabeza.fila,
  //       columna: culebra.cabeza.columna - 1,
  //     }
  //     break;
  //   case 'derecha':
  //     proximaCasilla = {
  //       fila: culebra.cabeza.fila + 1,
  //       columna: culebra.cabeza.columna,
  //     }      
  //     break;
  //     case 'abajo':
  //       proximaCasilla = {
  //         fila: culebra.cabeza.fila,
  //         columna: culebra.cabeza.columna + 1,
  //       }     
  //       break;
  //   case 'izquierda':
  //     if(checkCasilla(culebra)) culebra.cabeza.columna-- 
  //     break;
  //   }
    return true
}
function keyPressed(){
  if( culebra.direccion !== direcciones[2] && ( keyCode === 65 || keyCode === 37))
    return culebra.direccion = direcciones[0]
  if(culebra.direccion !== direcciones[3] && ( keyCode === 83 || keyCode === 40))
    return culebra.direccion = direcciones[1]
  if(culebra.direccion !== direcciones[0] && ( keyCode === 68 || keyCode === 39))
    return culebra.direccion = direcciones[2]
  if(culebra.direccion !== direcciones[1] && ( keyCode === 87 || keyCode === 38))
  return culebra.direccion = direcciones[3]
}