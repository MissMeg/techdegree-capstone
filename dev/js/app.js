'use strict';

$(document).ready(() => {
  /////////Guest Page

  //total # of guests
  let numberGuests = $('.guest').length;
  $('#total-guests').text(numberGuests);

  //total confirmed/unconfirmed
  let unconfirmedGuests = 0;
  let confirmedGuests = 0;
  $('.confirmed p').each((i, ele) => {
    let text = $(ele).text();
    if ( text === 'true' ) {
      confirmedGuests += 1;
    } else if ( text === 'false' ) {
      unconfirmedGuests += 1;
    }
  });

  $('#confirmed-Guests').text(confirmedGuests);
  $('#unconfirmed-Guests').text(unconfirmedGuests);

  //total # of Kids
  let kids = 0;
  $('.child p').each((i, ele) => {
    let text = $(ele).text();
    if ( text === 'true' ) {
      kids += 1;
    }
  });

  $('#kids-guests').text(kids);


  //Searching Guests
  const findGuest = () => {
    $('#none').hide();
    let search = $('#search input').val();
    let returnedGuests = $(`.guest:contains('${search}')`);
    $('#search input').val('');
    $('.guest').hide();
    if (returnedGuests[0] === undefined) {
      $('#guests-data').append('<div id="none" class="row justify-content-center"> No guest found.</div>');
    } else {
      returnedGuests.show();
    }
  };

  $('#search button').click(() => {
    findGuest();
  });

  $('#search input').bind('keypress', (event) => {
    if (event.keyCode === 13) {
      findGuest();
    }
  });

});
