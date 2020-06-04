import {
  showDangerNotification,
  showSuccessNotification,
} from "/client/helpers/helpers";
import { SessionAuthorizationPasswordToken } from "../../../helpers/sessions";
Template.pageAuthPasswordSet.onRendered(function () {});

Template.pageAuthPasswordSet.helpers({});

Template.pageAuthPasswordSet.events({
  "submit #password-set-form": function (event) {
    event.preventDefault();

    const password = $(event.currentTarget).find("#password").val();
    const token = SessionAuthorizationPasswordToken.get();

    if (token && password) {
      Accounts.resetPassword(token, password, function (err) {
        showDangerNotification(err);
      });
      showSuccessNotification(TAPi18n.__("setPassword.notification.success"));
    } else {
      showDangerNotification(TAPi18n.__("setPassword.notification.error"));
    }
  },
});
