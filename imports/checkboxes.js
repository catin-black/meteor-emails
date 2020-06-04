function checkTable(event) {
  const checkbox = $(event.target);
  const table = checkbox.parents("table").first();
  const checkboxes = table.find("tbody tr td input[type=checkbox]");
  checkboxes.prop("checked", checkbox.is(":checked"));
}

export { checkTable };
