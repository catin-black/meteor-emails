"use strict";
import "bootstrap/dist/js/bootstrap.js";
import "summernote/dist/summernote-bs4.js";
import "summernote/dist/summernote-bs4.css";
import "summernote-fontawesome";
import { SessionAuthorizationPasswordToken } from "./helpers/sessions";
import dataTablesBootstrap from "datatables.net-bs4";
import icons from "glyphicons";
import SmoothScroll from "smooth-scroll";
import {
  showWarningNotification,
  showSuccessNotification,
} from "/client/helpers/helpers";

Meteor.startup(function () {
  TAPi18n.setLanguage("en");
});

Accounts.onResetPasswordLink(function (token, done) {
  SessionAuthorizationPasswordToken.set(token);
  Router.go("authPasswordSet");
});
dataTablesBootstrap(window, $);

new SmoothScroll('a.scrollme[href*="#"]', {
  speed: 600,
});

const hooksObject = {
  onSubmit: function (insertDoc, updateDoc, currentDoc) {
    this.done();
  },
  onSuccess: function (formType, result) {
    if (result) {
      showSuccessNotification("Success");
      Router.go("panelCrm");
      return false;
    }
  },
  onError: function (formType, error) {
    if (error) {
      showWarningNotification("Check your form");
      return false;
    }
  },
};

const integrationsHooks = {
  onSubmit: function (insertDoc, updateDoc, currentDoc) {
    this.done();
  },
  onSuccess: function (formType, result) {
    if (result) {
      showSuccessNotification("Success");
      return false;
    }
  },
  onError: function (formType, error) {
    if (error) {
      showWarningNotification("Check your form");
      return false;
    }
  },
};

AutoForm.addHooks(["memberAdd"], hooksObject);
AutoForm.addHooks(
  [
    "integrationsUpdateSalesFlareAPI",
    "integrationsUpdateHubSpotAPI",
    "integrationsUpdateInfusionSoftAPI",
    "settingsUpdateProfile",
  ],
  integrationsHooks
);
