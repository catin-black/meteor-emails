import { tooltips } from "/client/helpers/tooltips";

Template.previewCampaign.helpers({
  info: function () {
    return Template.instance().sendInfo.get();
  },
  selector: function () {
    return {
      campaignId: Router.current().params._id,
    };
  },
});

Template.previewCampaign.events({});
Template.previewCampaign.onRendered(function () {
  $(".table thead").addClass("text-primary");
  const template = this;
  tooltips(template);
});

Template.previewCampaign.onCreated(function () {
  this.sendInfo = new ReactiveVar(SendInformation.findOne());
});

Template.previewCampaign.onDestroyed(function () {});
