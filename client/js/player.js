if (Meteor.isClient) {

  Template.body.helpers({
    playerStatus: function () {
      var playerStatus = Session.get("playerStatus");
      return (playerStatus || 'play')
    }
  });

  Template.body.events({
    "click .pomodoro-player .controls .play": function (event) {
      Pomodoro.play();
    },

    "click .pomodoro-player .controls .pause": function (event) {
      Pomodoro.pause();
    },

    "click .pomodoro-player .controls .reset": function (event) {
      Pomodoro.initialize();
      Session.set('playerStatus', 'play');
    }
  });
}
