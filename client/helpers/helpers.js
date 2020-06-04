import notify from "bootstrap-notify";
import Swal from "sweetalert2";

export function closeModal() {
  const modal = $(".modal.show");

  if (modal.length > 0) {
    modal.modal("hide");
  }
}

export function showModal(id) {
  $(id).modal("show");
}

export function showDangerAlert(title, text) {
  showAlert({
    type: "error",
    title: title,
    text: text,
  });
}

export function showConfirmDialog(args) {
  return Swal.fire({
    title: args.title ? args.title : "",
    text: args.text ? args.text : "",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    reverseButtons: true,
    confirmButtonText: args.confirmButtonText ? args.confirmButtonText : "Yes",
  }).then((result) => {
    if (result.value) {
      if (args.confirmCallback) args.confirmCallback();
    } else {
      if (args.cancelCallback) args.cancelCallback();
    }
  });
}

export function showSuccessAlert(title, text) {
  showAlert({
    type: "success",
    title: title,
    text: text,
  });
}
export function showWarningAlert(title, text) {
  showAlert({
    type: "warning",
    title: title,
    text: text,
  });
}
export function showInfoAlert(title, text) {
  showAlert({
    type: "info",
    title: title,
    text: text,
  });
}
export function showQuestionAlert(title, text) {
  showAlert({
    type: "question",
    title: title,
    text: text,
  });
}

export function showBasicAlert(args) {
  return Swal.fire(args);
}

function showAlert(args) {
  return Swal.fire({
    icon: args.type,
    title: args.title,
    text: args.text,
  });
}

export function showSuccessNotification(text) {
  check(text, String);

  showNotification({
    text: text,
    type: "success",
  });
}

export function showInfoNotification(text) {
  check(text, String);

  showNotification({
    text: text,
    type: "info",
  });
}

export function showWarningNotification(text) {
  check(text, String);

  showNotification({
    text: text,
    type: "warning",
  });
}

export function showDangerNotification(text) {
  check(text, String);

  showNotification({
    text: text,
    type: "danger",
  });
}

export function clearPreviousNotifications() {
  $("[data-notify]").empty();
}

function showNotification(args) {
  check(args.text, String);
  check(args.type, String);

  $.notify(
    {
      icon: "now-ui-icons ui-1_bell-53",
      message: args.text,
    },
    {
      type: args.type,
      timer: 4000,
      placement: {
        from: "top",
        align: "right",
      },
    }
  );
}
