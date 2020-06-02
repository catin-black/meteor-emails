'use strict';
import { Meteor } from 'meteor/meteor';
import { _ } from 'lodash';

Meteor.startup(function() {
    process.env.MAIL_URL = Meteor.settings.private.mailUrl;
});
