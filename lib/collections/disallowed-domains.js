import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

DisallowedDomains = new Mongo.Collection('DisallowedDomains');

let DisallowedDomainsSchema = {};

DisallowedDomainsSchema.NotAllowed = new SimpleSchema({
    userId: {
        type: String,
    },
    domain: {
        type: String,
        // optional: false,
    }
});

DisallowedDomains.attachSchema(DisallowedDomainsSchema.NotAllowed);