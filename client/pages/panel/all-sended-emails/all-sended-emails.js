import { tooltips } from "/client/helpers/tooltips";
Template.pagePanelAllSendedEmails.helpers({});

Template.pagePanelAllSendedEmails.events({});
Template.pagePanelAllSendedEmails.onRendered(function () {
  $(".table thead").addClass("text-primary");
  const template = this;
  tooltips(template);
});

Template.pagePanelAllSendedEmails.onDestroyed(function () {});
