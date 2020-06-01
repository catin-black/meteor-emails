import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

DisallowedEmails = new Mongo.Collection('DisallowedEmails');

let DisallowedEmailsSchema = {};

DisallowedEmailsSchema.NotAllowed = new SimpleSchema({
    userId: {
        type: String,
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    }
});

DisallowedEmails.attachSchema(DisallowedEmailsSchema.NotAllowed);