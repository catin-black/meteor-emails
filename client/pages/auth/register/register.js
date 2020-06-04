import { callServerMethod } from "/client//helpers/server-method";
import {
  showDangerNotification,
  showSuccessNotification,
} from "/client/helpers/helpers";
import validate from "jquery-validation";

Template.pageAuthRegister.onRendered(function () {
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
  this.$("form").validate({
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
      password: {
        required: true,
      },
      sendgridAPI: {
        required: true,
      },
      agreement: {
        required: true,
      },
    },
  });
});

Template.pageAuthRegister.helpers({});

Template.pageAuthRegister.events({
  "submit #register-form": function (event) {
    event.preventDefault();
    const email = $(event.currentTarget).find("#email");
    const password = $(event.currentTarget).find("#password");
    const sendgridAPI = $(event.currentTarget).find("#sendgridAPI");
    const agreement = $(event.currentTarget).find("#agreement");
    callServerMethod({
      methodName: "registerUser",
      params: {
        email: email.val(),
        password: password.val(),
        sendgridAPI: sendgridAPI.val(),
        agreement: agreement.is(":checked"),
      },
      resultCallback: function (result) {
        showSuccessNotification(TAPi18n.__("register.registered"));
        Router.go("authLogin");
      },
      errorCallback: function (error) {
        showDangerNotification(error.details);
      },
    });
  },
});
