if (Meteor.isClient) {
  Timer = {
    initialize: function () {
      var clock, interval, timeLeft;
      clock = 10;

      timeLeft = function() {
        if (clock > 0) {
          clock--;
          Session.set("time", clock);
          return console.log(clock);
        } else {
          return Meteor.clearInterval(interval);
        }
      };

      interval = Meteor.setInterval(timeLeft, 1000);
    }
  };
}