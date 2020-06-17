import { _ } from "lodash";
import { check } from "meteor/check";
import { Accounts } from "meteor/accounts-base";
import sgMail from "@sendgrid/mail";
import { capitalizeFirstLetter } from "../lib/helpers";

Meteor.methods({
  registerUser: function (args) {
    try {
      check(args.email, String);
      check(args.password, String);
      check(args.agreement, Boolean);
      check(args.sendgridAPI, String);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      args.username = args.email;
      const createdUserId = Accounts.createUser(
        Object.assign(args, {
          profile: {},
        })
      );

      if (createdUserId) {
        Meteor.users.update(
          {
            _id: createdUserId,
          },
          {
            $set: {
              agreement: args.agreement,
            },
          }
        );
        Settings.update(
          {
            userId: createdUserId,
          },
          {
            $set: {
              "APIkey.sendGrid": args.sendgridAPI,
            },
          }
        );
      }
      return createdUserId;
    } catch (e) {
      if (e.error == 403)
        throw new Meteor.Error(
          "register-error",
          500,
          TAPi18n.__("register.userExist")
        );
      else
        throw new Meteor.Error(
          "register-error",
          500,
          TAPi18n.__("register.error")
        );
    }
  },
  passwordReset: function (args) {
    check(args.email, String);

    const userId = Accounts.findUserByEmail(args.email);

    try {
      Accounts.sendResetPasswordEmail(userId._id);
    } catch (err) {
      throw new Error(err);
    }
  },
  canISend: function () {
    const userId = Meteor.userId();
    if (!userId)
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );

    const sentAt = SendInformation.findOne({
        userId: userId
    }, {
        sort: {
            sentAt: -1
        }
    });
    let diff = 1;
    if (!sentAt) return true;
    const iscurrentDate = moment(sentAt.sentAt).isSame(new Date(), "day");
    if (iscurrentDate) {
        const set = Settings.findOne({
            userId: userId
        });

        return set.howManyEmails >= sentAt.howMany;
    } else return true;
  },
  additionalEmail: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.email, String);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      Settings.update(
        { userId: Meteor.userId() },
        {
          $set: {
            additionalEmail: params.email,
          },
        }
      );
    } catch (e) {
      throw new Meteor.Error("members-error", 500, e.details);
    }
  },
  sendEmails: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );

    try {
      check(params.members, Array);
      check(params.subject, String);
      check(params.campaign, String);
      check(params.name, String);
      check(params.html, String);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      const userId = Meteor.userId();
      if (!userId)
        throw new Meteor.Error(
          "send-error",
          500,
          TAPi18n.__("server.youAreNotAllowed")
        );
      const canISend = Meteor.call("canISend");
      const settings = Settings.findOne({ userId: userId });
      if (!canISend)
        throw new Meteor.Error("send-error", 403, TAPi18n.__("crm.canNotSent"));
      if (!settings.APIkey.sendGrid)
        throw new Meteor.Error("send-error", 500, TAPi18n.__("crm.noApiKey"));
      sgMail.setApiKey(settings.APIkey.sendGrid);
      const from =
        settings && settings.additionalEmail
          ? settings.additionalEmail
          : Meteor.user().emails[0].address;
      const membersArray = Members.find({
        _id: { $in: params.members },
        userId: userId,
        blocked: false,
      }).fetch();
      const campaignId = SendInformation.insert({
        name: params.campaign,
        userId: userId,
        howMany: membersArray.length,
        sentAt: new Date(),
        sent: false,
      });

      membersArray.forEach(function (member) {
        const id = member._id;
        const name = member.name ? capitalizeFirstLetter(member.name) : "";
        const surname = member.surname
          ? capitalizeFirstLetter(member.surname)
          : "";
        const company = member.company ? member.company : "";
        const email = member.email;

        let html = params.html;
        let subject = params.subject;

        //find and replace name
        html = html.replace(/{first_name}/g, name);
        //find and replace surname
        html = html.replace(/{last_name}/g, surname);
        //find and replace company
        html = html.replace(/{company}/g, company);

        //find and replace name
        subject = subject.replace(/{first_name}/g, name);
        //find and replace surname
        subject = subject.replace(/{last_name}/g, surname);
        //find and replace company
        subject = subject.replace(/{company}/g, company);
        let sendAt = getRandomArbitrary(1, 3600);
        sendAt = moment().add(sendAt, "seconds");
        const msg = {
          to: email,
          from: {
            email: from,
            name: params.name != "" ? params.name : params.from,
          },
          subject: subject,
          html: html,
          // send_at: sendAt.unix()
        };
        const Future = require("fibers/future");
        const responseId = new Future();
        const sendgridResponse = sgMail.send(msg);
        sendgridResponse
          .then(function (r) {
            responseId.return(r[0].headers["x-message-id"]);
          })
          .catch(function (reason) {
            responseId.return(false);
          });
        const messageId = responseId.wait();
        if (messageId) {
          Messages.insert({
            userId: userId,
            memberId: id.toString(),
            subject: subject,
            messageId: messageId,
            campaignId: campaignId,
            fromName: params.name != "" ? params.name : null,
            fromEmail: from,
            originalContent: html,
            sentAt: sendAt.toISOString(),
          });
          Members.update(
            { _id: id, userId: Meteor.userId() },
            {
              $set: {
                sent: true,
                sentAt: new Date(),
              },
            }
          );
        } else {
          //TODO: Show user how many emails was not send
        }
        return true;
      });
      return SendInformation.update(
        { _id: campaignId },
        {
          $set: {
            sent: true,
          },
        }
      );
    } catch (e) {
      throw new Meteor.Error("members-error", 500, e.details);
    }
  },
  crm: function (memberId) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      const accessTokenString = `Bearer ${getSalesFlareApiKey()}`;
      const member = Members.findOne({
        _id: memberId,
      });
      if (!member) return false;
      if (!validateEmail(member.email)) return false;
      const Future = require("fibers/future");
      const id = new Future();
      const account = new Future();
      const account2 = new Future();
      const accountContact = new Future();
      let crmId = "";
      let accountId = [];
      let accountContactId = "";

      HTTP.call(
        "POST",
        "https://api.salesflare.com/contacts",
        {
          headers: {
            Authorization: accessTokenString,
            "content-type": "application/json; charset=utf-8",
          },
          data: {
            owner: getSalesFlareUserId(),
            email: member.email,
            firstname: member.name,
            lastname: member.surname,
            address: { state_region: member.location },
            name: member.name + " " + member.surname,
            organisation: member.company,
            role: member.title,
            position: { organisation: member.company, role: member.title },
            domain: member.www,
            social_profiles: [{ url: member.linkedin }],
          },
        },
        (error, result) => {
          if (error) {
            return false;
          }
          id.return(result.data.id);
        }
      );
      crmId = id.wait();
      if (member.company) {
        HTTP.call(
          "GET",
          "https://api.salesflare.com/accounts",
          {
            headers: {
              Authorization: accessTokenString,
              "content-type": "application/json; charset=utf-8",
            },
            params: {
              name: member.company,
            },
          },
          (error, result) => {
            if (error) {
              return false;
            }

            account.return(result.data);
          }
        );
        accountId = account.wait();
      }
      if (!accountId.length) {
        HTTP.call(
          "POST",
          "https://api.salesflare.com/accounts",
          {
            headers: {
              Authorization: accessTokenString,
              "content-type": "application/json; charset=utf-8",
            },
            data: {
              id: crmId,
              name: member.company,
              owner: getSalesFlareUserId(),
            },
          },
          (error, result) => {
            if (error) {
              return false;
            }
            account2.return(result.data.id);
          }
        );
        accountId = account2.wait();
      } else {
        accountId = accountId[0].id;
      }
      HTTP.call(
        "POST",
        "https://api.salesflare.com/accounts/" + accountId + "/contacts",
        {
          headers: {
            Authorization: accessTokenString,
            "content-type": "application/json; charset=utf-8",
          },
          data: {
            id: crmId,
          },
        },
        (error, result) => {
          if (error) {
            return false;
          }
          accountContact.return(result.data.id);
        }
      );
      accountContactId = accountContact.wait();
      Members.update(
        { _id: memberId },
        {
          $set: {
            crmId: crmId,
            crmAccountId: accountId,
          },
        }
      );
      return true;
    } catch (e) {}
  },
  task: function (id) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    return;
    // const member = Members.findOne({ _id: id });
    // if (!member || member.notAllowed || member.updatedInCRM) return false;
    // if (opens > 1 || clicks > 0) {
    //   const task = new Future();
    //   HTTP.call(
    //     "POST",
    //     "https://api.salesflare.com/tasks",
    //     {
    //       headers: {
    //         Authorization: accessTokenString,
    //         "content-type": "application/json; charset=utf-8",
    //       },
    //       data: {
    //         assignees: getSalesFlareUserId(),
    //         reminder_date: new Date(),
    //         description:
    //           "[Zimne maile] - " +
    //           member.name +
    //           " " +
    //           member.surname +
    //           ' (LinkedIn: <a href="' +
    //           member.linkedin +
    //           '" target="_blank">' +
    //           member.linkedin +
    //           "</a> ) otworzył maila " +
    //           opens +
    //           " razy, oraz kliknął: " +
    //           clicks +
    //           " razy. Kontakt nastąpił na mail: " +
    //           member.email +
    //           " w dniu: " +
    //           moment(member.sentAt).format("YYYY-MM-DD HH:MM:SS") +
    //           " a ostatnia akcja użytkownika była w dniu:" +
    //           moment(lastEventOnEmail).format("YYYY-MM-DD HH:MM:SS"),
    //       },
    //     },
    //     (error, result) => {
    //       if (error) {
    //         task.return(false);
    //       }
    //       task.return(result.data.id);
    //     }
    //   );
    //   taskId = task.wait();
    //   if (!taskId) return false;
    //   Members.update(
    //     { email: email, updatedInCRM: false, notAllowed: false },
    //     {
    //       $set: {
    //         updatedInCRM: true,
    //       },
    //     }
    //   );
    //   // if (member.contactedBy.toLowerCase() == "adam") taskNumberAdam++;
    //   // if (member.contactedBy.toLowerCase() == "kamil") taskNumberKamil++;
    // }
  },
  import: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.newContents, Array);
      check(params.categoriesCSV, Array);
      check(params.tagsCSV, Array);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      if (params.newContents.length == 0) {
        throw new Meteor.Error(
          "import-error",
          404,
          TAPi18n.__("crm.import.noRecords")
        );
      }
      const disallowedDomains = DisallowedDomains.find({
        userId: Meteor.userId(),
      })
        .fetch()
        .map(function (element) {
          return element.domain;
        });

      const headColumn = params.newContents[0];

      let membersAdded = 0;
      let membersFromDisallowedDomains = 0;
      let membersExists = 0;
      let membersWithInvalidEmail = 0;

      params.newContents.shift();

      /*
       * Remove first element which contains our head column
       * */
      params.newContents.forEach(function (personData, index, allPeopleData) {
        const member = createMemberObject(personData, headColumn);

        if (!member.email || !validateEmail(member.email)) {
          membersWithInvalidEmail++;
          return false;
        }
        if (_.indexOf(disallowedDomains, member.www) > -1) {
          membersFromDisallowedDomains++;
          return false;
        }
        if (exist(member.email)) {
          membersExists++;
          return false;
        }

        insertMember(member, params.categoriesCSV, params.tagsCSV);
        return membersAdded++;
      });

      return {
        added: membersAdded,
        existed: membersExists,
        withInvalidEmail: membersWithInvalidEmail,
        fromDisallowedDomains: membersFromDisallowedDomains,
      };
    } catch (e) {
      throw new Meteor.Error("check-error", 500, e.details);
    }
  },
  addDisallowedDomain: function (args) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    check(args.domain, String);

    Members.update(
      { userId: Meteor.userId(), email: { $regex: args.domain } },
      {
        $set: {
          notAllowed: true,
        },
      },
      {
        multi: true,
      }
    );

    let blockedMembers = Members.find({
      userId: Meteor.userId(),
      notAllowed: true,
    }).fetch();

    let blockedEmails = blockedMembers.map((item) => {
      return item.email;
    });

    blockedEmails.forEach(function (email) {
      DisallowedEmails.update(
        {
          userId: Meteor.userId(),
          email: email,
        },
        {
          $set: {
            userId: Meteor.userId(),
            email: email,
          },
        },
        {
          upsert: true,
        }
      );
    });

    return DisallowedDomains.insert({
      domain: args.domain,
      userId: Meteor.userId(),
    });
  },
  removeDisallowedDomain: function (args) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    check(args.domainId, String);

    return DisallowedDomains.remove({
      _id: args.domainId,
      userId: Meteor.userId(),
    });
  },
  removeDisallowedEmail: function (args) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    check(args.emailId, String);

    const disallowedEmail = DisallowedEmails.findOne({
      _id: args.emailId,
      userId: Meteor.userId(),
    });

    Members.update(
      { userId: Meteor.userId(), email: disallowedEmail.email },
      {
        $set: {
          notAllowed: false,
        },
      }
    );

    return DisallowedEmails.remove({
      _id: args.emailId,
      userId: Meteor.userId(),
    });
  },
  badEmail: function (args) {
    check(args.email, String);

    const member = Members.findOne({ email: args.email });

    Members.update(
      { email: args.email },
      {
        $set: {
          notAllowed: true,
        },
      },
      {
        multi: true,
      }
    );

    DisallowedEmails.update(
      {
        userId: Meteor.userId(),
        email: args.email,
      },
      {
        $set: {
          userId: Meteor.userId(),
          email: args.email,
        },
      },
      {
        upsert: true,
      }
    );

    if (member) {
      let mess = "";
      mess = mess + "****************\n";
      mess = mess + " \n";
      mess =
        mess +
        " " +
        member.name +
        " " +
        member.surname +
        " o adresie mailowym:" +
        member.email +
        " został usunięty z listy maili do kontaktu i analizy\n";
      mess = mess + " \n";
      mess = mess + "****************\n";
      return mess;
    } else return false;
  },
  stats: function () {
    try {
      const Future = require("fibers/future");
      let statisticsNumber = 0;
      const userId = Meteor.userId();
      if (this.connection != null) {
        if (!userId)
          throw new Meteor.Error(
            "stat-error",
            500,
            TAPi18n.__("server.youAreNotAllowed")
          );
      }

      const accessTokenStringS = `Bearer ${getSendgridApiKey()}`;
      const sendgridMessages = new Future();
      const sendgridStats = new Future();
      let sendgridMessagesResponse;
      let sendgridStatsResponse;

      HTTP.call(
        "GET",
        "https://api.sendgrid.com/v3/messages?limit=10000000",
        {
          headers: {
            Authorization: accessTokenStringS,
            "content-type": "application/json; charset=utf-8",
          },
        },
        (error, result) => {
          if (error) {
            return sendgridMessages.return(403);
          }
          const statistics = JSON.parse(result.content).messages;
          if (!statistics || !statistics.length)
            return sendgridMessages.return(false);
          else return sendgridMessages.return(statistics);
        }
      );
      sendgridMessagesResponse = sendgridMessages.wait();
      if (sendgridMessagesResponse === 403) {
        throw new Meteor.Error(
          "stat-error",
          500,
          TAPi18n.__("dashboard.sendGridError")
        );
      } else if (!sendgridMessagesResponse) {
        sendStatsError(true);
        return false;
      } else {
        sendgridMessagesResponse.forEach(function (stat) {
          const email = stat.to_email;
          const status = stat.status;
          const opens = parseInt(stat.opens_count);
          const clicks = parseInt(stat.clicks_count);
          const lastEventOnEmail = stat.last_event_time;
          const messageTitle = stat.subject;
          const emailId = stat.msg_id.split(".")[0];
          let update = { userId: userId, messageId: { $regex: emailId } };
          if (this.connection === null)
            update = { messageId: { $regex: emailId } };
          Messages.update(update, {
            $set: {
              sendGridStatus: status,
              opens: opens,
              clicks: clicks,
              status: status,
              lastEventOnEmail: new Date(lastEventOnEmail),
            },
          });
          statisticsNumber++;
        });
        sendStatsError(false);
        return statisticsNumber + " statistics was analised";
      }
    } catch (e) {
      throw new Meteor.Error("stat-error", 500, e.details);
      sendStatsError(true);
    }
  },
  settingsGetApiKey: function (serviceName) {
    check(serviceName, String);

    const settings = Settings.findOne({
      userId: Meteor.userId(),
    });

    try {
      switch (serviceName) {
        case "sendgrid":
          return Meteor.settings.private.sendgridApi;
        case "salesflare":
          return settings.APIkey.salesFlare;
        case "salesflareUserId":
          return settings.APIkey.salesFlareUserId;
        case "hubspot":
          return settings.APIkey.hubSpot;
        case "infusionsoft":
          return settings.APIkey.infusionSoft;
      }
    } catch (e) {
      throw new Meteor.Error("get-api-error", 500, e.details);
    }
  },
  addTo: function (id) {
    return OtherMembers.update({ _id: id });
  },
  addCat: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.value, String);
      check(params.memberId, String);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      const exist = Messages.findOne({
        userId: Meteor.userId(),
        _id: params.memberId,
        categories: params.value,
      });
      if (!exist)
        Members.update(
          { userId: Meteor.userId(), _id: params.memberId },
          { $push: { categories: params.value } }
        );
      else
        throw new Meteor.Error(
          "update-error",
          500,
          TAPi18n.__("errors.canNotAddCategories")
        );
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  addTag: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.value, String);
      check(params.memberId, String);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      const exist = Messages.findOne({
        userId: Meteor.userId(),
        _id: params.memberId,
        tags: params.value,
      });
      if (!exist)
        Members.update(
          { userId: Meteor.userId(), _id: params.memberId },
          { $push: { tags: params.value } }
        );
      else
        throw new Meteor.Error(
          "update-error",
          500,
          TAPi18n.__("errors.canNotAddTags")
        );
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  removeCat: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.value, String);
      check(params.memberId, String);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      return Members.update(
        { userId: Meteor.userId(), _id: params.memberId },
        { $pull: { categories: params.value } }
      );
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  removeTag: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.value, String);
      check(params.memberId, String);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      return Members.update(
        { userId: Meteor.userId(), _id: params.memberId },
        { $pull: { tags: params.value } }
      );
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  block: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.block, Boolean);
      check(params.memberId, String);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      return Members.update(
        { userId: Meteor.userId(), _id: params.memberId },
        { $set: { blocked: params.block } }
      );
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  removeMembers: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.members, Array);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      return Members.remove({
        userId: Meteor.userId(),
        _id: { $in: params.members },
      });
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  markAsUsed: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.messages, Array);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      const messages = Messages.find({
        _id: { $in: params.messages },
      }).fetch();
      if (!messages.length) return false;
      Messages.update(
        {
          _id: { $in: params.messages },
        },
        {
          $set: {
            contacted: true,
          },
        },
        { multi: true }
      );
      messages.forEach(function (message) {
        Members.update(
          { userId: Meteor.userId(), _id: message.memberId },
          { $set: { contacted: true } }
        );
      });

      return true;
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  markContactAsUsed: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.memberId, String);
      check(params.contacted, Boolean);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      return Members.update(
        { userId: Meteor.userId(), _id: params.memberId },
        { $set: { contacted: params.contacted } }
      );
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  markContactAsContacted: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.memberId, String);
      check(params.sent, Boolean);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      return Members.update(
        { userId: Meteor.userId(), _id: params.memberId },
        { $set: { sent: params.sent } }
      );
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
  removeCampaigns: function (params) {
    if (!Meteor.userId())
      throw new Meteor.Error(
        "send-error",
        500,
        TAPi18n.__("server.youAreNotAllowed")
      );
    try {
      check(params.campaigns, Array);
    } catch (e) {
      throw new Meteor.Error(
        "check-error",
        500,
        TAPi18n.__("crm.import.errorRecords")
      );
    }
    try {
      return SendInformation.remove({
        userId: Meteor.userId(),
        _id: { $in: params.campaigns },
      });
    } catch (e) {
      throw new Meteor.Error("update-error", 500, e.details);
    }
  },
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validateEmail(email) {
  const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,9})?$/;
  return emailReg.test(email);
}

function createMemberObject(personData, headColumn) {
  let member = {};

  headColumn.forEach(function (nameOfAttribute, index) {
    member[nameOfAttribute] = "";
  });

  Object.keys(member).forEach(function (key, index) {
    member[key] = personData[index];
  });

  return member;
}

function exist(email) {
  const exist = Members.findOne({
    userId: Meteor.userId(),
    email: email,
  });
  return exist ? true : false;
}

function validate(member) {
  if (parseInt(member.confidence) < 60) return false;
  else return true;
}

function stats(email) {
  const delivered = Statistics.findOne({
    email: email,
    event: "delivered",
  });

  const processed = Statistics.findOne({
    email: email,
    event: "processed",
  });

  const bounce = Statistics.findOne({
    email: email,
    event: "bounce",
  });

  const open = Statistics.find({
    email: email,
    event: "open",
  }).count();
  const statistics = {
    delivered: delivered ? true : false,
    processed: processed ? true : false,
    bounce: bounce ? true : false,
    open: open,
  };
  return statistics;
}

function insertMember(member, categoriesCSV, tagsCSV) {
  try {
    Members.insert({
      userId: Meteor.userId(),
      name: member.name,
      surname: member.surname,
      title: member.title,
      company: member.company,
      www: member.www,
      industry: member.industry,
      size: member.size,
      location: member.location,
      linkedin: member.linkedin,
      confidence: member.confidence,
      status: member.status,
      email: member.email,
      sent: false,
      categories: categoriesCSV.length ? categoriesCSV : null,
      tags: tagsCSV.length ? tagsCSV : null,
    });
  } catch (e) {
    throw new Meteor.Error("members-error", 500, e.details);
  }
}

function getSendgridApiKey() {
  return Meteor.call("settingsGetApiKey", "sendgrid");
}

function getSalesFlareApiKey() {
  return Meteor.call("settingsGetApiKey", "salesflare");
}

function getSalesFlareUserId() {
  return Meteor.call("settingsGetApiKey", "salesflareUserId");
}

function getHubspotApiKey() {
  return Meteor.call("settingsGetApiKey", "hubspot");
}

function getInfusionSoftApiKey() {
  return Meteor.call("settingsGetApiKey", "infusionsoft");
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function sendStatsError(status) {
  const userId = Meteor.userId();
  if (!userId)
    throw new Meteor.Error(
      "send-error",
      500,
      TAPi18n.__("server.youAreNotAllowed")
    );
  Settings.update(
    {
      userId: userId,
    },
    {
      $set: {
        sendStatsError: status,
      },
    }
  );
}
