import { ReactiveVar } from "meteor/reactive-var";
import { checkTable } from "/imports/checkboxes.js";
import {
  showConfirmDialog,
  showWarningAlert,
  showSuccessNotification,
} from "/client/helpers/helpers";
import { callServerMethod } from "/client/helpers/server-method";

Template.pagePanelPromisingProspects.helpers({
  selector: function () {
    return {
      $or: [{ opens: { $gt: 1 } }, { clicks: { $gt: 0 } }],
    };
  },
});

Template.pagePanelPromisingProspects.events({
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
  "click #markUsed": function (event, template) {
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
            methodName: "markAsUsed",
            params: {
              messages: template.selectedMembers.get(),
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
});

Template.pagePanelPromisingProspects.onRendered(function () {
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
Template.pagePanelPromisingProspects.onCreated(function () {
  this.selectedMembers = new ReactiveVar([]);
});

Template.pagePanelPromisingProspects.onDestroyed(function () {
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
  $(".dataTables_wrapper").find("table th:last-child").addClass("text-right");
  $(".dataTables_wrapper")
    .find("table tr td button.preview")
    .addClass("pull-right");
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
