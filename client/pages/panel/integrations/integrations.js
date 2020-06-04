import { Meteor } from "meteor/meteor";

Template.pagePanelIntegrations.onRendered(function () {});

Template.pagePanelIntegrations.helpers({
  userSettings: function () {
    return Settings.findOne({
      userId: Meteor.userId(),
    });
  },
});

Template.pagePanelIntegrations.events({});

Template.pagePanelIntegrations.onDestroyed(function () {});
