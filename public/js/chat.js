// Make connection
var socket = io.connect('http://' + location.host);

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');


// Emit events
$("#send").click(function() {
    socket.emit('chat', {
        message: message.value
    });
    message.value = "";
});


// Listen for events

socket.on('connect', function(){
    socket.emit('addUser', handle.value);
});

// socket.on('setName', function(username){
//     $('#handle').val(username);
// });

socket.on('updateChat', function (data) {
    feedback.innerHTML = '';
    output.innerHTML += '<p>'+ data + '</p>';
});

socket.on('updateRooms', function (rooms, current_room) {
    $('#rooms').empty();
    $.each(rooms, function(key, value) {
        if(value == current_room){
            $('#rooms').append('<div>' + value + '</div>');
        }
        else {
            $('#rooms').append('<div><a href="#" class="switch-room">' + value + '</a></div>');
        }
    });
});

socket.on('joined', function(data){

});

socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('left', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data + '</strong> has left the chat. </p>';
});


$("#message").keyup(function(event){
    socket.emit('typing', handle.value);
    if(event.keyCode == 13){
        $("#send").click();
    }
});

$(document).ready(function() {

    $('#data').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });

    $('#roombutton').click(function(){
        var name = $('#roomname').val();
        $('#roomname').val('');
        socket.emit('create', name)
    });

    $("#rooms").on("click", ".switch-room", function(){
        var room = $(this).text();
        console.log(room);
        socket.emit('switchRoom', room);
    });
});

$(window).bind('unload',function(){
    socket.emit('left', handle.value);
});

