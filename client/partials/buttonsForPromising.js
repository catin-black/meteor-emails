import { callServerMethod } from "/client/helpers/server-method";
import {
  showConfirmDialog,
  showSuccessNotification,
} from "/client/helpers/helpers";

Template.buttonsForPromising.helpers({});

Template.buttonsForPromising.events({
  "click button.markAsUsed": function (event, templateInstance) {
    showConfirmDialog({
      title: TAPi18n.__("confirm.markAsUsed"),
      confirmCallback: function () {
        callServerMethod({
          methodName: "markAsUsed",
          params: {
            messages: [templateInstance.data.item.memberId],
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

Template.buttonsForPromising.onRendered(function () {});

Template.buttonsForPromising.onDestroyed(function () {});
