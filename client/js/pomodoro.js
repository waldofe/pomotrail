if (Meteor.isClient) {
  StatusTimes = {
    work:       1500,
    short_rest: 300
  }

  Clock = {
    init: function (seconds) {
      this.seconds = seconds;
    },

    actualMinutes: function () {
      return Math.floor(this.seconds / 60);
    },

    actualSeconds: function () {
      var realSeconds = (this.seconds % 60);

      return (realSeconds < 10 ? '0' + realSeconds : realSeconds);
    },

    timer: function () {
      return this.actualMinutes() + ':' + this.actualSeconds();
    },

    alarm: function () {
      var s = new buzz.sound('/sounds/trim.mp3');

      s.play();
    }
  }

  Pomodoro = {
    initialize: function (type) {
      type = type || 'work';

      Meteor.clearInterval(this.interval);

      this.totalSeconds = StatusTimes[type];

      Clock.init(this.totalSeconds);
      Session.set("pomodoroTimer", Clock.timer());
    },

    status: function () {
      return Session.get('pomodoroStatus');
    },

    resting: function () {
      return Session.get('pomodoroStatus') == 'resting';
    },

    ongoing: function () {
      return (Session.get('playerStatus') == 'pause' && !this.resting());
    },

    playRest: function () {
      Clock.alarm();

      Session.set('pomodoroStatus', 'resting');

      Tasks.update(Session.get('lastPlayedTask'), {
        $set: { status: 'resting' },
        $inc: { completedPomodoros: 1 }
      });

      this.initialize('short_rest');
      this.play();
    },

    play: function () {
      if( this.ongoing() ) { this.initialize(); }

      Meteor.clearInterval(this.interval);

      Session.set('playerStatus', 'pause');

      var that = this;

      timeLeft = function() {
        if (that.totalSeconds > 0) {
          that.totalSeconds--;

          Clock.init(that.totalSeconds);

          Session.set("pomodoroTimer", Clock.timer());
        } else {

          console.log(that.ongoing());
          if( that.ongoing() ) {
            that.playRest();
          } else {
            Clock.alarm();

            // THIS MUST GO OUT OF HERE AS
            Tasks.update(Session.get('lastPlayedTask'), {
              $set: { status: 'paused' }
            });

            Session.set('playerStatus', 'play');
            Session.set('pomodoroStatus', 'paused');
            that.initialize();
          }

          return Meteor.clearInterval(this.interval);
        }
      }

      this.interval = Meteor.setInterval(timeLeft, 1000);

      return true;
    },

    pause: function () {
      Session.set('playerStatus', 'play');
      Meteor.clearInterval(this.interval);
      Session.set("pomodoroTimer", Clock.timer());

      return true;
    }
  }
}