import { Meteor } from "meteor/meteor";
import { callServerMethod } from "../../../helpers/server-method";
import {
  showSuccessNotification,
  showDangerNotification,
} from "../../../helpers/helpers";

Template.pagePanelSettings.helpers({
  userSettings: function () {
    return Settings.findOne({
      userId: Meteor.userId(),
    });
  },
});

Template.pagePanelSettings.onRendered(function () {
  $.validator.addMethod(
    "validate_email",
    function (value, element) {
      if (
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,12})+$/.test(
          value
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    TAPi18n.__("register.pleasProvideProperEmail")
  );
  this.$("form#emailForm").validate({
    errorPlacement: function (error, element) {
      if (element.is(":checkbox")) {
        error.insertBefore(element);
      } else {
        error.insertAfter(element);
      }
    },
    rules: {
      email: {
        required: true,
        email: true,
        validate_email: true,
      },
    },
  });
});

Template.pagePanelSettings.events({
  "submit #settingsChangePassword": function (event) {
    event.preventDefault();
    const oldPassword = $(event.currentTarget).find("#oldPassword").val(),
      newPassword = $(event.currentTarget).find("#newPassword").val(),
      newPasswordRepeat = $(event.currentTarget)
        .find("#newPasswordRepeat")
        .val();
    if (oldPassword && newPassword && newPasswordRepeat) {
      if (newPassword === newPasswordRepeat) {
        Accounts.changePassword(oldPassword, newPassword, function (err) {
          if (err) {
            showDangerNotification(err);
          } else {
            showSuccessNotification(
              TAPi18n.__("settings.notification.success")
            );
            $(event.currentTarget).find(".clear").val("");
          }
        });
      } else {
        showDangerNotification(TAPi18n.__("settings.notification.mismatch"));
      }
    } else {
      showDangerNotification(TAPi18n.__("settings.notification.error"));
    }
  },
  "submit #emailForm": function (event) {
    event.preventDefault();
    const email = $(event.currentTarget).find("#email").val();
    if (email) {
      callServerMethod({
        methodName: "additionalEmail",
        params: {
          email: email,
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
    } else {
      showDangerNotification(TAPi18n.__("settings.notification.error"));
    }
  },
});

Template.pagePanelSettings.onDestroyed(function () {});
