var app = new Vue({
  el: '#app',
  data: {
    timer: 0,
    round: {
      pics: [
        { img: "01.webp", isIt: false, message: `88.6% of Nicki Minaj fans get this wrong! Will you?` },
        { img: "02.webp", isIt: false },
        { img: "03.webp", isIt: false },
        { img: "04.webp", isIt: false },
        { img: "05.webp", isIt: false },
        { img: "06.webp", isIt: false },
        { img: "07.webp", isIt: true },
        { img: "08.webp", isIt: false },
        { img: "09.webp", isIt: false },
        { img: "10.webp", isIt: true },
        { img: "11.webp", isIt: false },
        { img: "12.webp", isIt: false },
      ],
      count: 0,
    },
    rules: {
      timeLimit: 5
    },
    user: {
      iq: 30,
      correctCount: 0,
    },
    toast: {
      status: "success",
      effect: "slide",
      speed: 300,
      autoclose: true,
      autotimeout: 2100,
      gap: 20,
      distance: 20,
      type: 1,
      position: "right bottom"
    },
    timerFunction: function() {},
    isGameOver: false
  },

  methods: {

    startTimer() {
      const self = this;
      self.timer = self.rules.timeLimit;
      self.timerFunction = setInterval(()=> {
        self.timer -= 0.013;
        if (self.timer <= 0) {
          clearInterval(self.timerFunction);
          self.timer = 0;
          self.timeUp();
        }
      }, 13);
    },

    guessAttempt(guessing, isIt) {
      const self = this;
      if (guessing === "yes" && isIt === true) {
        new Notify({
          ...self.toast,
          text: "That WAS Nicki Minaj!",
        })
        self.correctAnswer()
      } else if (guessing === "no" && isIt === false) {
        new Notify({
          ...self.toast,
          text: "That <strong>WAS NOT</strong> Nicki Minaj!",
        })
        self.correctAnswer();
      } else if (guessing === "yes" && isIt === false) {
        new Notify({
          ...self.toast,
          status: "error",
          text: "That <strong>WAS NOT</strong> Nicki Minaj!",
        })
        self.wrongAnswer();
      } else if (guessing === "no" && isIt === true) {
        new Notify({
          ...self.toast,
          status: "error",
          text: "That <strong>WAS</strong> Nicki Minaj!",
        })
        self.wrongAnswer();
      }
    },

    prepareNextRound() {
      const self = this;
      clearInterval(self.timerFunction);
      self.round.count++;
      if ((self.round.count + 1) > self.round.pics.length) {
        self.gameOver();
      } else {
        self.startTimer();
      }
    },

    correctAnswer() {
      const self = this;
      sounds.yes.play();
      self.user.iq += 15;
      self.user.correctCount += 1;
      self.prepareNextRound();
    },

    wrongAnswer() {
      const self = this;
      sounds.no.play();
      self.prepareNextRound();
    },

    timeUp() {
      const self = this;
      if (self.round.pics[self.round.count].isIt) {
        new Notify({
          ...self.toast,
          status: "error",
          title: "Time's up!",
          text: "That <strong>WAS</strong> Nicki Minaj!",
        })
      } else {
        new Notify({
          ...self.toast,
          status: "error",
          title: "Time's up!",
          text: "That <strong>WAS NOT</strong> Nicki Minaj!",
        })
      }
      sounds.no.play();
      self.prepareNextRound();
    },

    gameOver() {
      const self = this;
      clearInterval(self.timerFunction);
      self.isGameOver = true;
      sounds.gameOver.play();
    }

  },

  computed: {
    computedTimerOutput() {
      const self = this;
      let minutes;
      seconds = Math.trunc(self.timer);
      ms = parseInt((self.timer % 1) * 100);
      if (ms < 10) {
        ms = "0" + ms;
      }
      if (seconds > 59) {
        minutes = Math.floor(seconds / 60);
        seconds = seconds - (minutes * 60);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
      }
      if (minutes) {
        return `<span class="m">${minutes}</span><span class="s">${seconds}</span><span class="ms">${ms}</span>`;
      } else {
        return `<span class="s">${seconds}</span><span class="ms">${ms}</span>`;
      }
    },
    computedGuessPicture() {
      const self = this;
      if (!self.round.pics[self.round.count] || !self.round.pics[self.round.count].img) {
        return null;
      } 
      return `img/maybe/${self.round.pics[self.round.count].img}`
    },

    computedMessage() {
      const self = this;
      const randomMessages = [
        `You <strong>won't believe</strong> how many people get this wrong!`,
        `The answer is actually trickier than you think!`,
        `People who get this Right Might be True Genius!`,
        `Sceintists discovered a special part of the brain for this!`,
        `${randomNumber(62,99)}.${randomNumber(11,99)}% of Nicki Minaj fans get <strong>this</strong> one wrong!`,
        `Tell your friends if you get <strong>this one</strong> right!`,
        `Look closer 👀 Can you See The Right Answer!?`,
        `As Bart Simpson would say, "Ay Carumba!"`,
        `You <strong>CAN'T</strong> unsee this picture! 😂`,
        `Test your Nickibrain against <strong>this</strong> tough question!`

      ];

      if (self.round.pics[self.round.count] && self.round.pics[self.round.count].message) {
        return self.round.pics[self.round.count].message
      } else {
        return randomFrom(randomMessages);
      }
    },

    computedSuccess() {
      const self = this;
      if (!self.user.correctCount || self.user.correctCount < 1) {
        return 0;
      } else {
        return percentOf(self.round.pics.length,self.user.correctCount)
      }
    }
  },

  mounted: function() {
    const self = this;
    self.startTimer();
  }

});
