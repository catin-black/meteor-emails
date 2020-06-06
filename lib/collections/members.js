import { Mongo } from 'meteor/mongo';
import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { capitalizeFirstLetter } from "../helpers";

Members = new Mongo.Collection('members');

let MembersSchemas = {};
MembersSchemas.Members = new SimpleSchema({
    userId: {
        type: String,
        autoValue:function(){ return this.userId }
    },
    name: {
        type: String,
        max: 400,
    },
    surname: {
        type: String,

    },
    title: {
        type: String,
        optional: true,
        defaultValue: null
    },
    www: {
        type: String,
        optional: true,
        defaultValue: null
    },
    company: {
        type: String,
        optional: true,
        defaultValue: null
    },
    industry: {
        type: String,
        optional: true,
        defaultValue: null
    },
    size: {
        type: String,
        optional: true,
        defaultValue: null
    },
    location: {
        type: String,
        optional: true,
        defaultValue: null
    },
    linkedin: {
        type: String,
        optional: true,
        defaultValue: null
    },
    confidence: {
        type: String,
        optional: true,
        defaultValue: null
    },
    status: {
        type: String,
        optional: true,
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
    },
    sent: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    valid: {
        type: Boolean,
        optional: true,
        defaultValue: null
    },
    contacted: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    promising: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    categories: {
        type: Array,
        optional: true,
        defaultValue: []
    },
    'categories.$': {
        type: String,
        optional: true
    },
    tags: {
        type: Array,
        optional: true,
        defaultValue: []
    },
    'tags.$': {
        type: String,
        optional: true
    },

    blocked: {
        type: Boolean,
        optional: true,
        defaultValue: false
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
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    },
    sentAt: {
        type: Date,
        optional: true,
        defaultValue:null
    },
});

Members.attachSchema(MembersSchemas.Members);

new Tabular.Table({
    name: "Members",
    collection: Members,
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
                return val ? '<a href="/panel/preview/' + doc._id + '">' + val + '</a>' : '-';
            },
            titleFn: function() {
                return TAPi18n.__('crm.table.name');
            }
        },
        {
            data: "surname",
            render: function(val, type, doc) {
                return val ? '<a href="/panel/preview/' + doc._id + '">' + val + '</a>' : '-';
            },
            titleFn: function() {
                return TAPi18n.__('crm.table.lname');
            }
        },
        {
            data: "title",
            render: function(val, type, doc) {
                return val ? '<div class="text-truncate" style="width:120px"><span tabindex="0" data-toggle="tooltip" title="' + val + '">' + val + '</span></div>' : '-';
            },
            titleFn: function() {
                return TAPi18n.__('crm.table.title');
            }
        },
        {
            data: "company",
            render: function(val, type, doc) {
                return val ? '<div class="text-truncate" style="width:120px"><span tabindex="0" data-toggle="tooltip" title="' + val + '">' + val + '</span></div>' : '-';
            },
            titleFn: function() {
                return TAPi18n.__('crm.table.company');
            }
        },
        {
            data: "email",
            render: function(val, type, doc) {
                return val ? '<a class="mail d-block mx-auto text-center" href="mailto:' + val + '" target="blank"><span tabindex="0" data-toggle="tooltip" title="' + val + '"><i class="fa fa-envelope"></i></span></a>' : '-';
            },
            titleFn: function() {
                return TAPi18n.__('crm.table.email');
            }
        },
        {
            data: "categories",
            render: function(val, type, doc) {
                if (val && val.length) {
                    let list = "";
                    val.forEach(function(elem) {
                        return list = list + '<span class="badge badge-secondary px-2 mx-1">' + elem + '</span>';
                    });
                    return list;
                } else {
                    return '<span class="badge badge-secondary px-2 mx-1">' + TAPi18n.__('crm.table.nocategory') + '</span>';
                }
            },
            titleFn: function() {
                return TAPi18n.__('crm.table.category');
            }
        },
        {
            data: "tags",
            render: function(val, type, doc) {
                if (val && val.length) {
                    let list = "";
                    val.forEach(function(elem) {
                        return list = list + '<span class="badge badge-secondary px-2 mx-1">' + elem + '</span>';
                    });
                    return list;
                } else {
                    return '<span class="badge badge-secondary px-2 mx-1">' + TAPi18n.__('crm.table.nocategory') + '</span>';
                }
            },
            titleFn: function() {
                return TAPi18n.__('crm.table.tags');
            }
        },
        {
            data: "linkedin",
            render: function(val, type, doc) {
                return val ? '<a target="_blank" class="d-block mx-auto text-center" href="' + val + '"><i class="fa fa-linkedin"></i></a>' : '-';
            },
            titleFn: function() {
                return TAPi18n.__('crm.table.linkedin');
            }
        },
        {
            data: "contacted",
            titleFn: function() {
                return TAPi18n.__('crm.table.emailsend');
            },
            render: function(val, type, doc) {
                if (val) return '<i class="fa fa-check text-warning"></i>';
                else return '<i class="fa fa-times text-primary"></i>';
            }
        },
        {

            tmpl: Meteor.isClient && Template.buttonsForCrm,
            tmplContext(rowData) {
                return {
                    item: rowData,
                };
            }
        },
    ],
    selector(userId) {
        return { userId: userId };
    }
});


Members.allow({
    update: function(userId, doc, fields, modifier) {
        return true;
        if (userId && doc.userId === userId) {
            return true;
        }
    },
    insert: function(userId, doc, fields, modifier) {
        if (userId) {
            return true;
        } else return false;
    }
});