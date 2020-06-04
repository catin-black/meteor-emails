import { SessionDataIsLoading } from "/client/helpers/sessions";

export class Loader {
  constructor() {}

  show() {
    $("body").append('<div id="preloader"><div></div></div>');
    SessionDataIsLoading.set(true);
  }

  hide() {
    $("#preloader").remove();
    SessionDataIsLoading.set(false);
  }
}
