const router = require("express").Router();
const ws281x = require('rpi-ws281x-native');

function initLedStrip(brightnessMultiplier) {
  const options = {
    dma: 10,
    freq: 800000,
    gpio: 21,
    invert: false,
    brightness: 255 * brightnessMultiplier,
    stripType: ws281x.stripType.WS2812
  };

  const channel = ws281x(288, options);
  const leds = channel.array;
  return leds
}

router.post('/bootup', (req, res) => {
  console.log('bootup', midiPlayer)
})

router.post('/update', (req, res) => {
  console.log(req.body)
  const leds = initLedStrip(req.body.brightness)
  for (let note of req.body.notes){
      leds[note] = 0xffcc22
  }
  console.log(leds)
  ws281x.render();

  res.status(200).json({ message: 'event recived' })
})

module.exports = router;
