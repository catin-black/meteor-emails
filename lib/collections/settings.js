import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

Settings = new Mongo.Collection('Settings');
let SettingsSchema = {};
SettingsSchema.Settings = new SimpleSchema({
    userId: {
        type: String,
    },
    additionalEmail: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true,
        label: "Send emails from address"
    },
    howManyEmails: {
        type: Number,
        optional: true,
        defaultValue: 100
    },
    sendStatsError: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    APIkey: {
        type: Object,
        label: "API Keys"
    },

    'APIkey.sendGrid': {
        type: String,
        optional: true,
        label: "Send Grid API Key"
    },

    'APIkey.salesFlare': {
        type: String,
        optional: true,
    },

    'APIkey.salesFlareUserId': {
        type: String,
        optional: true,
    },

    'APIkey.hubSpot': {
        type: String,
        optional: true,
    },

    'APIkey.infusionSoft': {
        type: String,
        optional: true,
    },

    billingInformation: {
        type: String,
        optional: true,
        type: Object,
    },

    'billingInformation.firstName': {
        type: String,
        optional: true,
    },

    'billingInformation.lastName': {
        type: String,
        optional: true,
    },

    'billingInformation.address': {
        type: String,
        optional: true,
    },

    'billingInformation.city': {
        type: String,
        optional: true,
    },

    'billingInformation.country': {
        type: String,
        optional: true,
    },

    'billingInformation.postalCode': {
        type: String,
        optional: true,
    },

    'billingInformation.additionalInformation': {
        type: String,
        optional: true,
    }
});

Settings.attachSchema(SettingsSchema.Settings);

Settings.allow({
    update: function(userId, doc, fields, modifier) {
        if (fields.indexOf("howManyEmails") < 0) {
            if (userId && doc.userId === userId) {
                return true;
            }
        } else return false;
    }
});