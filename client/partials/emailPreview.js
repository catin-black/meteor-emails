Template.emailPreview.helpers({
  subject: function () {
    return Messages.findOne({ _id: Template.instance().data.item._id }).subject;
  },
});
Template.emailPreview.events({});

Template.emailPreview.onRendered(function () {});

Template.emailPreview.onCreated(function () {});

Template.emailPreview.onDestroyed(function () {});
