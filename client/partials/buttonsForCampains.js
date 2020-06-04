import { callServerMethod } from "/client/helpers/server-method";
import {
  showConfirmDialog,
  showSuccessNotification,
} from "/client/helpers/helpers";

Template.buttonsForCampains.helpers({});
Template.buttonsForCampains.events({
  "click button.deleteSingleCampain": function (event, template) {
    showConfirmDialog({
      title: TAPi18n.__("confirm.remove"),
      confirmCallback: function () {
        callServerMethod({
          methodName: "removeCampaigns",
          params: {
            campaigns: [template.data.item._id],
          },
          resultCallback: function () {
            showSuccessNotification(TAPi18n.__("alerts.done"));
          },
        });
      },
      cancelCallback: function () {},
    });
  },
});

Template.buttonsForCampains.onRendered(function () {});

Template.buttonsForCampains.onDestroyed(function () {});
