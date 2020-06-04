import {
  showConfirmDialog,
  showSuccessNotification,
} from "../../helpers/helpers";

Template.partialPanelSidebar.onRendered(function () {});

Template.partialPanelSidebar.helpers({});

Template.partialPanelSidebar.events({
  "click .logout": function (event) {
    event.preventDefault();

    showConfirmDialog({
      title: TAPi18n.__("logout.txt"),
      confirmCallback: function () {
        Meteor.logout(function () {
          showSuccessNotification(TAPi18n.__("logout.done"));
          Router.go("authLogin");
        });
      },
      cancelCallback: function () {
        // this.redirect(window.history.go(-1));
      },
    });
  },
});

Template.partialPanelSidebar.onDestroyed(function () {});
