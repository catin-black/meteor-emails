function displayConfirmation(title, text, callback) {
  /**
   * By specifying an object for buttons,
   * you can set exactly as many buttons as you like,
   * and specify the value that they resolve to when they're clicked!
   * @type {Object}
   */
  const buttons = {
    cancel: "Cancel",
    ok: {
      text: "Ok",
      value: "ok",
    },
  };
  swal({
    title: title,
    icon: "info",
    text: text,
    html: true,
    buttons: buttons,
  }).then(function (value) {
    switch (value) {
      case "ok":
        $("body").append(
          '<div id="preloader2"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Please wait. I am doing my job./span></div>'
        );
        callback();
        break;
      default:
        break;
    }
  });
}

export { displayConfirmation };
