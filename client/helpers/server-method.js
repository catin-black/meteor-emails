import { Loader } from "/client/helpers/loader";
import {
  errorDebugLog,
  startedDebugLog,
  successDebugLog,
} from "/client/helpers/debug-log";
import {
  showSuccessNotification,
  showDangerNotification,
} from "/client/helpers/helpers";

export function callServerMethod(args) {
  startedDebugLog("=======================");
  startedDebugLog(`Method::start():\t ${args.methodName}`);

  const startTime = new Date();
  const loader = new Loader();
  let submitButton = {};

  loader.show();

  if (args.form) {
    submitButton = args.form.querySelector("[type=submit]");

    submitButton.setAttribute("disabled", "disabled");
    submitButton.classList.add("disabled");
  }

  Meteor.call(args.methodName, args.params, function (error, result) {
    if (error) {
      console.log(error);
      errorDebugLog(`Method::error():\t ${args.methodName} - ${error.reason}`);
      if (args.errorCallback) {
        args.errorCallback(error);
      } else {
        showDangerNotification(error.details);
        loader.hide();
        console.log(error);
      }
    } else {
      if (args.resultCallback) {
        args.resultCallback(result);
      } else {
        showSuccessNotification(TAPi18n.__("alerts.done"));
      }
    }

    if (args.always) args.always();
    successDebugLog(
      `Method::stop():\t ${args.methodName} :\t lasts for ${Math.abs(
        new Date().getTime() - startTime.getTime()
      )}ms`
    );

    if (args.form) {
      submitButton.removeAttribute("disabled");
      submitButton.classList.remove("disabled");
    }
    loader.hide();
  });
}
