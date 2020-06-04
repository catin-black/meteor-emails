/**
 * Main configuration for router
 * @type {String}
 */
import { SessionSelectedMembers } from "/client/helpers/sessions";

Router.route("/panel/dashboard", {
  name: "panelDashboard",
  controller: "panelDashboard",
});

Router.route("/panel/crm", {
  name: "panelCrm",
  controller: "panelCrm",
});
Router.route("/panel/edit/:_id", {
  name: "edit",
  controller: "editView",
});

Router.route("/panel/add/", {
  name: "add",
  controller: "addView",
});

Router.route("/panel/preview/:_id", {
  name: "preview",
  controller: "previewView",
});

Router.route("/panel/campaigns", {
  name: "panelCampaigns",
  controller: "panelCampaigns",
});

Router.route("/panel/campaigns/preview/:_id", {
  name: "previewCampaign",
  controller: "previewCampaign",
});

Router.route("/panel/campaigns/new", {
  name: "newCampaign",
  controller: "newPanelCampaigns",
});

Router.route("/panel/emails", {
  name: "panelEmails",
  controller: "panelEmails",
});

Router.route("/panel/promising-prospects", {
  name: "panelPromisingProspects",
  controller: "panelPromisingProspects",
});

Router.route("/panel/gdpr", {
  name: "panelGdpr",
  controller: "panelGdpr",
});

Router.route("/panel/integrations", {
  name: "panelIntegrations",
  controller: "panelIntegrations",
});

Router.route("/panel/settings", {
  name: "panelSettings",
  controller: "panelSettings",
});

Router.route("/", {
  name: "authLogin",
  controller: "authLogin",
});

Router.route("/auth/register", {
  name: "authRegister",
  controller: "authRegister",
});

Router.route("/auth/reset-password", {
  name: "authPasswordReset",
  controller: "authPasswordReset",
});

Router.route("/auth/new-password", {
  name: "authPasswordSet",
  controller: "authPasswordSet",
});

PanelController = RouteController.extend({
  layoutTemplate: "layoutPanel",
  onBeforeAction: function () {
    if (!Meteor.userId()) {
      Router.go("authLogin");
    } else {
      this.next();
    }
  },
});
PageController = RouteController.extend({
  layoutTemplate: "pages",
});

AuthController = RouteController.extend({
  layoutTemplate: "layoutAuthorization",
  onBeforeAction: function () {
    if (Meteor.userId()) {
      Router.go("panelDashboard");
    } else {
      this.next();
    }
  },
});

panelDashboard = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    if (this.ready()) {
      this.render("pagePanelDashboard");
    } else {
      this.render("preloader");
    }
  },
  subscriptions: function () {
    this.subscribe("statistics").wait();
  },
});

panelCrm = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    if (this.ready()) {
      this.render("pagePanelCrm");
    } else {
      this.render("preloader");
    }
  },
  subscriptions: function () {
    this.subscribe("howManyEmails").wait();
    this.subscribe("sentEmailsInfo").wait();
  },
});

panelCampaigns = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    this.render("pagePanelCampaigns");
  },
  subscriptions: function () {},
});

previewCampaign = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    if (this.ready()) {
      this.render("previewCampaign");
    } else {
      this.render("preloader");
    }
  },
  subscriptions: function () {
    this.subscribe("campaign", this.params._id).wait();
  },
});

newPanelCampaigns = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    if (SessionSelectedMembers.get() && SessionSelectedMembers.get().length)
      this.render("newCampain");
    else Router.go("panelCrm");
  },
  subscriptions: function () {},
});

panelEmails = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    this.render("pagePanelAllSendedEmails");
  },
  subscriptions: function () {},
});

panelPromisingProspects = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    this.render("pagePanelPromisingProspects");
  },
  subscriptions: function () {},
});

panelGdpr = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    this.render("pagePanelGdpr");
  },
  subscriptions: function () {
    this.subscribe("userDisallowedDomains").wait();
    this.subscribe("userDisallowedEmails").wait();
  },
});

panelIntegrations = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    if (this.ready()) {
      this.render("pagePanelIntegrations");
    } else {
      this.render("preloader");
    }
  },
  subscriptions: function () {
    this.subscribe("userIntegrations").wait();
  },
});

panelSettings = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    this.render("pagePanelSettings");
  },
  subscriptions: function () {
    this.subscribe("userBillingInformations").wait();
  },
});

// contactView = PanelController.extend({
//     onBeforeAction: function() {
//         this.next();
//     },
//     action: function() {
//         if (this.ready()) {
//             this.render('contact');
//         } else {
//             this.render('preloader');
//         }
//     },
//     subscriptions: function() {
//     }
// });
//
// linkedView = PanelController.extend({
//     onBeforeAction: function() {
//         this.next();
//     },
//     action: function() {
//         if (this.ready()) {
//             this.render('contact', {
//                 data: {
//                     linked:true
//                 }
//             });
//         } else {
//             this.render('preloader');
//         }
//     },
//     subscriptions: function() {
//     }
// });
//

//
// panelSettingsView = PanelController.extend({
//     onBeforeAction: function() {
//         this.next();
//     },
//     action: function() {
//         if (this.ready()) {
//             this.render('panelSettings');
//         } else {
//             this.render('preloader');
//         }
//     },
//     subscriptions: function() {
//         this.subscribe("userSettings").wait();
//     }
// });
//
authLogin = AuthController.extend({
  action: function () {
    this.render("pageAuthLogin");
  },
});

authRegister = AuthController.extend({
  action: function () {
    this.render("pageAuthRegister");
  },
});

authPasswordReset = AuthController.extend({
  action: function () {
    this.render("pageAuthPasswordReset");
  },
});

authPasswordSet = AuthController.extend({
  action: function () {
    this.render("pageAuthPasswordSet");
  },
});

// lostPasswordView = RouteController.extend({
//     action: function () {
//         this.render('authLostPassword');
//     }
// });
addView = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    if (this.ready()) {
      const member = Members.findOne();
      this.render("add");
    } else {
      this.render("preloader");
    }
  },
});

editView = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    if (this.ready()) {
      const member = Members.findOne();
      this.render("preview");
    } else {
      this.render("preloader");
    }
  },
  subscriptions: function () {
    this.subscribe("member", this.params._id).wait();
  },
});

previewView = PanelController.extend({
  onBeforeAction: function () {
    this.next();
  },
  action: function () {
    if (this.ready()) {
      const member = Members.findOne();
      this.render("preview");
    } else {
      this.render("preloader");
    }
  },
  subscriptions: function () {
    this.subscribe("member", this.params._id).wait();
  },
});
