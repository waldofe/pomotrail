if (Meteor.isClient) {
  Template.task.events({
    "click .toggle-checked": function () {
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },

    "click .delete": function () {
      Tasks.remove(this._id);
    },

    "click .micro-control .play": function () {
      Pomodoro.play();

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
    }
  });

  Template.task.helpers({
    prettyCreatedAt: function () {
      return moment(this.createdAt).format('DD/MM/YYYY, HH:mm:ss');
    }
  });
}