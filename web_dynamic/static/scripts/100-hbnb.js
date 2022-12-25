function InsertPlacesInSectionPlaces (placesList) {
  const sectionPlaces = $('section.places');
  for (let i = 0; i < placesList.length; i++) {
    const article = $('<article></article>');
    const divTitleBox = $('<div class="title_box"></div>');
    const divInformation = $('<div class="information"></div>');
    const divUser = $('<div class="user"></div>');
    const divDescription = $('<div class="description"></div>');

    divTitleBox.append($(`<h2>${placesList[i].name}</h2>`));
    divTitleBox.append(
      $(`<div class="price_by_night">$${placesList[i].price_by_night}</div>`)
    );

    const divInfoMaxGuest = $('<div class="max_guest"></div>');
    const divInfoNumberRooms = $('<div class="number_rooms"></div>');
    const divInfoNumberBathrooms = $('<div class="number_bathrooms"></div>');
    let textMaxGuest = placesList[i].max_guest + ' Guest';
    if (placesList[i].max_guest !== 1) {
      textMaxGuest = textMaxGuest.concat('s');
    }
    let textNumberRooms = placesList[i].number_rooms + ' Bedroom';
    if (placesList[i].max_guest !== 1) {
      textNumberRooms = textNumberRooms.concat('s');
    }
    let textNumberBathrooms = placesList[i].number_bathrooms + ' Bathroom';
    if (placesList[i].max_guest !== 1) {
      textNumberBathrooms = textNumberBathrooms.concat('s');
    }
    divInfoMaxGuest.text(textMaxGuest);
    divInfoNumberRooms.text(textNumberRooms);
    divInfoNumberBathrooms.text(textNumberBathrooms);
    divInformation.append(divInfoMaxGuest);
    divInformation.append(divInfoNumberRooms);
    divInformation.append(divInfoNumberBathrooms);

    // divUser.html(`<b>Owner:</b> None`);

    let placeDescription = 'None';
    if (placesList[i].description) {
      placeDescription = placesList[i].description;
    }

    divDescription.text(`${placeDescription}`);

    article.append(divTitleBox);
    article.append(divInformation);
    article.append(divUser);
    article.append(divDescription);
    sectionPlaces.append(article);
  }
}

$(function () {
  const amenitiesIds = [];
  const statesIds = [];
  const citiesIds = [];
  $('.amenities .popover input').change(function (e) {
    const { target } = e;
    const id = target.getAttribute('data-id');
    const isChecked = $(`.popover input[data-id="${id}"]`).is(':checked');

    if (isChecked) {
      amenitiesIds.push(id);
    } else {
      const index = amenitiesIds.indexOf(id);
      if (index > -1) amenitiesIds.splice(index, 1);
    }

    const entertainment = [];
    for (let i = 0; i < amenitiesIds.length; i++) {
      const name = $(`.popover input[data-id="${amenitiesIds[i]}"]`).attr(
        'data-name'
      );
      entertainment.push(name);
    }

    if (entertainment.length > 0) {
      const newText = entertainment.join(', ');
      newText.length > 32
        ? $('.amenities h4').text(`${newText.slice(0, 32)}...`)
        : $('.amenities h4').text(newText);
    } else {
      $('.amenities h4').html('&nbsp;');
    }
  });

  $('.locations .popover input').change(function (e) {
    const { target } = e;
    const id = target.getAttribute('data-id');
    const isChecked = $(`.popover input[data-id="${id}"]`).is(':checked');

    const nextElement = $(target).next()[0];
    if (isChecked) {
      if (nextElement) {
        statesIds.push(id);
      } else {
        citiesIds.push(id);
      }
    } else {
      if (nextElement) {
        const index = statesIds.indexOf(id);
        if (index > -1) statesIds.splice(index, 1);
      } else {
        const index = citiesIds.indexOf(id);
        if (index > -1) citiesIds.splice(index, 1);
      }
    }

    const statesAndCities = [];
    const statesAndCitiesIds = statesIds.concat(citiesIds);
    for (let i = 0; i < statesAndCitiesIds.length; i++) {
      const name = $(`.popover input[data-id="${statesAndCitiesIds[i]}"]`).attr(
        'data-name'
      );
      statesAndCities.push(name);
    }

    if (statesAndCities.length > 0) {
      const newText = statesAndCities.join(', ');
      newText.length > 28
        ? $('.locations h4').text(`${newText.slice(0, 28)}...`)
        : $('.locations h4').text(newText);
    } else {
      $('.locations h4').html('&nbsp;');
    }
  });

  $.get('http://localhost:5001/api/v1/status/', function (data) {
    const e = $('header div:nth-child(2)');
    if (data.status === 'OK') {
      e.addClass('available');
    } else {
      e.removeClass('available');
    }
  });

  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    data: '{}',
    success: function (allPlaces) {
      InsertPlacesInSectionPlaces(allPlaces);
    }
  });

  $('section.filters button').click(function () {
    const data = {
      amenities: amenitiesIds,
      states: statesIds,
      cities: citiesIds
    };
    const dataJSON = JSON.stringify(data);
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: dataJSON,
      success: function (placesFiltered) {
        $('section.places').empty();
        InsertPlacesInSectionPlaces(placesFiltered);
      }
    });
  });
});
