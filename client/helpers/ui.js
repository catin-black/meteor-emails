UI.registerHelper("isActiveRoute", function (params) {
  return Router.current().route.getName() === params ? "active" : "";
});
