Template.partialPanelFooter.onRendered(function () {});

Template.partialPanelFooter.helpers({
  currentYear: function () {
    return new Date().getFullYear();
  },
});

Template.partialPanelFooter.events({});

Template.partialPanelFooter.onDestroyed(function () {});
