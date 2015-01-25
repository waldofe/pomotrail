if (Meteor.isClient) {
  Template.body.helpers({
    playerMode: function () {
      var playerMode = Session.get("playerMode");
      return (playerMode || 'play')
    }
  });

  Template.body.events({
    "click .pomodoro-player .controls .play": function (event) {
      Pomodoro.play();
      Session.set('playerMode', 'pause');
    },

    "click .pomodoro-player .controls .pause": function (event) {
      Pomodoro.pause();
      Session.set('playerMode', 'play');
    },

    "click .pomodoro-player .controls .reset": function (event) {
      Pomodoro.reset();
      Pomodoro.pause();
      Session.set('playerMode', 'play');
    }
  });
}
