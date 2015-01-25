Members = new Meteor.Collection('members');
Tasks = new Meteor.Collection('tasks');

if (Meteor.isClient) {
  Pomodoro.initialize();

  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },

    ongoingTasks: function () {
      return Tasks.find({status: 'working'});
    },

    hideCompleted: function () {
      return Session.get("hideCompleted");
    },

    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    },

    timer: function () {
      return Session.get('pomodoroTimer');
    }
  });

  Template.body.events({
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    },

    "submit .new-task": function (event) {
      var text = event.target.text.value;

      Tasks.insert({
        title: text,
        createdAt: new Date()
      });

      event.target.text.value = "";

      return false;
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },

    "click .delete": function () {
      Tasks.remove(this._id);
    },

    "click .micro-control .play": function () {
      Pomodoro.play();

      Tasks.update({status: 'working'}, {$set: {status: 'pending'}}, { multi: true });

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