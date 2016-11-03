'use strict';

const timestamps = _.map($('.timestamp'), function (element) {
  return element.innerHTML;
});

function humanizeTimestamps() {
  for (var i = 0; i < $('.timestamp').length; i++) {
    $('.timestamp')[i].innerHTML = moment(timestamps[i]).fromNow();
  }
}

function signup() {
  const username = $('label.username').children().val()
  const password = $('label.password').children().val()
  const passwordDuplicate = $('label.password-duplicate').children().val()

  if (password === passwordDuplicate) {
    $.ajax({
      method: 'POST',
      url: '/users/',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      contentType: 'application/json'
    })
    .success(function (data, textStatus, xhr) {
      window.location.replace(xhr.getResponseHeader('location'))
    })
  } else {
    //  Set focus to the password field
    $('label.password').children().focus()
  }
}

function dispatchCreate(entity) {
  if (entity === 'post_image') {
    const link = $('label.link').children().val()
    const post_id = parseInt($('label.post_id').children().val())

    $.ajax({
      method: 'POST',
      url: '/post_images/',
      body: JSON.stringify({
        link: link,
        post_id: post_id
      }),
      contentType: 'application/json'
    })
    .success(function (data, textStatus, xhr) {
      // window.location = xhr.getResponseHeader('location')
    })
  }

  return false;
}

function dispatchDelete(entity, identifier) {
  if (entity === 'user') {
    $.ajax({
      method: 'DELETE',
      url: '/users/' + identifier
    })
    .success(function (data, textStatus, xhr) {
      alert('Operation completed.')
      window.location.replace('/users')
    })
  } else if (entity === 'post_image') {
    $.ajax({
      method: 'DELETE',
      url: '/post_images/' + identifier
    })
    .success(function (data, textStatus, xhr) {
      alert('Operation completed.')
      window.location.replace('/post_images')
    })
  }
}

function dispatchUpdate(entity, identifier) {
  if (entity === 'user') {
    const username = $('label.username').children().val()
    const password = $('label.password').children().val()
    const passwordDuplicate = $('label.password-duplicate').children().val()

    if (password === passwordDuplicate) {
      $.ajax({
        method: 'PUT',
        url: window.location.pathname.split('/').splice(0, 3).join('/'),
        data: JSON.stringify({
          username: username,
          password: password
        }),
        contentType: 'application/json'
      })
      .success(function (data, textStatus, xhr) {
        window.location.replace(xhr.getResponseHeader('location'))
      })
      .fail(function (data, textStatus, xhr) {
        alert('Username and password, both needs to be typed and be 7 to 20 characters long.')
      })
    } else {
      //  Set focus to the password field
      $('label.password').children().focus()
    }
  } else if (entity === 'post_image') {
    const link = $('label.link').children().val()

    $.ajax({
      method: 'PUT',
      url: '/post_images/' + identifier,
      data: JSON.stringify({
        link: link
      }),
      contentType: 'application/json'
    })
    .success(function (data, textStatus, xhr) {
      window.location = xhr.getResponseHeader('location')
    })
  }

  return false;
}

humanizeTimestamps(); setInterval(humanizeTimestamps, 10000);
