import { callServerMethod } from "/client/helpers/server-method";
import {
  showDangerNotification,
  showSuccessNotification,
} from "/client/helpers/helpers";
Template.pageAuthPasswordReset.onRendered(function () {});

Template.pageAuthPasswordReset.helpers({});

Template.pageAuthPasswordReset.events({
  "submit #password-reset-form": function (event) {
    event.preventDefault();

    callServerMethod({
      methodName: "passwordReset",
      params: {
        email: $(event.currentTarget).find("#email").val(),
      },
      resultCallback: function (result) {
        showSuccessNotification(
          TAPi18n.__("resetPassword.notification.success")
        );
      },
      errorCallback: function (error) {
        showDangerNotification(error.reason);
      },
    });
  },
});
