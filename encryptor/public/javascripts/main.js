$(document).ready(function(){
  $("#submit").on('click', function(){
    var nameInput = $('#nameInput').val();
    var bodyInput = $('#bodyInput').val();
    var passInput = $('#passInput').val();

    var messageData = {
      messageName: nameInput,
      messageBody: bodyInput,
      messagePass: passInput
    }

    jQuery.post("http://localhost:3000/message", messageData, function(data){
      console.log('something must behappening?');
      console.log(data);
      alert(data.message);
      if(data.data != null){
        $('#nameInput').val(data.data.messageName);
        $('#bodyInput').val(data.data.messageBody);
      }
    })
  });
})
