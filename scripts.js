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
  // Casillas
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
  // Botones
  const BTN_INICIO = document.getElementById('btn-inicio');
  const BTN_RESET = document.getElementById('btn-reset');
  // ============================
  // === FUNCIONES AUXILIARES ===
  // ============================
  // - Inicialización del Tablero -
  function inicializarTablero(filas, columnas) {
    for (let i = 0; i < filas; i++) {
      tablero[i] = [];
      for (let j = 0; j < columnas; j++) {
        tablero[i][j] = 0;
      }
    }
  }
  // - Imprimir el Tablero -
  function imprimirTablero(tablero) {
    let html = '<table>';
    for (let i = 0; i < tablero.length; i++) {
      html += '<tr>';
      for (let j = 0; j < tablero[i].length; j++) {
        html += `<td>${tablero[i][j]}</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    CONTENEDOR_TABLERO.innerHTML = html;
  }
  // - Calcular número de Barcos -
  // - Colocar los Barcos -
  function colocarBarcos(tablero, BARCOS) {
    BARCOS.forEach((barco) => {
      let colocado = false;

      while (!colocado) {
        // Orientación aleatoria -> Horizontal = 0, Vertical = 1
        const orientacion = Math.floor(Math.random() * 2);
        // Dirección aleatoria: 1 -> , <- -1
        const direccion = Math.random() < 0.5 ? 1 : -1;
        // Posición Inicial aleatoria
        const filaInicial = Math.floor(Math.random() * tablero.length);
        const columnaInicial = Math.floor(Math.random() * tablero[0].length);
        // Obtener posiciones que ocupará cada barco
        const posiciones = [];
        for (let i = 0; i < barco.tamano; i++) {
          if (orientacion === 0) {
            // Si es 0, es Horizontal: 2 posiciones (Misma fila, columna Consecutivas)
            posiciones.push([filaInicial, columnaInicial + (i * direccion)]);
          } else {
            // Entonces es 1 y es Vertical: 2 posiciones (filas Consecutivas, Misma columna)
            posiciones.push([filaInicial + (i * direccion), columnaInicial]);
          }
        }
        // Realizar validaciones antes de colocar el Barco
        if (esPosicionValida(posiciones, tablero)) {
          // Colocar el Barco en el Tablero
          for (let posicion of posiciones) {
            const fila = posicion[0];
            const columna = posicion[1];

            // Marcamos con el Nº2 la colocación de los Barcos
            tablero[fila][columna] = barco.id;
          }
           
          // Guardamos las posiciones en el objeto Barco
          barco.posiciones = posiciones;

          // Salimos del while
          colocado = true;
        }
      }
    });
  }
  // - Validar posición -
  function esPosicionValida(posiciones, tablero) {
    // 1. Comprobar posiciones dentro del tablero
    for (let posicion of posiciones) {
      const fila = posicion[0];
      const columna = posicion[1];

      if (fila < 0 || fila >= tablero.length || columna < 0 || columna >= tablero[0].length) {
        return false;
      }
    }
    // 2. Comprobar posiciones libres
    for (let posicion of posiciones) {
      const fila = posicion[0];
      const columna = posicion[1];

      if (tablero[fila][columna] !== 0) {
        return false;
      }
    }
    // 3. Comprobar casillas colindantes libres
    for (let posicion of posiciones) {
      const fila = posicion[0];
      const columna = posicion[1];
      
      // Comprobar las "8" casillas colindantes (⬆️➡️⬇️⬅️)
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // Satar la casilla central (Es en la que está nuestro Barco)
          if (i === 0 && j === 0) continue;

          const filaColindante = fila + i;
          const columnaColindante = columna + j;

          // Comprobar que la casilla colindante está dentro del tablero
          if (filaColindante >= 0 && filaColindante < tablero.length && columnaColindante >= 0 && columnaColindante < tablero[0].length)  {

            // ❌ Si hay barco en la casilla colindante NO es válido
            if (tablero[filaColindante][columnaColindante] !== 0){
              return false;
            }
          }
        }
      }
    }
    // ✅ Retorna True si pasa todas las validaciones
    return true;
  }
  // - Iniciar la Partida -
  // - Resetear la Partida -
  // ============================
  // ===== EVENT LISTENERS ======
  // ============================
  // - Elección del Tamaño del Tablero -
  // - Inicio de la Partida -
  // - Elección de la Tirada -
  // - Reglas para Finalizar la Partida -
  // ============================
  // = INICIALIZACIÓN DE LA APP =
  // ============================
  inicializarTablero(filas, columnas);
  colocarBarcos(tablero, BARCOS)
  imprimirTablero(tablero);
  // -Reseteo de la Partida -
})
