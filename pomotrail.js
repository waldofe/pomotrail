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

    players: function () {
      return Tasks.find({status: { $in: ['working', 'paused'] }});
    },

    hideCompleted: function () {
      return Session.get("hideCompleted");
    },

    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
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
        createdAt: new Date(),
        status: 'pending'
      });

      event.target.text.value = "";

      return false;
    }
  });
}