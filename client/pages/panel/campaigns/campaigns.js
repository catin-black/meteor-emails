import {
  showConfirmDialog,
  showWarningAlert,
  showSuccessNotification,
} from "/client/helpers/helpers";
import { callServerMethod } from "/client/helpers/server-method";
import { checkTable } from "/imports/checkboxes.js";

Template.pagePanelCampaigns.helpers({
  selected: function () {
    return Template.instance().selectedCampaigns.get().length;
  },
});

Template.pagePanelCampaigns.events({
  "change .table th input[type=checkbox]": function (event, template) {
    checkTable(event);
    $("table.table tbody tr td input[type=checkbox]").each(function () {
      const checked = $(this).is(":checked");
      const campaign = $(this).attr("data-id");
      campaignArray(checked, campaign, template);
    });
  },
  "change .table tr td input[type=checkbox]": function (event, template) {
    const checked = $(event.target).is(":checked");
    const campaign = $(event.target).attr("data-id");
    campaignArray(checked, campaign, template);
  },
  "click #deleteSelected": function (event, template) {
    if (!template.selectedCampaigns.get().length)
      showWarningAlert(
        TAPi18n.__("alerts.warning"),
        TAPi18n.__("alerts.noSelected")
      );
    else {
      showConfirmDialog({
        title: TAPi18n.__("confirm.remove"),
        confirmCallback: function () {
          callServerMethod({
            methodName: "removeCampaigns",
            params: {
              campaigns: template.selectedCampaigns.get(),
            },
            resultCallback: function () {
              template.selectedCampaigns.set([]);
              showSuccessNotification(TAPi18n.__("alerts.done"));
            },
          });
        },
        cancelCallback: function () {},
      });
    }
  },
});
Template.pagePanelCampaigns.onRendered(function () {
  const template = this;
  $(".table thead").addClass("text-primary");
  $(".table thead").each(function () {
    $(this).find("th").first().append('<input type="checkbox">');
  });
  $(".dataTables_wrapper")
    .find("table")
    .on("length.dt", function () {
      selectCampaigns(template);
    })
    .on("order.dt", function () {
      selectCampaigns(template);
    })
    .on("search.dt", function () {
      selectCampaigns(template);
    })
    .on("page.dt", function () {
      selectCampaigns(template);
    });
});

Template.pagePanelCampaigns.onCreated(function () {
  this.selectedCampaigns = new ReactiveVar([]);
});

Template.pagePanelCampaigns.onDestroyed(function () {});

function campaignArray(checked, campaign, template) {
  let campaignsArray = template.selectedCampaigns.get();
  const index = campaignsArray.indexOf(campaign);
  if (campaign && checked) {
    //If do not exist
    if (index < 0) {
      campaignsArray.push(campaign);
      template.selectedCampaigns.set(campaignsArray);
    }
  } else if (campaign && !checked) {
    //If exist
    if (index > -1) {
      campaignsArray.splice(index, 1);
    }
    template.selectedCampaigns.set(campaignsArray);
  } else {
    return true;
  }
}

function selectCampaigns(template) {
  const campaignsArray = template.selectedCampaigns.get();
  template.$("table tr td input[type=checkbox]").each(function () {
    const member = $(this).attr("data-id");
    const index = campaignsArray.indexOf(member);
    if (index > -1) $(this).prop("checked", true);
  });
  $(".text-truncate span").tooltip({
    placement: "left",
  });
  $(".mail span").tooltip({
    placement: "top",
  });
}
