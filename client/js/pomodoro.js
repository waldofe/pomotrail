if (Meteor.isClient) {
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
    }
  }

  Pomodoro = {
    initialize: function () {
      Meteor.clearInterval(this.interval);

      this.totalSeconds = 1500;
      Clock.init(this.totalSeconds);
      Session.set("pomodoroTimer", Clock.timer());
    },

    ongoing: function () {
      return Session.get('playerStatus') == 'pause'
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