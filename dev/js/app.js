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
    $('.group').show();
    $('.guest').hide();
    if (returnedGuests[0] === undefined) {
      $('.group').hide();
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

  //New Password Validation
  const checkPasswords = () => {
    let pass1 = $('#new-password').val();
    let pass2 = $('#new-password-check').val();
    if ( pass1 == pass2 ) {
      $('#new-password-check').removeClass('alert-danger');
      $('#new-password').addClass('alert-success');
      $('#new-password-check').addClass('alert-success');
      $('#newPassword button').css('cursor', 'pointer');
      $('#newPassword button').prop('disabled', false);
    } else {
      $('#new-password-check').addClass('alert-danger');
      $('#newPassword button').css('cursor', 'not-allowed');
      $('#newPassword button').prop('disabled', true);
    }
  };

  $('#newPassword input').keyup(() => {
    checkPasswords();
  });

});
