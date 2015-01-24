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

      return (realSeconds < 9 ? realSeconds + '0' : realSeconds);
    }
  }

  Pomodoro = {
    start: function () {
      var totalSeconds, interval, timeLeft;
      totalSeconds = 1500;

      timeLeft = function() {
        var minutes, seconds;

        if (totalSeconds > 0) {
          totalSeconds--;

          Clock.init(totalSeconds);

          Session.set("pomodoroTimer", Clock.actualMinutes() + ':' + Clock.actualSeconds());
        } else {
          return Meteor.clearInterval(interval);
        }
      }

      interval = Meteor.setInterval(timeLeft, 1000);
    }
  };
}