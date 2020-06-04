import { Session } from "meteor/session";

class SessionObject {
  constructor(key) {
    check(key, String);

    this.key = key;
  }

  get() {
    return Session.get(this.key);
  }

  set(value) {
    Session.set(this.key, value);
  }

  nullify() {
    Session.set(this.key, null);
  }
}

export const SessionDataIsLoading = new SessionObject("data.status.loading");
export const SessionDataCsvColumns = new SessionObject("data.csv.columns");
export const SessionDataCsvColumnsMapped = new SessionObject(
  "data.csv.columns.mapped"
);
export const SessionDataCsvContents = new SessionObject("data.csv.contents");
export const SessionDataCsvFilename = new SessionObject("data.csv.filename");
export const SessionDataCsvStatusUploaded = new SessionObject(
  "data.csv.status.uploaded"
);
export const SessionDataCsvStatusParsed = new SessionObject(
  "data.csv.status.parsed"
);
export const SessionDataCsvUploadReport = new SessionObject(
  "data.csv.upload.report"
);
export const SessionSelectedMembers = new SessionObject("members.selected");
export const SessionSelectedCampaigns = new SessionObject("campaigns.selected");
export const SessionAuthorizationPasswordToken = new SessionObject(
  "authorization.password.token"
);
