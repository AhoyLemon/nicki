const siteURL = "";

const sounds = {
  yes: new Howl({
    src: ["audio/achievement-message-tone.mp3"],
    volume: 0.5
  }),
  no: new Howl({
    src: ["audio/decay-475.mp3", "audio/decay-475.ogg"],
    volume: 0.5
  }),
  gameOver: new Howl({
    src: ["audio/sour-tennessee-red.mp3", "audio/sour-tennessee-red.ogg"],
    volume:0.5
  })

}