if (Meteor.isClient) {
  Template.body.helpers({
    playerMode: function () {
      var playerMode = Session.get("playerMode");
      return (playerMode || 'play')
    }
  });

  Template.body.events({
    "click .controls .play": function (event) {
      Pomodoro.play();
      Session.set('playerMode', 'pause');
    },

    "click .controls .pause": function (event) {
      Pomodoro.pause();
      Session.set('playerMode', 'play');
    },

    "click .controls .reset": function (event) {
      Pomodoro.reset();
      Pomodoro.pause();
      Session.set('playerMode', 'play');
    }
  });
}
