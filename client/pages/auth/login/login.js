import { Meteor } from "meteor/meteor";
import {
  showDangerNotification,
  showSuccessNotification,
} from "../../../helpers/helpers";

Template.pageAuthLogin.events({
  /*
   * Login with standard credentials
   * */
  "submit #login-form": function (event) {
    event.preventDefault();

    const user = $(event.currentTarget).find("#email").val();
    const password = $(event.currentTarget).find("#password").val();

    Meteor.loginWithPassword(user, password, function (error) {
      actionAfterLogin(error);
    });
  },
});

function actionAfterLogin(error) {
  if (error) {
    switch (error.reason) {
      case "User not found":
      case "Incorrect password":
        showDangerNotification(
          TAPi18n.__("login.notification.wrongCredentials")
        );
        break;
      default:
        if (error.error === "too-many-requests") {
          showDangerNotification(
            TAPi18n.__("login.notification.tooManyRequests")
          );
        } else {
          showDangerNotification(
            TAPi18n.__("login.notification.unhandledError")
          );
          console.log(error);
        }
    }
  } else {
    Router.go("panelDashboard");
    showSuccessNotification(TAPi18n.__("login.notification.loginSuccessfull"));
  }
}
