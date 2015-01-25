if (Meteor.isClient) {
  Template.player.helpers({
    status: function () {
      var playerStatus = Session.get("playerStatus");
      return (playerStatus || 'play');
    },

    timer: function () {
      return Session.get('pomodoroTimer');
    }
  });

  Template.body.events({
    "click .pomodoro-player .controls .play": function (event) {
      Pomodoro.play();

      // This block of code is duplicated from task #play,
      // I still don't know how to re-use that code.
      Tasks.update(Session.get('lastPlayedTask'), {
        $set: {status: 'pending'}}, { multi: true }
      );

      Session.set('lastPlayedTask', this._id);

      Tasks.update(this._id, {
        $set: {
          startedAt: new Date(),
          status:    'working'
        }
      });
      //
    },

    "click .pomodoro-player .controls .pause": function (event) {
      Tasks.update(Session.get('lastPlayedTask'), {
        $set: { status: 'paused' }
      });

      Pomodoro.pause();
    },

    "click .pomodoro-player .controls .reset": function (event) {
      Pomodoro.initialize();

      Tasks.update(Session.get('lastPlayedTask'), {
        $set: { status: 'pending' }
      });

      Session.set('playerStatus', 'play');
    }
  });
}
