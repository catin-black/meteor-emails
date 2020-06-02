import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

Statistics = new Mongo.Collection('Statistics');

let StatisticsSchemas = {};

StatisticsSchemas.Statistics = new SimpleSchema({
    userId: {
        type: String,
    },
    blocks: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    bounce_drops: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    bounces: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    clicks: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    deferred: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    delivered: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    invalid_emails: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    opens: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    processed: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    requests: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    spam_report_drops: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    spam_reports: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    unique_clicks: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    unique_opens: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    unsubscribe_drops: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    unsubscribes: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
});

Statistics.attachSchema(StatisticsSchemas.Statistics);