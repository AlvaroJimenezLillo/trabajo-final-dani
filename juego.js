const tamañoTabla = 11;
const tamañoCelda = 30;
const colorJugador = 'white';
const colorOponente = 'red';

// Estado del juego
let tableroJugador, tableroOponente;
let finDelJuego = false;

// Inicializar el juego
function iniciarJuego() {
  // Crear los tableros del jugador y del oponente
  tableroJugador = crearTabla();
  tableroOponente = crearTabla();

  // Colocar los barcos del jugador en el tablero
  colocarBarcosAleatoriamente(tableroJugador);

  // Colocar los barcos del oponente aleatoriamente en el tablero
  colocarBarcosAleatoriamente(tableroOponente);

  // Renderizar los tableros
  dibujarTableros();

  // Agregar event listeners para los movimientos del jugador
  document.getElementById('tableroOponente').addEventListener('click', movimientoJugador);

  // Agregar event listener para el botón de reinicio
  document.getElementById('botonReinicio').addEventListener('click', reiniciarJuego);
}

// Crear un tablero vacío
function crearTabla() {
  const tabla = [];
  for (let i = 0; i < tamañoTabla; i++) {
    const fila = [];
    for (let j = 0; j < tamañoTabla; j++) {
      fila.push({ golpeado: false, barco: null });
    }
    tabla.push(fila);
  }
  return tabla;
}

// Colocar los barcos del oponente aleatoriamente en el tablero
function colocarBarcosAleatoriamente(tabla) {
  const tipoBarcos = ['carrier', 'battlebarco', 'dani', 'submarine', 'pito'];

  tipoBarcos.forEach(tipoBarco => {
    let tamañoBarco;
    switch (tipoBarco) {
      case 'carrier':
        tamañoBarco = 5;
        break;
      case 'battlebarco':
        tamañoBarco = 4;
        break;
      case 'dani':
        tamañoBarco = 3;
        break;
      case 'submarine':
        tamañoBarco = 3;
        break;
      case 'pito':
        tamañoBarco = 2;
        break;
    }

    let posicionamientoValido = false;
    let contadorIntentos = 0;
    while (!posicionamientoValido && contadorIntentos < 100) {
      contadorIntentos++;
      const esHorizontal = Math.random() < 0.5;
      const posicionXInicio = Math.floor(Math.random() * (tamañoTabla - (esHorizontal ? tamañoBarco : 0)));
      const posicionYInicio = Math.floor(Math.random() * (tamañoTabla - (esHorizontal ? 0 : tamañoBarco)));

      const todasLasPosiciones = [];
      for (let i = 0; i < tamañoBarco; i++) {
        const x = esHorizontal ? posicionXInicio + i : posicionXInicio;
        const y = esHorizontal ? posicionYInicio : posicionYInicio + i;
        todasLasPosiciones.push([x, y]);
      }

      posicionamientoValido = posicionamientoBarcoValido(tabla, todasLasPosiciones);
      if (posicionamientoValido) {
        colocarBarco(tabla, tipoBarco, todasLasPosiciones);
      }
    }
  });
}

// Validar la colocación del barco en el tablero
function posicionamientoBarcoValido(tabla, todasLasPosiciones) {
  return todasLasPosiciones.every(([x, y]) =>
    posicionValida(tabla, x, y) &&
    posicionVacia(tabla, x, y) &&
    comprobarAlrededor(tabla, x, y)
  );
}

function esPrimeraColumnaOFila(x, y) {
  return x === 0 || y === 0;
}

// Verificar si la posición es válida en el tablero
function posicionValida(tabla, x, y) {
  return x > 0 && x < tamañoTabla && y > 0 && y < tamañoTabla;
}

// Verificar si la posición está vacía en el tablero
function posicionVacia(tabla, x, y) {
  return !tabla[x][y].barco;
}

// Verificar si las posiciones circundantes están vacías en el tablero
function comprobarAlrededor(tabla, x, y) {
  var pisicionesAComprobar;
  if (x === 10) {
    pisicionesAComprobar = [
      [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
      [x, y - 1], [x, y + 1]
    ];
  } else if (y === 10) {
    pisicionesAComprobar = [
      [x - 1, y - 1], [x - 1, y],
      [x, y - 1],
      [x + 1, y - 1], [x + 1, y]
    ];
  } else {
    pisicionesAComprobar = [
      [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
      [x, y - 1], [x, y + 1],
      [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]
    ];
  }

  return pisicionesAComprobar.every(([x, y]) => posicionValida(tabla, x, y) && posicionVacia(tabla, x, y));
}

// Colocar un barco en el tablero
function colocarBarco(tabla, tipoBarco, todasLasPosiciones) {
  todasLasPosiciones.forEach(([x, y]) => {
    tabla[x][y].barco = tipoBarco;
  });
}

// Renderizar los tableros del juego
function dibujarTableros() {
  dibujarTablero(tableroJugador, 'tableroJugador', colorJugador);
  dibujarTablero(tableroOponente, 'tableroOponente', colorOponente);
}

// Renderizar un tablero en el lienzo (canvas)
function dibujarTablero(tabla, canvasId, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar líneas de la cuadrícula
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  for (let x = 0; x <= tamañoTabla; x++) {
    ctx.beginPath();
    ctx.moveTo(x * tamañoCelda, 0);
    ctx.lineTo(x * tamañoCelda, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= tamañoTabla; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * tamañoCelda);
    ctx.lineTo(canvas.width, y * tamañoCelda);
    ctx.stroke();
  }

  // Dibujar barcos y aciertos
  tabla.forEach((fila, x) => {
    fila.forEach(({ golpeado, barco }, y) => {
      ctx.fillStyle = golpeado ? 'lightblue' : color;
      ctx.fillRect(y * tamañoCelda, x * tamañoCelda, tamañoCelda, tamañoCelda);

      if (barco && golpeado) {
        ctx.fillStyle = 'black';
        ctx.fillText(barco.charAt(0).toUpperCase(), y * tamañoCelda + 10, x * tamañoCelda + 20);
      }

      if (!golpeado) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(y * tamañoCelda, x * tamañoCelda, tamañoCelda, tamañoCelda);
      }

      // Agregar etiquetas de coordenadas a la primera fila y columna
      if (x === 0 && y > 0) {
        ctx.fillStyle = 'black';
        ctx.fillText(String.fromCharCode(64 + y), y * tamañoCelda + 10, 20);
      }
      if (y === 0 && x > 0) {
        ctx.fillStyle = 'black';
        ctx.fillText(x.toString(), 10, x * tamañoCelda + 20);
      }
    });
  });
}

function movimientoJugador(click) {
  if (finDelJuego) {
    return; // Ignorar clics después de que el juego haya terminado
  }

  const canvas = click.target;
  const posicion = canvas.getBoundingClientRect();
  const x = Math.floor((click.clientY - posicion.top) / tamañoCelda);
  const y = Math.floor((click.clientX - posicion.left) / tamañoCelda);

  if (esPrimeraColumnaOFila(x, y)) {
    return; // Ignorar clics en celdas de coordenadas
  }

  const celda = tableroOponente[x][y];
  if (celda.golpeado) {
    return; // Ignorar clics en celdas ya golpeadas
  }

  const result = hacerUnMovimiento(tableroOponente, x, y);

  dibujarTableros();
  resultMovimiento(`Jugador: Disparó a (${x}, ${String.fromCharCode(64 + y)}). Resultado: ${result}`);

  if (comprobarFinJuego(tableroOponente)) {
    finDelJuego = true;
    document.getElementById('tableroOponente').removeEventListener('click', movimientoJugador);
    alert("¡Ganaste!");
  }

  // Manejar movimiento del oponente
  if (!finDelJuego) {
    setTimeout(movimientoOponente, 500);
  }
}

function movimientoOponente() {
  let movimientoValido = false;
  let x, y;

  while (!movimientoValido) {
    x = Math.floor(Math.random() * tamañoTabla);
    y = Math.floor(Math.random() * tamañoTabla);

    if (!esPrimeraColumnaOFila(x, y) && !tableroJugador[x][y].golpeado) {
      movimientoValido = true;
    }
  }

  const result = hacerUnMovimiento(tableroJugador, x, y);

  if (comprobarFinJuego(tableroJugador)) {
    finDelJuego = true;
    document.getElementById('tableroOponente').removeEventListener('click', movimientoJugador);
    alert("¡Perdiste!");
  }

  dibujarTableros();
  resultMovimiento(`Oponente: Disparó a (${x}, ${String.fromCharCode(64 + y)}). Resultado: ${result}`);

  // Desplazarse hacia la parte inferior de la pantalla de ataques
  const registroAtaques = document.getElementById('registroAtaque');
  registroAtaques.scrollTop = registroAtaques.scrollHeight;
}

// Realizar un movimiento en el tablero
function hacerUnMovimiento(tabla, x, y) {
  const celda = tabla[x][y];
  celda.golpeado = true;
  if (celda.barco) {
    if (comprobarBarcoHudido(tabla, celda.barco)) {
      return 'Tocado y hundido'; // El barco se hundió
    }
    return 'Tocado'; // El barco fue golpeado pero no se hundió
  }
  return 'Agua'; // Falló el disparo
}

// Verificar si un barco se hundió
function comprobarBarcoHudido(tabla, tipoBarco) {
  for (let i = 0; i < tamañoTabla; i++) {
    for (let j = 0; j < tamañoTabla; j++) {
      if (tabla[i][j].barco === tipoBarco && !tabla[i][j].golpeado) {
        return false; // Todavía hay partes no golpeadas del barco en el tablero
      }
    }
  }
  return true; // Todas las partes del barco han sido golpeadas y hundidas
}

// Verificar si el juego ha terminado
function comprobarFinJuego(tabla) {
  for (let i = 0; i < tamañoTabla; i++) {
    for (let j = 0; j < tamañoTabla; j++) {
      if (tabla[i][j].barco && !tabla[i][j].golpeado) {
        return false; // Todavía hay barcos no golpeados en el tablero
      }
    }
  }
  return true; // Todos los barcos han sido golpeados y hundidos
}

// Mostrar el resultado del movimiento en la pantalla de ataques
function resultMovimiento(result) {
  const registroAtaques = document.getElementById('registroAtaque');
  const p = document.createElement('p');
  p.textContent = result;
  registroAtaques.appendChild(p);
}

// Reiniciar el juego
function reiniciarJuego() {
  const registroAtaques = document.getElementById('registroAtaque');
  registroAtaques.innerHTML = '';

  finDelJuego = false;
  iniciarJuego();
}

// Inicializar el juego al cargar la página
document.addEventListener('DOMContentLoaded', iniciarJuego);
