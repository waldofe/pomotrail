if (Meteor.isClient) {
  StatusTimes = {
    work:       5,
    short_rest: 300,
    long_rest: 900,
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

    sendNotification: function(title, text) {
      if (!Notification) return false;

      var notification = new Notification(title, {
        body: text,
        icon: 'http://cdn3.iconfinder.com/data/icons/veggies/128/tomato.png'
      })

      // notification.onclick = function() {
      // };

      return true;
    },

    requestNotificationPermission: function() {
      if (Notification.permission !== "granted")
        Notification.requestPermission();
    },

    playRest: function () {
      Clock.alarm();
      this.sendNotification('Pomodoro terminado...', 'Começando descanso!');

      Session.set('pomodoroStatus', 'resting');

      Tasks.update(Session.get('lastPlayedTask'), {
        $set: { status: 'resting' },
        $inc: { completedPomodoros: 1 }
      });

      if (Session.get('pomodoroCount') % 4 === 0) {
        this.initialize('long_rest');
        Session.set('pomodoroCount', 0);
      } else {
        this.initialize('short_rest');
      }

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

          if( that.ongoing() ) {
            that.playRest();
            Session.set('pomodoroCount', Session.get('pomodoroCount')+1);
          } else {
            Clock.alarm();

            that.sendNotification('Descanso terminado...', 'Hora de voltar a trabalhar!');

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
