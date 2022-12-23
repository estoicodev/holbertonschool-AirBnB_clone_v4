$(function () {
  const amenitiesIds = [];
  $(".popover input").change(function (e) {
    const { target } = e;
    const id = target.getAttribute("data-id");
    const isChecked = $(`.popover input[data-id="${id}"]`).is(":checked");

    if (isChecked) {
      amenitiesIds.push(id);
    } else {
      const index = amenitiesIds.indexOf(id);
      if (index > -1) amenitiesIds.splice(index, 1);
    }

    const entertainment = [];
    for (let i = 0; i < amenitiesIds.length; i++) {
      const name = $(`.popover input[data-id="${amenitiesIds[i]}"]`).attr(
        "data-name"
      );
      entertainment.push(name);
    }

    if (entertainment.length > 0) {
      const newText = entertainment.join(", ");
      newText.length > 32
        ? $(".amenities h4").text(`${newText.slice(0, 32)}...`)
        : $(".amenities h4").text(newText);
    } else {
      $(".amenities h4").html("&nbsp;");
    }
  });

  $.get("http://localhost:5001/api/v1/status/", function (data) {
    const e = $("header div:nth-child(2)");
    if (data.status === "OK") {
      e.addClass("available");
    } else {
      e.removeClass("available");
    }
  });
});
