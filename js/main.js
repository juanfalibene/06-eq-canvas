// 01. Definir los elementos y eventos
const audioInput = document.querySelector("input");
const eqCanvas = document.querySelector("canvas");

// crear contexto canvas
const canvasCtx = eqCanvas.getContext("2d");
eqCanvas.width = 600;
eqCanvas.height = 300;
canvasCtx.fillRect(0, 0, eqCanvas.width, eqCanvas.height);

// dibujar EQ
const drawAudio = (analyser) => {
  const WIDTH = eqCanvas.width;
  const HEIGHT = eqCanvas.height;
  // asignar la animacion al navegador, para que la administre
  // a diferencia de usar setInterval js
  requestAnimationFrame(() => drawAudio(analyser));
  // obtener data del audio para dibujar
  const bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  // crear array vacio con Uinst8Array
  const dataArray = new Uint8Array(bufferLength);
  // definir el ancho de la barra a dibujar
  const barWidth = (WIDTH / bufferLength) * 7.79;
  // posicion inicial de la barra[0]
  let x = 0;
  // añadir la data al array vacio
  analyser.getByteFrequencyData(dataArray);
  canvasCtx.fillStyle = "111111";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  // toda la magia
  dataArray.forEach((decibel, index) => {
    const cantidad = index / bufferLength;
    const rojo = decibel + 25 * cantidad;
    const verde = 250 * cantidad;
    const azul = 250;

    // definir color de proxima barra a la derecha
    canvasCtx.fillStyle = `rgb(${rojo},${verde},${azul})`;
    // definir alto de la barra segun decibel
    // x == posicion, punto en el que empieza en Y, ancho de la barra, alto de la barra)
    canvasCtx.fillRect(x, HEIGHT - decibel, barWidth, decibel);
    // siguiente punto en X, para nueva barra
    x += barWidth + 1;
  });
};

// crear contexto audio
const initAnalyser = async (audio) => {
  // setup audio context
  const audioCtx = new AudioContext();
  // fuente de audio para analizar
  const src = audioCtx.createMediaElementSource(audio);
  // crear Analyzer
  const analyser = audioCtx.createAnalyser();
  // conectar fuente con Analyzer
  src.connect(analyser);
  // conectar analyzer con el contexto y seguir escuchando
  // aunque estemos escuchando la fuente de audio
  analyser.connect(audioCtx.destination);
  // definir el tamaño de la data que estamos analizando
  analyser.fftSize = 256;
  // dovolver el analyzer para comenzar a dibujar
  return analyser;
};

// crear evento
const onChange = async (event) => {
  // recibir archivo de audio
  const audioFile = event.target.files[0];
  // crear URL desde el archivo recibido
  const url = URL.createObjectURL(audioFile);
  // seleccionar tag audio
  const audio = document.querySelector("audio");
  // aisginar la fuente de audio como url al componente audio
  audio.src = url;
  // crear analyser desde nuestro componente audio
  const analyser = await initAnalyser(audio);
  // reproducir audio
  audio.play();
  // comenzar a dibujar
  drawAudio(analyser);
};

// crear listener
audioInput.onchange = onChange;
