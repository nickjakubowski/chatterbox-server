var app = {
  server : 'http://127.0.0.1:3000/',
  rooms : [],
  friends: []
};

app.init = function() {
  // this.stopID =setInterval(this.fetch.bind(this), 500);

  $('#send .submit').on('click', function(event) {
    app.handleSubmit();
    event.preventDefault();
  });

  $('button').on('click', app.addRoom.bind(this, app.escape($('#newRoom').val())));
  };

app.handleSubmit = function() {
  var message = {
    username: location.search.split("=")[1],
    text: $('#message').val(),
    roomname: document.getElementById('roomSelect').value
  };
  app.send(message);
};

app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    _postData: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.fetch();
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });

};

app.fetch = function() {
    console.log("fetching")
    $.ajax({
    url: this.server,
    type: 'GET',
    success: function (data) {
      app.clearMessages();
      _.each(data.results, function(obj) {
        var parsed = JSON.parse(obj)
        app.addMessage(parsed);
      });
    },
    error: function (data) {
      console.error('chatterbox: Failed to fetch messages');
    }
  });
};

app.addMessage = function(messageObj) {
  var username = app.escape(messageObj.username);
  var message = app.escape(messageObj.text);
  var room = app.escape(messageObj.roomname);

  if (app.rooms.indexOf(room) === -1) {
    app.addRoom(room);
  }

  if (document.getElementById('roomSelect').value === room || document.getElementById('roomSelect').value === "") {
    $('#rendered_chats').append('<div class=\'chat ' + room + '\'><a class=\'username\'>' + username + ':</a> ' + message + '</div>');
    $('#rendered_chats').children().last().find(".username").on('click', app.addFriend.bind(app, username));

    if(app.friends.indexOf(username) !== -1) {
      $('#rendered_chats').children().last().addClass("friend");
    }
  }
};


app.addFriend = function(username) {
  app.friends.push(username);
};

app.addRoom = function(roomname) {
  var roomname = roomname || app.escape($('#newRoom').val())
  $('#roomSelect').append('<option value=\'' + roomname +'\'>' + roomname + '</option>'); 
  app.rooms.push(roomname);
};

app.clearMessages = function() {
  $('#rendered_chats').empty();
}

app.escape = function(str) {
  return String(str)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
}

$(document).ready(function() {
  app.init();
})