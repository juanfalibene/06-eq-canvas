// 01. Definir los elementos y eventos

const audioInput = document.querySelector("input");
const eqCanvas = document.querySelector("canvas");

// crear contexto canvas
const canvasCtx = eqCanvas.getContext("2d");
eqCanvas.width = innerWidth;
eqCanvas.height = 300;
canvasCtx.fillRect(0, 0, eqCanvas.width, eqCanvas.height);

// crear contexto audio
const initAnalyser = async () => {
  // setup audio context
  const audioCtx = new AudioContext();
  // fuente de audio para analizar
  const src = audioCtx.createMediaElementSource(audioInput);
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
};

// crear listener
audioInput.onchange = onChange;
