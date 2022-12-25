function showPlaces (amnts={}) {
  $.ajax({
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify(amnts),
    dataType: 'json',
    contentType: 'application/json'
  }).done(function (data) {
    data.forEach(place => {
$('section.places').append(
        '<article>' +
          '<div class="headline">' +
          '<h2>' + place.name + '</h2>' +
          '<div class="price_by_night"> $ ' + place.price_by_night + '</div>' +
          '</div>' +
          '<div class="information">' +
          '<div class="max_guest">' +
          '<div class="guest_icon"></div>' +
          '<p>' + place.max_guest + ' Guest</p>' +
          '</div>' +
          '<div class="number_rooms">' +
          '<div class="bed_icon"></div>' +
          '<p>' + place.number_rooms + ' Room</p>' +
          '</div>' +
          '<div class="number_bathrooms">' +
          '<div class="bath_icon"></div>' +
          '<p>' + place.number_bathrooms + ' Bathroom</p>' +
          '</div>' +
          '</div>' +
          '<div class="user"><b>Owner</b>: John Lennon</div>' +
          '<div class="description">' + place.description + '</div>' +
    '<div class="reviews">' +
    '<h2>Reviews</h2><span class="handle-reviews" data-name="' + place.id + '">show</span>' + 
          '<ul id="' + place.id + '">' +
    '</ul>' +
    '</div>' +
          '</article>'
);
    });
  });
};
$(document).on('click', '.handle-reviews', function () {
//    debugger
  console.log(this)
  if ($(this).hasClass('used')) {
    $(`#${$(this).data('name')} > li`).remove();
    $(`#${$(this).data('name')} > br`).remove();
    $(this).removeClass("used");
  } else {
    $.get(`http://127.0.0.1:5001/api/v1/places/${$(this).data('name')}/reviews`, function (data, status) {
if (status == 'success')
  data.forEach(review => {
    $(`#${review.place_id}`).append(
      `<li class="remove-li">${review.text}</li><br>`)
  });
    });
    $(this).addClass('used');
  }
});

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