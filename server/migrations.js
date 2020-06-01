import { _ } from 'lodash';


Meteor.startup(function() {
    Migrations.migrateTo('latest');
});