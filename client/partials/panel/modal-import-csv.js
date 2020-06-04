import {
  SessionDataCsvFilename,
  SessionDataCsvStatusParsed,
  SessionDataCsvStatusUploaded,
  SessionDataCsvContents,
  SessionDataCsvColumns,
  SessionDataCsvColumnsMapped,
  SessionDataCsvUploadReport,
} from "/client/helpers/sessions";

import Papa from "papaparse";

import {
  showDangerNotification,
  showModal,
  showSuccessNotification,
} from "/client/helpers/helpers";

import { callServerMethod } from "/client//helpers/server-method";

Template.modalImportCsv.onRendered(function () {
  SessionDataCsvFilename.set(false);
  SessionDataCsvStatusUploaded.set(false);
  SessionDataCsvStatusParsed.set(false);
  SessionDataCsvColumnsMapped.set([]);
  SessionDataCsvUploadReport.set({});
});

import "/imports/tags.js";

Template.modalImportCsv.helpers({
  csvFilename: function () {
    return SessionDataCsvFilename.get()
      ? SessionDataCsvFilename.get()
      : TAPi18n.__("crm.import.choose");
  },
  csvUploaded: function () {
    return SessionDataCsvStatusUploaded.get();
  },
  csvParsed: function () {
    return SessionDataCsvStatusParsed.get();
  },
  csvColumns: function () {
    return SessionDataCsvColumns.get();
  },
  csvAvailableColumnsToMap: function () {
    return [
      "name",
      "surname",
      "title",
      "company",
      "www",
      "industry",
      "size",
      "location",
      "linkedin",
      "email",
      "confidence",
      "status",
    ];
  },
  csvFirstRows: function () {
    const contents = SessionDataCsvContents.get();

    if (contents.length > 0) return contents.slice(0, 3);
    else return false;
  },
  csvColumnsMapped: function () {
    return SessionDataCsvColumnsMapped.get();
  },
});

Template.modalImportCsv.events({
  "change input[type=file]": function (event) {
    const fileInput = $(event.target)[0];
    const file = fileInput.files[0];
    const filename = fileInput ? fileInput.files[0].name : null;

    if (!file) {
      showDangerNotification("Najpierw wgraj plik!");
      return false;
    }

    if (filename && file) {
      SessionDataCsvFilename.set(filename);
      SessionDataCsvStatusUploaded.set(true);
    }
  },
  "click #uploadCsvAndParse": function () {
    Papa.parse(document.querySelector("#csvFile").files[0], {
      complete(results) {
        /*
         * Show columns to map container
         * */
        SessionDataCsvStatusParsed.set(true);

        /*
         * Save contents of CSV to Session
         * */
        SessionDataCsvContents.set(results.data);

        /*
         * Count number of columns in CSV - read it from first row
         *
         * We assuming that user uploaded valid CSV
         *
         * @todo Validation of CSV file
         * */
        const csvColumns = results.data[0];

        SessionDataCsvColumns.set(
          csvColumns.map(function (column, index) {
            return {
              index: index,
              value: column,
            };
          })
        );
        return false;
      },
      error: function () {
        showDangerNotification("Plik CSV jest niepoprawny");
      },
    });
  },

  "click #mapCsvAndPushToServer": function (event) {
    event.preventDefault();

    const mappedColumnHeadSelects = document.querySelectorAll(
      '[name="csv-columns[]"]'
    );

    /*
     * Validation
     * */
    let mappingError = false;
    let headColumn = [];
    let contents = [];

    mappedColumnHeadSelects.forEach(function (select) {
      const selectValue = select.options[select.selectedIndex].value;
      if (selectValue) headColumn.push(selectValue);
      else headColumn.push(0);
    });

    if (headColumn.indexOf("email") < 0) {
      showDangerNotification(TAPi18n.__("crm.import.emailError"));
      mappingError = true;
    }

    if (mappingError === true) return false;

    /*
     * Remove first row
     * */
    contents = SessionDataCsvContents.get();

    if ($("#csv-has-header").prop("checked") === true) {
      contents.shift();
    }
    const newHeadColumn = headColumn.filter(function (value) {
      return value !== 0;
    });

    let newContents = [];

    const idx = getAllIndexes(headColumn, 0);

    contents.forEach(function (row) {
      let newContentsRow = [];
      idx.forEach(function (i) {
        newContentsRow.push(row[i]);
      });
      newContents.push(newContentsRow);
    });
    newContents.unshift(newHeadColumn);
    const categoriesCSV = $("#categoriesCSV").val()
      ? $("#categoriesCSV").val().split(",")
      : [];
    const tagsCSV = $("#tagsCSV").val() ? $("#tagsCSV").val().split(",") : [];

    callServerMethod({
      methodName: "import",
      params: {
        newContents: newContents,
        categoriesCSV: categoriesCSV,
        tagsCSV: tagsCSV,
      },
      resultCallback: function (result) {
        SessionDataCsvUploadReport.set(result);
        SessionDataCsvContents.set([]);
        SessionDataCsvFilename.set(false);
        SessionDataCsvStatusUploaded.set(false);
        SessionDataCsvStatusParsed.set(false);
        showSuccessNotification(TAPi18n.__("crm.import.success"));
        setTimeout(function () {
          showModal("#modalImportCsvReport");
        }, 500);
      },
    });
  },
});

Template.modalImportCsv.onDestroyed(function () {});

Template.modalImportCsvReport.onRendered(function () {
  this.autorun(function () {
    if (SessionDataCsvStatusParsed.get()) {
      Meteor.setTimeout(function () {
        $(".tagsinput").tagsInput({
          height: "40px",
          width: "100%",
          autoFill: true,
          defaultText: TAPi18n.__("crm.import.addTag"),
        });
        $(".catinput").tagsInput({
          height: "40px",
          width: "100%",
          autoFill: true,
          defaultText: TAPi18n.__("crm.import.addCategorie"),
        });
      }, 1000);
    }
  });
});

Template.modalImportCsvReport.helpers({
  report: function () {
    return SessionDataCsvUploadReport.get();
  },
});

Template.modalImportCsvReport.events({});

Template.modalImportCsvReport.onDestroyed(function () {
  SessionDataCsvUploadReport.set({});
});

function getAllIndexes(arr, val) {
  var indexes = [],
    i;
  for (i = 0; i < arr.length; i++) if (arr[i] !== val) indexes.push(i);
  return indexes;
}
