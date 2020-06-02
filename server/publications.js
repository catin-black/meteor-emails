"use strict";
import { Meteor } from 'meteor/meteor';

Meteor.publish('members', function() {
    if (!this.userId) return [];
    return Members.find({
        contacted: false,
        userId: this.userId
    }, {
        sort: {
            name: 1
        }
    });
});
Meteor.publish('member', function(id) {
    if (!this.userId) return [];
    return Members.find({
        _id: id,
        userId: this.userId,
    });
});


Meteor.publish('campaign', function(id) {
    if (!this.userId) return [];
    return SendInformation.find({
        _id: id,
        userId: this.userId,
    });
});

Meteor.publish('howManyEmails', function() {
    if (!this.userId) return [];
    return Settings.find({
        userId: this.userId,
    }, {
        fields: {
            howManyEmails: 1
        }
    });
});

Meteor.publish('sentEmailsInfo', function() {
    if (!this.userId) return [];
    const now = new Date();
    const yesterday = moment().subtract(1, "days").toISOString();
    return SendInformation.find({
        userId: this.userId,
        sentAt: {
            $gte: yesterday,
            $lt: now
        }
    });
});

Meteor.publish('message', function(_id) {
    if (!this.userId) return [];
    return Messages.find({ userId: this.userId, _id: _id }, {
        fields: {
            subject: 1
        }
    });
});

Meteor.publish('statistics', function() {
    if (!this.userId) return [];
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();
    const messages = Messages.find({
        userId: this.userId,
        sentAt: { $gte: startOfYear, $lte: endOfYear }
    }, {
        fields: {
            opens: 1,
            clicks: 1,
            sentAt: 1,
            status: 1
        }
    });
    const sendGridError = Settings.find({
        userId: this.userId
    }, {
        fields: {
            sendStatsError: 1
        }
    });
    const stats = Statistics.find({
        userId: this.userId,
    });
    return [messages, stats, sendGridError];
});

Meteor.publish('userIntegrations', function() {
    if (!this.userId) return [];
    return Settings.find({
        userId: this.userId
    }, {
        fields: {
            APIkey: 1,
            userId: 1
        }
    });
});

Meteor.publish('userBillingInformations', function() {
    if (!this.userId) return [];
    return Settings.find({
        userId: this.userId
    }, {
        fields: {
            additionalEmail: 1,
            billingInformation: 1,
            userId: 1,
            APIkey:1 
        }
    });
});

Meteor.publish('userDisallowedDomains', function() {
    if (!this.userId) return [];
    return DisallowedDomains.find({
        userId: this.userId
    });
});

Meteor.publish('userDisallowedEmails', function() {
    if (!this.userId) return [];
    return DisallowedEmails.find({
        userId: this.userId
    });
});




Meteor.publishComposite("tabular_Messages", function(tableName, ids, fields) {
    check(tableName, String);
    check(ids, Array);
    check(fields, Match.Optional(Object));

    this.unblock(); // requires meteorhacks:unblock package

    return {
        find: function() {
            this.unblock(); // requires meteorhacks:unblock package
            return Messages.find({ _id: { $in: ids } }, { fields: fields });
        },
        children: [{
            find: function(feedback) {
                this.unblock(); // requires meteorhacks:unblock package
                // Publish the related user
                return Members.find({ _id: feedback.memberId }, { limit: 1, sort: { _id: 1 } });
            }
        }]
    };
});


Meteor.publishComposite("tabular_MessagesPro", function(tableName, ids, fields) {
    check(tableName, String);
    check(ids, Array);
    check(fields, Match.Optional(Object));
    this.unblock(); // requires meteorhacks:unblock package

    return {
        find: function() {
            this.unblock(); // requires meteorhacks:unblock package
            // const MembersArray = Members.find({ userId: this.userId, contacted: false, blocked: false }).fetch();
            // const MembersIdsArray = [];
            // if (MembersArray.length) {
            //     MembersArray.forEach(function(member) {
            //         MembersIdsArray.push(member._id);
            //     });
            // }
            return Messages.find({ _id: { $in: ids }}, { fields: fields });
        },
        children: [{
            find: function(feedback) {
                this.unblock(); // requires meteorhacks:unblock package
                // Publish the related user
                return Members.find({ _id: feedback.memberId }, { limit: 1, sort: { _id: 1 } });
            }
        }]
    };
});

Meteor.publishComposite("tabular_Campaigns", function(tableName, ids, fields) {
    check(tableName, String);
    check(ids, Array);
    check(fields, Match.Optional(Object));

    this.unblock(); // requires meteorhacks:unblock package

    return {
        find: function() {
            this.unblock(); // requires meteorhacks:unblock package
            return SendInformation.find({ _id: { $in: ids } }, { fields: fields });
        },
        children: [{
            find: function(feedback) {
                this.unblock(); // requires meteorhacks:unblock package
                // Publish the related user
                return Messages.find({ campaignId: feedback._id }, { sort: { _id: 1 } });
            }
        }]
    };
});