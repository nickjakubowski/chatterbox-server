var app = {
  server : 'http://127.0.0.1:3000/classes/messages',
  rooms : [],
  friends: [],
  myName: ""
};

app.init = function() {
  this.stopID =setInterval(this.fetch.bind(this), 500);

  $('#send .submit').on('click', function(event) {
    app.handleSubmit();
    event.preventDefault();
  });

  $('button').on('click', app.addRoom.bind(this, app.escape($('#newRoom').val())));
  };

app.handleSubmit = function() {
  var message = {
    username: this.myName || "Laura",
    message: $('#message').val(),
    roomname: document.getElementById('roomSelect').value || "roomname"
  };
  app.send(message);
};

app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      // app.fetch();
    },
    error: function (error, err, exception) {
      console.error(err + " " + exception);//'chatterbox: Failed to send message');
    },
    timeout : 1000
  });

};

app.fetch = function() {
    console.log("fetching")
    $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      app.clearMessages();
      _.each(data.results, function(obj) {
        app.addMessage(obj);
      });
    },
    error: function (data) {
      console.error('chatterbox: Failed to fetch messages');
    }
  });
};

app.addMessage = function(messageObj) {
  var username = app.escape(messageObj.username);
  var message = app.escape(messageObj.message);
  var room = app.escape(messageObj.roomname);

  if (app.rooms.indexOf(room) === -1) {
    app.addRoom(room);
  }

  if (document.getElementById('roomSelect').value === room || document.getElementById('roomSelect').value === "") {
    $('#rendered_chats').prepend('<div class=\'chat ' + room + '\'><a class=\'username\'>' + username + ':</a> ' + message + '</div>');
    $('#rendered_chats').children().first().find(".username").on('click', app.addFriend.bind(app, username));

    if(app.friends.indexOf(username) !== -1) {
      $('#rendered_chats').children().first().addClass("friend");
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
  app.myName = prompt("What's your name?")
  app.init();
})