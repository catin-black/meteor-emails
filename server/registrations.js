Accounts.onCreateUser(function(options, user) {

    if (user.services.facebook) {
        user.emails = [{
            "address": user.services.facebook.email,
            "verified": true
        }];
        user.username = user.services.facebook.email;

    } else if (user.services.google) {
        user.emails = [{
            "address": user.services.google.email,
            "verified": true
        }];
        user.username = user.services.google.email;

    } else if (user.services.twitter) {
        user.emails = [{
            "address": user.services.twitter.email,
            "verified": true
        }];
        user.username = user.services.twitter.email;

    }
    
    user.profile = {};
    Settings.insert({
        userId: user._id,
        APIkey: {},
        billingInformation: {},
        additionalEmail: user.emails[0].address
    });
    Statistics.insert({
        userId: user._id,
        APIkey: {},
        billingInformation: {}
    });
    return user;
});