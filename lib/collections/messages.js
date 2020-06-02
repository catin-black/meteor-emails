import { Mongo } from 'meteor/mongo';
import Tabular from 'meteor/aldeed:tabular';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random'

Messages = new Mongo.Collection('Messages');

let MessagesSchemas = {};
MessagesSchemas.Messages = new SimpleSchema({
    userId: {
        type: String,
    },
    campaignId: {
        type: String,
    },
    memberId: {
        type: String,
    },
    openId: {
        type: String,
        optional: true,
        defaultValue: null
    },
    opens: {
        type: Number,
        defaultValue: 0,
        optional: true
    },
    clicks: {
        type: Number,
        defaultValue: 0,
        optional: true
    },
    subject: {
        type: String,
    },
    fromName: {
        type: String,
        optional: true,
        defaultValue: null
    },
    fromEmail: {
        type: String
    },
    originalContent: {
        type: String,
    },
    changedContent: {
        type: String,
        optional: true,
        defaultValue: null
    },
    messageId: {
        type: String,
        optional: true,
        defaultValue: null
    },
    contacted: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    transactionId: {
        type: String,
        optional: true,
        defaultValue: null
    },
    status: {
        type: String,
        optional: true,
        defaultValue: null
    },
    createdAt: {
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
    },
    sentAt: {
        type: Date
    },
});

Messages.attachSchema(MessagesSchemas.Messages);

Messages.helpers({
    promised() {
        var message = Messages.findOne({ _id: this._id });
        if (message.opens > 1 || message.clicks > 0) return '<i class="fa fa-diamond"></i>';
        else return '';
    },
    email() {
        const user = Members.findOne({ _id: this.memberId });
        if (user) {
            return user.email ? '<a class="mail d-block mx-auto text-center" href="mailto:' + user.email + '" target="blank"><span tabindex="0" data-toggle="tooltip" title="' + user.email + '"><i class="fa fa-envelope"></i></span></a>' : '-';
        } else {
            return '<i class="fa fa-ban d-block mx-auto text-center"></i>';
        }
    },
    linkedin() {
        const user = Members.findOne({ _id: this.memberId });
        if (user) {
            return user.linkedin ? '<a class="mail d-block mx-auto text-center" href="' + user.linkedin + '" target="blank"><span tabindex="0" data-toggle="tooltip" title="' + user.linkedin + '"><i class="fa fa-linkedin"></i></span></a>' : '-';
        } else {
            return '<i class="fa fa-ban d-block mx-auto text-center"></i>';
        }
    },
});

new Tabular.Table({
    name: "Messages",
    collection: Messages,
    pub: "tabular_Messages",
    responsive: false,
    autoWidth: true,
    columns: [{
        data: "memberId",
        render: function(val, type, doc) {
            const user = Members.findOne({ _id: doc.memberId });
            let name = "";
            if (user && user.name) name = name + user.name + " ";
            if (user && user.surname) name = name + user.surname + " ";
            if (name == "") name = " - "
            return '<a href="/panel/preview/' + doc.memberId + '">' + name + '</a>';

        },
        titleFn: function() {
            return TAPi18n.__('campaign.table.fullname');
        }
    }, {
        data: "email()",
        titleFn: function() {
            return TAPi18n.__('campaign.table.email');
        }
    }, {
        data: "subject",
        titleFn: function() {
            return TAPi18n.__('campaign.table.subject');
        },
        render: function(val, type, doc) {
            return val ? '<div class="text-truncate" style="width:120px"><span tabindex="0" data-toggle="tooltip" title="' + val + '">' + val + '</span></div>' : '-';
        }
    }, {
        data: "sentAt",
        titleFn: function() {
            return TAPi18n.__('campaign.table.sendDate');
        },
        render: function(val, type, doc) {
            return moment(val).format('YYYY MMM DD, HH:MM')
        },
    }, {
        data: "opens",
        titleFn: function() {
            return TAPi18n.__('campaign.table.opens');
        }
    }, {
        data: "clicks",
        titleFn: function() {
            return TAPi18n.__('campaign.table.clicks');
        }
    }, {
        data: "promised()",
        titleFn: function() {
            return TAPi18n.__('campaign.table.promised');
        },

    }, {
        data: "originalContent",
        tmpl: Meteor.isClient && Template.emailPreview,
        titleFn: function() {
            return TAPi18n.__('campaign.table.content');
        },
        tmplContext(rowData) {
            return {
                item: rowData,
            };
        }
    }],
    selector(userId) {
        return { userId: userId };
    }
});



new Tabular.Table({
    name: "Pro",
    collection: Messages,
    pub: "tabular_MessagesPro",
    responsive: false,
    autoWidth: true,
    columns: [{
            tmpl: Meteor.isClient && Template.checkbox,
            tmplContext(rowData) {
                return {
                    item: rowData,
                };
            }
        }, {
            data: "memberId",
            render: function(val, type, doc) {
                const user = Members.findOne({ _id: doc.memberId });
                let name = "";
                if (user && user.name) name = name + user.name + " ";
                if (user && user.surname) name = name + user.surname + " ";
                if (name == "") name = " - "
                return '<a href="/panel/preview/' + doc.memberId + '">' + name + '</a>';

            },
            titleFn: function() {
                return TAPi18n.__('campaign.table.fullname');
            }
        }, {
            data: "email()",
            titleFn: function() {
                return TAPi18n.__('campaign.table.email');
            }
        }, {
            data: "subject",
            titleFn: function() {
                return TAPi18n.__('campaign.table.subject');
            },
            render: function(val, type, doc) {
                return val ? '<div class="text-truncate" style="width:120px"><span tabindex="0" data-toggle="tooltip" title="' + val + '">' + val + '</span></div>' : '-';
            }
        }, {
            data: "sentAt",
            titleFn: function() {
                return TAPi18n.__('campaign.table.sendDate');
            },
            render: function(val, type, doc) {
                return moment(val).format('YYYY MMM DD, HH:MM')
            },
        }, {
            data: "opens",
            titleFn: function() {
                return TAPi18n.__('campaign.table.opens');
            }
        }, {
            data: "clicks",
            titleFn: function() {
                return TAPi18n.__('campaign.table.clicks');
            }
        }, {
            data: "linkedin()",
            titleFn: function() {
                return TAPi18n.__('campaign.table.linkedin');
            },
            tmplContext(rowData) {
                return {
                    item: rowData,
                };
            }
        }, {
            data: "originalContent",
            tmpl: Meteor.isClient && Template.emailPreview,
            titleFn: function() {
                return TAPi18n.__('campaign.table.actions');
            },
            tmplContext(rowData) {
                return {
                    item: rowData,
                };
            }
        },
        {

            tmpl: Meteor.isClient && Template.buttonsForPromising,
            tmplContext(rowData) {
                return {
                    item: rowData,
                };
            }
        },
    ],
    selector(userId) {
        return { userId: userId, contacted: false };
    }
});