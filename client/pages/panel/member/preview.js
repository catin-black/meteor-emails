import { callServerMethod } from "/client/helpers/server-method";
import {
  showConfirmDialog,
  showSuccessNotification,
} from "/client/helpers/helpers";
Template.preview.helpers({
  member: function () {
    let member = Members.findOne({});
    member.createdAt = member.createdAt
      ? moment(member.createdAt).format("YYYY MMMM DD, HH:MM:SS")
      : null;
    member.updatedAt = member.createdAt
      ? moment(member.createdAt).format("YYYY MMMM DD, HH:MM:SS")
      : null;
    member.sentAt = member.sentAt
      ? moment(member.sentAt).format("YYYY MMMM DD, HH:MM:SS")
      : null;

    if (member.categories && member.categories.length) {
      let categ = "";
      member.categories.forEach(function (cat) {
        return (categ =
          categ +
          '<span class="badge badge-info px-2 mx-1">' +
          cat +
          "</span>");
      });
      member.categoriesString = categ;
    }
    if (member.tags && member.tags.length) {
      let tags = "";
      member.tags.forEach(function (cat) {
        tags =
          tags + '<span class="badge badge-info px-2 mx-1">' + cat + "</span>";
      });
      member.tagsString = tags;
    }

    return member;
  },
  isEdit: function () {
    return Router.current().route.getName() == "edit" ? true : false;
  },
  name: function () {
    return TAPi18n.__("membersPrev.name");
  },
  surname: function () {
    return TAPi18n.__("membersPrev.surname");
  },
  title: function () {
    return TAPi18n.__("membersPrev.title");
  },
  www: function () {
    return TAPi18n.__("membersPrev.www");
  },
  company: function () {
    return TAPi18n.__("membersPrev.company");
  },
  industry: function () {
    return TAPi18n.__("membersPrev.industry");
  },
  size: function () {
    return TAPi18n.__("membersPrev.size");
  },
  location: function () {
    return TAPi18n.__("membersPrev.location");
  },
  linkedin: function () {
    return TAPi18n.__("membersPrev.linkedin");
  },
  confidence: function () {
    return TAPi18n.__("membersPrev.confidence");
  },
  status: function () {
    return TAPi18n.__("membersPrev.status");
  },
  email: function () {
    return TAPi18n.__("membersPrev.email");
  },
  contacted: function () {
    return TAPi18n.__("membersPrev.contacted");
  },
  categories: function () {
    return TAPi18n.__("membersPrev.categories");
  },
  tags: function () {
    return TAPi18n.__("membersPrev.tags");
  },
});

Template.preview.events({
  "click button.addCat": function (event, template) {
    const input = template.$("input.addCat");
    const value = input.val() ? input.val() : false;
    if (value) {
      callServerMethod({
        methodName: "addCat",
        params: {
          value: value,
          memberId: Members.findOne()._id,
        },
        resultCallback: function () {
          showSuccessNotification(TAPi18n.__("alerts.done"));
          input.val("");
        },
      });
    }
  },
  "click button.addTag": function (event, template) {
    const input = template.$("input.addTag");
    const value = input.val() ? input.val() : false;
    if (value) {
      callServerMethod({
        methodName: "addTag",
        params: {
          value: value,
          memberId: Members.findOne()._id,
        },
        resultCallback: function () {
          showSuccessNotification(TAPi18n.__("alerts.done"));
          input.val("");
        },
      });
    }
  },
  "click button.removeCat": function (event, template) {
    const button = $(event.target);
    const value = button.attr("data-cat") ? button.attr("data-cat") : false;
    if (value) {
      callServerMethod({
        methodName: "removeCat",
        params: {
          value: value,
          memberId: Members.findOne()._id,
        },
        resultCallback: function () {
          showSuccessNotification(TAPi18n.__("alerts.done"));
        },
      });
    }
  },
  "click button.removeTag": function (event, template) {
    const button = $(event.target);
    const value = button.attr("data-tag") ? button.attr("data-tag") : false;
    if (value) {
      callServerMethod({
        methodName: "removeTag",
        params: {
          value: value,
          memberId: Members.findOne()._id,
        },
        resultCallback: function () {
          showSuccessNotification(TAPi18n.__("alerts.done"));
        },
      });
    }
  },
  "click button.block": function (event, template) {
    const button = $(event.target);
    const value =
      button.attr("data-block") && button.attr("data-block") == "true"
        ? true
        : false;
    callServerMethod({
      methodName: "block",
      params: {
        block: value,
        memberId: Members.findOne()._id,
      },
      resultCallback: function () {
        showSuccessNotification(TAPi18n.__("alerts.done"));
      },
    });
  },
  "click button.remove": function (event, template) {
    showConfirmDialog({
      title: TAPi18n.__("confirm.remove"),
      confirmCallback: function () {
        callServerMethod({
          methodName: "removeMembers",
          params: {
            memberId: Members.findOne()._id,
          },
          resultCallback: function () {
            Router.go("panelCrm");
            showSuccessNotification(TAPi18n.__("alerts.done"));
          },
        });
      },
      cancelCallback: function () {},
    });
  },
  "click button#markAsUsed": function (event, template) {
    const used = $(event.target).attr("data-value") == "true" ? true : false;
    showConfirmDialog({
      title: TAPi18n.__("confirm.marked"),
      confirmCallback: function () {
        callServerMethod({
          methodName: "markContactAsUsed",
          params: {
            memberId: Members.findOne()._id,
            contacted: used,
          },
          resultCallback: function () {
            showSuccessNotification(TAPi18n.__("alerts.done"));
          },
        });
      },
      cancelCallback: function () {},
    });
  },
  "click button#markAsContacted": function (event, template) {
    const sent = $(event.target).attr("data-value") == "true" ? true : false;
    showConfirmDialog({
      title: TAPi18n.__("confirm.marked"),
      confirmCallback: function () {
        callServerMethod({
          methodName: "markContactAsContacted",
          params: {
            memberId: Members.findOne()._id,
            sent: sent,
          },
          resultCallback: function () {
            showSuccessNotification(TAPi18n.__("alerts.done"));
          },
        });
      },
      cancelCallback: function () {},
    });
  },
});

Template.preview.onRendered(function () {});

Template.preview.onDestroyed(function () {});
