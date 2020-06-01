import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
SendInformation = new Mongo.Collection('SentInformation');
import Tabular from 'meteor/aldeed:tabular';

let SendInformationSchemas = {};
SendInformationSchemas.SendInformation = new SimpleSchema({
    userId: {
        type: String,
    },
    name: {
        type: String,
    },
    howMany: {
        type: Number
    },
    opens: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    clicks: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    sent: {
        type: Boolean
    },
    sentAt: {
        type: Date,
        label: "Server date of creation",
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date
                };
            } else {
                return this.unset();
            }
        }
    }
});
SendInformation.attachSchema(SendInformationSchemas.SendInformation);

SendInformation.helpers({
    opens() {
        const messages = Messages.find({ campaignId: this._id }).fetch();
        let opens = 0;
        messages.forEach( function(msg) {
            opens = opens + msg.opens;
        });
        return opens;
    },
    clicks() {
        const messages = Messages.find({ campaignId: this._id }).fetch();
        let clicks = 0;
        messages.forEach( function(msg) {
            clicks = clicks + msg.clicks;
        });
        return clicks;
    },
});

new Tabular.Table({
    name: "SendInformation",
    collection: SendInformation,
    pub: "tabular_Campaigns",
    responsive: false,
    autoWidth: true,
    columns: [{
            tmpl: Meteor.isClient && Template.checkbox,
            tmplContext(rowData) {
                return {
                    item: rowData,
                };
            }
        },
        {
            data: "name",
            render: function(val, type, doc) {
                return val ? '<a href="/panel/campaigns/preview/' + doc._id + '">' + val + '</a>' : '-';
            },
            titleFn: function() {
                return TAPi18n.__('campaign.table.name');
            }
        },{
            data: "sentAt",
            titleFn: function() {
                return TAPi18n.__('campaign.table.sendDate');
            },
            render: function(val, type, doc) {
                return moment(val).format('YYYY MMMM DD, HH:MM:SS')
            },
        },{
            data: "howMany",
            titleFn: function() {
                return TAPi18n.__('campaign.table.howMany');
            }
        },{
            data: "opens()",
            titleFn: function() {
                return TAPi18n.__('campaign.table.opens');
            }
        },{
            data: "clicks()",
            titleFn: function() {
                return TAPi18n.__('campaign.table.clicks');
            }
        },
        {

            tmpl: Meteor.isClient && Template.buttonsForCrm,
            tmplContext(rowData) {
                return {
                    item: rowData,
                    disableEdit: true
                };
            }
        },
    ],
    selector(userId) {
        return { userId: userId, sent: true };
    }
});