import { ReactiveVar } from "meteor/reactive-var";
import { checkTable } from "/imports/checkboxes.js";
import {
  showConfirmDialog,
  showWarningAlert,
  showSuccessNotification,
} from "/client/helpers/helpers";
import { callServerMethod } from "/client/helpers/server-method";
import { SessionSelectedMembers } from "/client/helpers/sessions";

Template.pagePanelCrm.helpers({
  selected: function () {
    return Template.instance().selectedMembers.get().length;
  },
  left: function () {
    return Template.instance().howManyLeft.get();
  },
  selector: function () {
    return {
      sent: Template.instance().contacted.get(),
      blocked: Template.instance().blocked.get(),
    };
  },
});

Template.pagePanelCrm.events({
  "change .table th input[type=checkbox]": function (event, template) {
    checkTable(event);
    $("table.table tbody tr td input[type=checkbox]").each(function () {
      const checked = $(this).is(":checked");
      const member = $(this).attr("data-id");
      memberArray(checked, member, template);
    });
  },
  "change .table tr td input[type=checkbox]": function (event, template) {
    const checked = $(event.target).is(":checked");
    const member = $(event.target).attr("data-id");
    memberArray(checked, member, template);
  },
  "change #showContacted": function (event, template) {
    const checked = $(event.target).is(":checked");
    template.contacted.set(checked);
  },
  "change #showBlocked": function (event, template) {
    const checked = $(event.target).is(":checked");
    template.blocked.set(checked);
  },
  "click #deleteSelected": function (event, template) {
    if (!template.selectedMembers.get().length)
      showWarningAlert(
        TAPi18n.__("alerts.warning"),
        TAPi18n.__("alerts.noSelected")
      );
    else {
      showConfirmDialog({
        title: TAPi18n.__("confirm.remove"),
        confirmCallback: function () {
          callServerMethod({
            methodName: "removeMembers",
            params: {
              members: template.selectedMembers.get(),
            },
            resultCallback: function () {
              template.selectedMembers.set([]);
              showSuccessNotification(TAPi18n.__("alerts.done"));
            },
          });
        },
        cancelCallback: function () {},
      });
    }
  },
  "click #sendToSelected": function (event, template) {
    if (
      !template.selectedMembers.get() ||
      !template.selectedMembers.get().length
    )
      showWarningAlert(
        TAPi18n.__("alerts.limitError"),
        TAPi18n.__("alerts.limitError2")
      );
    else if (template.howManyLeft.get() < 1)
      showWarningAlert(
        TAPi18n.__("alerts.warning"),
        TAPi18n.__("alerts.noSelected")
      );
    else if (template.howManyLeft.get() < template.selectedMembers.get().length)
      showWarningAlert(
        TAPi18n.__("alerts.tooMuch"),
        TAPi18n.__("alerts.tooMuch2", template.howManyLeft.get())
      );
    else {
      showConfirmDialog({
        title: TAPi18n.__("confirm.send"),
        confirmCallback: function () {
          SessionSelectedMembers.set(template.selectedMembers.get());
          Router.go("newCampaign");
        },
        cancelCallback: function () {},
      });
    }
  },
});

Template.pagePanelCrm.onRendered(function () {
  const template = this;
  $(".table thead").addClass("text-primary");
  $(".table thead").each(function () {
    $(this).find("th").first().append('<input type="checkbox">');
  });
  $(".dataTables_wrapper")
    .find("table")
    .on("length.dt", function () {
      selectCheckboxes(template);
    })
    .on("order.dt", function () {
      selectCheckboxes(template);
    })
    .on("search.dt", function () {
      selectCheckboxes(template);
    })
    .on("page.dt", function () {
      selectCheckboxes(template);
    });
});

Template.pagePanelCrm.onCreated(function () {
  this.selectedMembers = new ReactiveVar([]);
  this.contacted = new ReactiveVar(false);
  this.blocked = new ReactiveVar(false);
  this.howManyEmailsICanSend = new ReactiveVar(
    Settings.findOne().howManyEmails
  );

  const sent = SendInformation.find().fetch();
  let howMany = 0;
  sent.forEach(function (elem) {
    howMany = howMany + elem.howMany;
  });

  this.howManyLeft = new ReactiveVar(
    parseInt(this.howManyEmailsICanSend.get()) - parseInt(howMany)
  );
});

Template.pagePanelCrm.onDestroyed(function () {
  this.selectedMembers.set([]);
});

function selectCheckboxes(template) {
  const membersArray = template.selectedMembers.get();
  template.$("table tr td input[type=checkbox]").each(function () {
    const member = $(this).attr("data-id");
    const index = membersArray.indexOf(member);
    if (index > -1) $(this).prop("checked", true);
  });
  $(".text-truncate span").tooltip({
    placement: "left",
  });
  $(".mail span").tooltip({
    placement: "top",
  });
}

function memberArray(checked, member, template) {
  let membersArray = template.selectedMembers.get();
  const index = membersArray.indexOf(member);
  if (member && checked) {
    //If do not exist
    if (index < 0) {
      membersArray.push(member);
      template.selectedMembers.set(membersArray);
    }
  } else if (member && !checked) {
    //If exist
    if (index > -1) {
      membersArray.splice(index, 1);
    }
    template.selectedMembers.set(membersArray);
  } else {
    return true;
  }
}
