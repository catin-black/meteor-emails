import {
  showConfirmDialog,
  showWarningAlert,
  showSuccessNotification,
} from "/client/helpers/helpers";
import { callServerMethod } from "/client/helpers/server-method";
import { SessionSelectedMembers } from "/client/helpers/sessions";
Template.newCampain.helpers({
  howMany: function () {
    return SessionSelectedMembers.get().length
      ? SessionSelectedMembers.get().length
      : 0;
  },
});

Template.newCampain.events({
  "submit form": function (event, template) {
    event.preventDefault();
    const subject = $("#title").val();
    const campaignTitle = $("#campaignTitle").val();
    const senderName = $("#senderName").val();
    const html = $("#text").summernote("code");
    if (subject == "") {
      showWarningAlert(TAPi18n.__("alerts.title"), TAPi18n.__("alerts.title2"));
      return false;
    }
    if (html == "<p><br></p>" || html == "") {
      showWarningAlert(TAPi18n.__("alerts.html"), TAPi18n.__("alerts.html2"));
      return false;
    }
    if (campaignTitle == "") {
      showWarningAlert(
        TAPi18n.__("alerts.title"),
        TAPi18n.__("alerts.titleCampain")
      );
      return false;
    }
    showConfirmDialog({
      title: TAPi18n.__("confirm.send2"),
      confirmCallback: function () {
        callServerMethod({
          methodName: "sendEmails",
          params: {
            members: SessionSelectedMembers.get(),
            campaign: campaignTitle,
            subject: subject,
            name: senderName,
            html: html,
          },
          resultCallback: function () {
            Router.go("panelCampaigns");
            showSuccessNotification(TAPi18n.__("alerts.done"));
            SessionSelectedMembers.nullify();
          },
        });
      },
      cancelCallback: function () {},
    });
  },
});

Template.newCampain.onRendered(function () {
  const fNameButton = function (context) {
    const ui = $.summernote.ui;

    // create button
    const button = ui.button({
      contents: TAPi18n.__("campaign.addName"),
      click: function () {
        context.invoke("editor.insertText", "{first_name}");
      },
    });

    return button.render(); // return button as jquery object
  };
  const lNameButton = function (context) {
    const ui = $.summernote.ui;

    // create button
    const button = ui.button({
      contents: TAPi18n.__("campaign.addLName"),
      click: function () {
        context.invoke("editor.insertText", "{last_name}");
      },
    });

    return button.render(); // return button as jquery object
  };
  const companyButton = function (context) {
    const ui = $.summernote.ui;

    // create button
    const button = ui.button({
      contents: TAPi18n.__("campaign.addCompany"),
      click: function () {
        context.invoke("editor.insertText", "{company}");
      },
    });

    return button.render(); // return button as jquery object
  };
  $("#text").summernote({
    toolbar: [
      ["style", ["style"]],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontname", ["fontname"]],
      ["fontsize", ["fontsize"]],
      ["color", ["color"]],
      ["para", ["ol", "ul", "paragraph", "height"]],
      ["table", ["table"]],
      ["insert", ["link", "picture", "hr"]],
      ["view", ["undo", "redo"]],
      ["mybutton1", ["fNameButton"]],
      ["mybutton2", ["lNameButton"]],
      ["mybutton3", ["companyButton"]],
    ],
    buttons: {
      fNameButton: fNameButton,
      lNameButton: lNameButton,
      companyButton: companyButton,
    },
  });
});

Template.newCampain.onDestroyed(function () {});
