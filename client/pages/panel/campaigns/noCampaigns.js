Template.noCampaigns.helpers({
  campaigns: function () {
    return SendInformation.find().fetch();
  },
});
