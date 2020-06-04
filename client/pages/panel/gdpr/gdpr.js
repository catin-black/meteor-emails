import { callServerMethod } from "/client/helpers/server-method";
import {
  showSuccessNotification,
  showDangerNotification,
} from "/client/helpers/helpers";

Template.pagePanelGdpr.onRendered(function () {});

Template.pagePanelGdpr.helpers({
  disallowedDomains: function () {
    const domains = DisallowedDomains.find({
      userId: Meteor.userId(),
    });

    return domains.count() > 0 ? domains : [];
  },
  disallowedEmails: function () {
    const emails = DisallowedEmails.find({
      userId: Meteor.userId(),
    });
    return emails.count() > 0 ? emails : [];
  },
});

Template.pagePanelGdpr.events({
  "submit #add-disallowed-email": function (event) {
    event.preventDefault();

    callServerMethod({
      methodName: "badEmail",
      params: {
        email: $(event.currentTarget).find("[type=email]").val(),
      },
      resultCallback: function () {
        showSuccessNotification(TAPi18n.__("gdpr.notification.correct"));
      },
    });
  },

  "submit #add-disallowed-domain": function (event) {
    event.preventDefault();

    let domain = $(event.currentTarget).find("[type=text]").val();
    let correctDomain = domain.match(
      /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,10})$/
    );

    if (correctDomain) {
      callServerMethod({
        methodName: "addDisallowedDomain",
        params: {
          domain: domain,
        },
        resultCallback: function () {
          showSuccessNotification(TAPi18n.__("gdpr.notification.correct"));
        },
      });
    } else {
      showDangerNotification(TAPi18n.__("gdpr.notification.wrongDomainName"));
    }
  },

  "click .remove-email": function (event) {
    event.preventDefault();

    callServerMethod({
      methodName: "removeDisallowedEmail",
      params: {
        emailId: event.currentTarget.getAttribute("data-id"),
      },
      resultCallback: function () {
        showSuccessNotification(TAPi18n.__("gdpr.notification.deletedEmail"));
      },
    });
  },

  "click .remove-domain": function (event) {
    event.preventDefault();

    callServerMethod({
      methodName: "removeDisallowedDomain",
      params: {
        domainId: event.currentTarget.getAttribute("data-id"),
      },
      resultCallback: function () {
        showSuccessNotification("Domena została usunięta!");
      },
    });
  },
});

Template.pagePanelGdpr.onDestroyed(function () {});
