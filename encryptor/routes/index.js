var express = require('express');
var router = express.Router();
// Nodejs encryption with CTR
var crypto = require('crypto'), algorithm = 'aes-256-ctr';
var Messages;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Encryptor' });
});

router.post('/message', function(req, res, next) {
  var messageName = req.body.messageName;
  var messageBody = req.body.messageBody;
  var messagePass = req.body.messagePass;

  //look in database and find message if exists
  Messages.findOne({ _id: encryptText(messageName, messagePass) }).exec(function(err, messageData) {
      if (err) {
        console.log("some error occured while trying to find a message");
      } else {
          if(messageData == null){
            res.json(saveAndEncryptMessage(messageName, messageBody, messagePass));
          }else{
            res.json(openAndDecryptMessage(messageData, messagePass));
          }
      }
  });
});

function saveAndEncryptMessage(messageName, messageBody, messagePass){
  if(messageName.length < 1 && messageBody.length < 1 && messagePass.length < 1){
    return {message: "You forgot to enter all required information."};
  }

  var message = new Messages();
  message._id = encryptText(messageName, messagePass);
  message.body = encryptText(messageBody, messagePass);
  message.save(function(err, ok){
    if(err){
      console.log("cannot save item: " + err);
    }
  });
  return {message: "Your message has been saved"};
}

function openAndDecryptMessage(messageData, messagePass){
  var viewModel = {};

  viewModel.messageName = decryptText(messageData._id, messagePass);
  viewModel.messageBody = decryptText(messageData.body, messagePass);

  return {message: "Your message has been opened", data: viewModel};
}

function decryptText(textIn, password){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(textIn,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function encryptText(textIn, password){
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(textIn,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

module.exports = function(model){
  Messages = model;
  return router;
};
