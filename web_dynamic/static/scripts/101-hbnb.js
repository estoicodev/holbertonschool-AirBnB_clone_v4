$(document).ready(function () {
  const amenities = {};
  const states = {};
  const cities = {};
  const locations = {};
  // debugger
  $('.amenities input[type="checkbox"]').change(function () {
    if (this.checked) {
      amenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenities[$(this).data('id')];
    }
    if (Object.keys(amenities).length > 0) {
      const newText = Object.keys(amenities)
        .map(function (k) {
          return amenities[k];
        })
        .join(', ');
      newText.length > 32
        ? $('.amenities h4').text(`${newText.slice(0, 32)}...`)
        : $('.amenities h4').text(newText);
    } else {
      $('.amenities h4').html('&nbsp;');
    }
  });

  $('.locations .state_filter input[type="checkbox"]').change(function () {
    if (this.checked) {
      states[$(this).data('id')] = $(this).data('name');
      locations[$(this).data('id')] = $(this).data('name');
    } else {
      delete states[$(this).data('id')];
      delete locations[$(this).data('id')];
    }
    if (Object.keys(locations).length > 0) {
      const newText = Object.keys(locations)
        .map(function (k) {
          return locations[k];
        })
        .join(', ');
      newText.length > 28
        ? $('.locations h4').text(`${newText.slice(0, 28)}...`)
        : $('.locations h4').text(newText);
    } else {
      $('.locations h4').html('&nbsp;');
    }
  });

  $('.locations ul li ul li input[type="checkbox"]').change(function () {
    if (this.checked) {
      cities[$(this).data('id')] = $(this).data('name');
      locations[$(this).data('id')] = $(this).data('name');
    } else {
      delete cities[$(this).data('id')];
      delete locations[$(this).data('id')];
    }
    if (Object.keys(locations).length > 0) {
      const newText = Object.keys(locations)
        .map(function (k) {
          return locations[k];
        })
        .join(', ');
      newText.length > 28
        ? $('.locations h4').text(`${newText.slice(0, 28)}...`)
        : $('.locations h4').text(newText);
    } else {
      $('.locations h4').html('&nbsp;');
    }
  });

  $.get('http://127.0.0.1:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
      showPlaces();
    } else {
      $('#api_status').removeClass('available');
    }
  });

  function showPlaces (amnts = {}) {
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify(amnts),
      dataType: 'json',
      contentType: 'application/json'
    }).done(function (data) {
      data.forEach(place => {
        let placeDescription = place.description;
        if (!placeDescription) {
          placeDescription = 'None';
        }
        $('section.places').append(
          '<article>' +
            '<div class="title_box">' +
            '<h2>' +
            place.name +
            '</h2>' +
            '<div class="price_by_night"> $' +
            place.price_by_night +
            '</div>' +
            '</div>' +
            '<div class="information">' +
            '<div class="max_guest">' +
            place.max_guest +
            ' Guest</div>' +
            '<div class="number_rooms">' +
            place.number_rooms +
            ' Bedroom</div>' +
            '<div class="number_bathrooms">' +
            place.number_bathrooms +
            ' Bathroom</div>' +
            '</div>' +
            '<div class="user"><b>Owner</b>: John Lennon</div>' +
            '<div class="description">' +
            placeDescription +
            '</div>' +
            '<div class="reviews">' +
            '<div class="reviews_title">' +
            '<h2>Reviews</h2><span class="handle-reviews" data-name="' +
            place.id +
            '">show</span></div>' +
            '<ul id="' +
            place.id +
            '">' +
            '</ul>' +
            '</div>' +
            '</article>'
        );
      });
    });
  }

  $(document).on('click', '.handle-reviews', function () {
    //    debugger
    if ($(this).hasClass('used')) {
      $(`#${$(this).data('name')} > li`).remove();
      $(`#${$(this).data('name')} > br`).remove();
      $(this).removeClass('used');
      $(this).text('show');
      $(this).parent().next().text('');
    } else {
      const span = this;
      $.get(
        `http://127.0.0.1:5001/api/v1/places/${$(this).data('name')}/reviews`,
        function (data, status) {
          if (status == 'success') {
            if (data.length > 0) {
              data.forEach(review => {
                $(`#${review.place_id}`).append(
                  `<li class="remove-li">${review.text}</li><br>`
                );
              });
            } else {
              const ulElement = $(span).parent().next();
              $(ulElement).text('None');
            }
          }
        }
      );
      $(this).addClass('used');
      $(this).text('hide');
    }
  });

  $('section.filters button').click(function () {
    //    debugger
    const amnts = Object.keys(amenities);
    const sts = Object.keys(states);
    const cts = Object.keys(cities);
    $('.places > article').remove();
    showPlaces({ amenities: amnts, states: sts, cities: cts });
  });
});
