/**
* Models
*/

if (Meteor.isServer) {
  Members = new Meteor.Collection('members');
  Tasks = new Meteor.Collection('tasks');
}