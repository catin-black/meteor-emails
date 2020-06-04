export function tooltips(template) {
  $(".dataTables_wrapper")
    .find("table")
    .on("length.dt", function () {
      ckTool(template);
    })
    .on("order.dt", function () {
      ckTool(template);
    })
    .on("search.dt", function () {
      ckTool(template);
    })
    .on("page.dt", function () {
      ckTool(template);
    });
}

function ckTool(template) {
  template.$(".text-truncate span").tooltip({
    placement: "left",
  });
  template.$(".mail span").tooltip({
    placement: "top",
  });
  $(".dataTables_wrapper").find("table th:last-child").addClass("text-right");
  $(".dataTables_wrapper")
    .find("table tr td button.preview")
    .addClass("pull-right");
}
