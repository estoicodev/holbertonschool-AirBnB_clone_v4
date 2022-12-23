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

  $.ajax({
    url: "http://localhost:5001/api/v1/places_search/",
    type: "POST",
    contentType: "application/json",
    data: "{}",
    success: function (res) {
      const sectionPlaces = $("section.places");
      for (let i = 0; i < res.length; i++) {
        const article = $("<article></article>");
        const divTitleBox = $('<div class="title_box"></div>');
        const divInformation = $('<div class="information"></div>');
        const divUser = $('<div class="user"></div>');
        const divDescription = $('<div class="description"></div>');

        divTitleBox.append($(`<h2>${res[i].name}</h2>`));
        divTitleBox.append(
          $(`<div class="price_by_night">$${res[i].price_by_night}</div>`)
        );

        const divInfoMaxGuest = $('<div class="max_guest"></div>');
        const divInfoNumberRooms = $('<div class="number_rooms"></div>');
        const divInfoNumberBathrooms = $(
          '<div class="number_bathrooms"></div>'
        );
        let textMaxGuest = res[i].max_guest + " Guest";
        if (res[i].max_guest !== 1) {
          textMaxGuest = textMaxGuest.concat("s");
        }
        let textNumberRooms = res[i].number_rooms + " Bedroom";
        if (res[i].max_guest !== 1) {
          textNumberRooms = textNumberRooms.concat("s");
        }
        let textNumberBathrooms = res[i].number_bathrooms + " Bathroom";
        if (res[i].max_guest !== 1) {
          textNumberBathrooms = textNumberBathrooms.concat("s");
        }
        divInfoMaxGuest.text(textMaxGuest);
        divInfoNumberRooms.text(textNumberRooms);
        divInfoNumberBathrooms.text(textNumberBathrooms);
        divInformation.append(divInfoMaxGuest);
        divInformation.append(divInfoNumberRooms);
        divInformation.append(divInfoNumberBathrooms);

        // divUser.html(`<b>Owner:</b> None`);

        let placeDescription = "None";
        if (res[i].description) {
          placeDescription = res[i].description;
        }

        divDescription.text(`${placeDescription}`);

        article.append(divTitleBox);
        article.append(divInformation);
        article.append(divUser);
        article.append(divDescription);
        sectionPlaces.append(article);
      }
    },
  });
});
