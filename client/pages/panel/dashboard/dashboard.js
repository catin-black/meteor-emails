import { callServerMethod } from "/client/helpers/server-method";
import {
  showSuccessNotification,
  showWarningAlert,
} from "/client/helpers/helpers";
import Chart from "chart.js";

Template.pagePanelDashboard.helpers({
  allMails: function () {
    const instance = Template.instance();
    return Messages.find({
      sentAt: { $gte: instance.startOfMonth, $lte: instance.endOfMonth },
    }).count();
  },
  opened: function () {
    const instance = Template.instance();
    return Messages.find({
      opens: { $gt: 0 },
      sentAt: { $gte: instance.startOfMonth, $lte: instance.endOfMonth },
    }).count();
  },
  promising: function () {
    const instance = Template.instance();
    return Messages.find({
      sentAt: { $gte: instance.startOfMonth, $lte: instance.endOfMonth },
      $or: [{ opens: { $gt: 1 } }, { clicks: { $gt: 0 } }],
    }).count();
  },
  sendGridError: function () {
    const settings = Settings.findOne();
    return settings && settings.sendStatsError ? true : false;
  },
});

Template.pagePanelDashboard.events({
  "click #stats, click #stats2": function (event, template) {
    event.preventDefault();
    callServerMethod({
      methodName: "stats",
      resultCallback: function () {
        showSuccessNotification(TAPi18n.__("alerts.done"));
      },
    });
  },
  "click #showStatsError": function (event, template) {
    event.preventDefault();
    return showWarningAlert(
      TAPi18n.__("dashboard.sendGridErrorTitle"),
      TAPi18n.__("dashboard.sendGridError")
    );
  },
});

Template.pagePanelDashboard.onCreated(function () {
  this.startOfMonth = moment().startOf("month").toDate();
  this.endOfMonth = moment().endOf("month").toDate();
});

Template.pagePanelDashboard.onRendered(function () {
  const ctx = document.getElementById("chartEmail").getContext("2d");
  const processed = Messages.find({ status: "processed" }).count();
  const delivered = Messages.find({ status: "delivered" }).count();
  const not_delivered = Messages.find({ status: "not_delivered" }).count();
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        TAPi18n.__("stats.processed"),
        TAPi18n.__("stats.delivered"),
        TAPi18n.__("stats.not_delivered"),
      ],
      datasets: [
        {
          label: TAPi18n.__("stats.emails"),
          data: [processed, delivered, not_delivered],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              precision: 0,
            },
          },
        ],
      },
    },
  });
});

Template.pagePanelDashboard.onDestroyed(function () {});
