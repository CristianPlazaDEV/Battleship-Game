// =========================================================
// === Disponemos del script después de la carga del DOM.===
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // ==== VARIABLES GLOBALES ====
  // ============================
  const filas = 8;
  const columnas = 8;
  let tablero = [];
  const CONTENEDOR_TABLERO = document.getElementById('tablero-wrapper');
  // Constantes estados casillas
  const AGUA = 0;
  const BARCO = 1;
  const BARCO_TOCADO = 2;
  const BARCO_HUNDIDO = 3;
  // Barcos
  const BARCOS = [
    {id: 1, tamano: 2, posiciones: [], tocado: 0, hundido: false},
    {id: 2, tamano: 2, posiciones: [], tocado: 0, hundido: false},
    {id: 3, tamano: 2, posiciones: [], tocado: 0, hundido: false},
    {id: 4, tamano: 2, posiciones: [], tocado: 0, hundido: false},
    {id: 5, tamano: 2, posiciones: [], tocado: 0, hundido: false},
    {id: 6, tamano: 2, posiciones: [], tocado: 0, hundido: false},
    {id: 7, tamano: 2, posiciones: [], tocado: 0, hundido: false},
    {id: 8, tamano: 2, posiciones: [], tocado: 0, hundido: false}
  ];
  // Contadores de estado
  let tocados = 0;
  let hundidos = 0;
  let movimientos = 0;
  let userName = '';
  const MESSAGE = document.getElementById('message-content');
  const BTN_CONFIRM = document.getElementById('btn-confirm');
  const BTN_INICIAR = document.getElementById('btn-inicio');
  const BTN_RESETEAR = document.getElementById('btn-reset');
  const USER = document.getElementById('user-name');
  const PRINT_USER = document.getElementById('print-user-name');
  // ============================
  // === FUNCIONES AUXILIARES ===
  // ============================
  // - Inicialización del Tablero -
  function inicializarTablero(filas, columnas) {
    for (let i = 0; i < filas; i++) {
      tablero[i] = [];
      for (let j = 0; j < columnas; j++) {
        tablero[i][j] = AGUA;
      }
    }
  }

  // - Imprimir el Tablero -
  function imprimirTablero(tablero) {
    let html = '<table>';
    for (let i = 0; i < tablero.length; i++) {
      html += '<tr>';
      for (let j = 0; j < tablero[i].length; j++) {
        html += `<td data-fila="${i}" data-columna="${j}" data-casilla="${tablero[i][j]}" data-estado="NS"></td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    CONTENEDOR_TABLERO.innerHTML = html;
  }

  // - Validar posición -
  function esPosicionValida(posiciones, tablero) {
    for (let posicion of posiciones) {
      const fila = posicion[0];
      const columna = posicion[1];

      // 1. Verificar límites del tablero
      if (fila < 0 || fila >= tablero.length || columna < 0 || columna >= tablero[0].length) {
        return false;
      }

      // 2. Verificar que la casilla esté libre
      if (tablero[fila][columna] !== AGUA) {
        return false;
      }

      // 3. Verificar casillas adyacentes
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const filaAdyacente = fila + i;
          const columnaAdyacente = columna + j;

          if (filaAdyacente >= 0 && filaAdyacente < tablero.length &&
              columnaAdyacente >= 0 && columnaAdyacente < tablero[0].length) {

            if (tablero[filaAdyacente][columnaAdyacente] !== AGUA){
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  // - Colocar los Barcos -
  function colocarBarcos(barcos, tablero) {
    barcos.forEach((barco) => {
      let colocado = false;

      while (!colocado) {
        const orientacion = Math.floor(Math.random() * 2);
        const direccion = Math.random() < 0.5 ? 1 : -1;
        const filaInicial = Math.floor(Math.random() * tablero.length);
        const columnaInicial = Math.floor(Math.random() * tablero[0].length);

        const posiciones = [];
        for (let i = 0; i < barco.tamano; i++) {
          if (orientacion === 0) {
            posiciones.push([filaInicial, columnaInicial + (i * direccion)]);
          } else {
            posiciones.push([filaInicial + (i * direccion), columnaInicial]);
          }
        }

        if (esPosicionValida(posiciones, tablero)) {
          for (let posicion of posiciones) {
            const fila = posicion[0];
            const columna = posicion[1];
            tablero[fila][columna] = barco.id;
          }
          barco.posiciones = posiciones;
          colocado = true;
        }
      }
    });
  }

  // - Procesar una tirada dada fila y columna, actualizando el estado -
  function procesarTirada(fila, columna) {
    const valorCasilla = tablero[fila][columna];
    if (valorCasilla === AGUA) {
      return 'agua';
    }

    // Buscar barco que tenga esa posición
    let barcoTocado = null;
    for (const barco of BARCOS) {
      for (const pos of barco.posiciones) {
        if (pos[0] === fila && pos[1] === columna) {
          barcoTocado = barco;
          break;
        }
      }
      if (barcoTocado) break;
    }
    if (!barcoTocado) return 'error';

    // Para evitar contar doble tocado en la misma casilla, aseguramos que no se cuente repetido
    // (Podrías optimizar guardando un estado en un array aparte)
    barcoTocado.tocado++;

    if (barcoTocado.tocado >= barcoTocado.tamano) {
      barcoTocado.hundido = true;
      hundidos++;
      return 'hundido';
    } else {
      return 'tocado';
    }
  }
// - Confirmar Usuario antes de empezar la partida
  function confirmarUsuario()  {

    if (USER.value === '') {
      alert('Debes de introducir un nombre de Usuario');
    } else {
      userName = USER.value;
      PRINT_USER.textContent = `¡Buena Suerte, ${userName}!`;
      USER.value = '';
      BTN_INICIAR.disabled = false;
      BTN_INICIAR.style.opacity = '1';
      BTN_INICIAR.style.pointerEvents = '';
    }
  };

  // -Resetear los barcos -
  function reiniciarBarcos(BARCOS) {
  for (const barco of BARCOS) {
    barco.posiciones = [];
    barco.tocado = 0;
    barco.hundido = false;
  }
};
  // ============================
  // ===== EVENT LISTENERS ======
  // ============================
  CONTENEDOR_TABLERO.addEventListener('click', (event) => {
    const td = event.target;
    if (td.tagName !== 'TD') return;

    const fila = parseInt(td.getAttribute('data-fila'));
    const columna = parseInt(td.getAttribute('data-columna'));

    const resultado = procesarTirada(fila, columna);

    function mostrarBarcoHundido(barco) {
  // Recorre todas las posiciones del barco y cambia la visualización a 'hundido'
  barco.posiciones.forEach(pos => {
    const fila = pos[0];
    const columna = pos[1];
    const td = CONTENEDOR_TABLERO.querySelector(
      `td[data-fila="${fila}"][data-columna="${columna}"]`
    );
    if (td) {
      td.style.backgroundColor = '#f57f7f';
      td.textContent = '💥';
    }
  });
}
    switch (resultado) {
      case 'agua':
        td.style.backgroundColor = '#bed9ff';
        td.textContent = '💧';
        break;
      case 'tocado':
        td.style.backgroundColor = '#ffc88a';
        td.textContent = '🔥';
        break;
      case 'hundido':
      // actualiza todas las celdas del barco para mostrar hundido
      const barcoHundido = BARCOS.find(barco =>
      barco.posiciones.some(pos => pos[0] === fila && pos[1] === columna)
      );
      if (barcoHundido) {
      mostrarBarcoHundido(barcoHundido);
      comprobarVictoria();
    }
        break;
      case 'error':
        console.error('Error procesando tirada');
        break;
    }
  });
  // Condiciones de Victoria
  function comprobarVictoria () {
    if (hundidos === BARCOS.length) {
      MESSAGE.style.display = 'block';
      MESSAGE.textContent = `¡Victoria! Enhorabuena ${userName}, has ganado la partida.`;
      CONTENEDOR_TABLERO.style.pointerEvents = 'none';
      CONTENEDOR_TABLERO.style.opacity = '0.5';
    }
  }
  // Confirmar Nombre de usuario
  BTN_CONFIRM.addEventListener('click', confirmarUsuario);

  USER.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      confirmarUsuario();
      USER.blur();
    } else if (event.key === 'Escape') {
      USER.value = '';
    }
  })
  // Iniciar Partida
  BTN_INICIAR.addEventListener('click', () => {
    inicializarTablero(filas, columnas);
    colocarBarcos(BARCOS, tablero);
    imprimirTablero(tablero);
    BTN_RESETEAR.disabled = false;
    BTN_RESETEAR.style.opacity = '1';
    BTN_RESETEAR.style.pointerEvents = '';
    BTN_INICIAR.style.display = 'none';
    BTN_CONFIRM.disabled = true;
    BTN_CONFIRM.style.opacity = '0.5';
    BTN_CONFIRM.style.pointerEvents = 'none';
  })
  // Resetear procesarTirada
  BTN_RESETEAR.addEventListener('click', () => {
    reiniciarBarcos(BARCOS);
    tablero = [];
    userName = '';
    tocados = 0;
    hundidos = 0;
    movimientos = 0;
    CONTENEDOR_TABLERO.innerHTML = '';
    BTN_INICIAR.style.display = 'block';
    BTN_INICIAR.disabled = true;
    BTN_INICIAR.style.opacity = '0.5';
    BTN_INICIAR.style.pointerEvents = 'none';
    BTN_RESETEAR.disabled = true;
    BTN_RESETEAR.style.opacity = '0.5';
    BTN_RESETEAR.style.pointerEvents = 'none';
    MESSAGE.style.display = 'none';
    CONTENEDOR_TABLERO.style.pointerEvents = '';
    CONTENEDOR_TABLERO.style.opacity = '1';
    BTN_CONFIRM.disabled = false;
    BTN_CONFIRM.style.opacity = '1';
    BTN_CONFIRM.style.pointerEvents = '';
    PRINT_USER.textContent = '';
  })

  // ============================
  // = INICIALIZACIÓN DE LA APP =
  // ============================
  reiniciarBarcos(BARCOS);
  BTN_INICIAR.style.display = 'block';
  BTN_INICIAR.disabled = true;
  BTN_INICIAR.style.opacity = '0.5';
  BTN_INICIAR.style.pointerEvents = 'none';
  BTN_RESETEAR.disabled = true;
  BTN_RESETEAR.style.opacity = '0.5';
  BTN_RESETEAR.style.pointerEvents = 'none';
  MESSAGE.style.display = 'none';
  BTN_CONFIRM.disabled = false;
  BTN_CONFIRM.style.opacity = '1';
  BTN_CONFIRM.style.pointerEvents = '';
  PRINT_USER.textContent = '';
});
