import { callServerMethod } from "/client/helpers/server-method";
import { showConfirmDialog, showSuccessAlert, showWarningAlert, showInfoAlert, showSuccessNotification, showInfoNotification, showWarningNotification, showDangerNotification } from "/client/helpers/helpers";
Template.buttonsForCrm.helpers({});
Template.buttonsForCrm.events({
    'click button.deleteSingleMember': function(event, template) {
        showConfirmDialog({
            title: TAPi18n.__('confirm.remove'),
            confirmCallback: function() {
                callServerMethod({
                    methodName: "removeMembers",
                    params: {
                        members: [template.data.item._id],
                    },
                    resultCallback: function() {
                        showSuccessNotification(TAPi18n.__('alerts.done'));
                    }
                });
            },
            cancelCallback: function() {}
        });
    }
});


Template.buttonsForCrm.onRendered(function() {

});

Template.buttonsForCrm.onDestroyed(function() {

});