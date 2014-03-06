var socket = io.connect('/');
var socket_id = parseInt(Math.random() * 10000);
console.log("what");
var text1 = new Texter("text1");
text1.init();


function Texter(sel) {
  var self = this;

  self.el = document.getElementById(sel);
  self.btn = self.el.querySelector("button");
  self.in = self.el.querySelector(".input");

  self.init = function() {

    self.btn.addEventListener("click", function(){
      self.send();
    }, false);


    $(self.el).keydown(function(event) {
      if (event.keyCode == 13 || event.charCode == 13) {
        self.send();
        return false;
      } 
    });

    socket.on('message', function(msg) {
      if (msg.ID !== socket_id) {
        self.receive(msg.text);
      }
    });

  };


  self.send = function() {
    var msg = self.in.textContent.trim();
    self.in.innerHTML = "";

    var newmsg = document.createElement("div");
    newmsg.innerHTML = msg;
    newmsg.className = "msg self";
    self.el.appendChild(newmsg);

    //self.other.receive(process(msg));
    socket.emit('message', {
      "text": process(msg),
      "ID": socket_id
    });
  }

  self.receive = function(msg) {
    var newmsg = document.createElement("div");
    newmsg.innerHTML = msg;
    newmsg.className = "msg other";
    self.el.appendChild(newmsg);
  }

}


var onlyLetters = /^[a-zA-Z]*$/;

var mode = "lettermix";

function process(str) {
  if (mode == "lettermix") {
    return lettermix(str);
  }
  else {
    return loseword(str);
  }
}

function lettermix(str) {
  var letters = str.split("");
  for (var i = 0; i < letters.length; i++) {
    if (onlyLetters.test(letters[i])) {
      if (Math.random() > 0.5) {
        letters[i] = String.fromCharCode(letters[i].charCodeAt(0)+1);
      }
    }
  }
  return letters.join("");
}

function loseword(str) {
  var words = str.split(" ");
  var newstr = "";
  for (var i = 0; i < words.length; i++) {
    if (Math.random() > 0.5) {
      newstr += words[i] + " ";
    }
  }
  if (newstr == "") newstr = "<br>";
  return newstr;
}


// console.log("hi");
// wordnik = new SwaggerApi({
//   api_key: 'e58d6bb6f85c0e99eb00b0b8df404e1b06d7d370ea945e3ec',
//   verbose: true,
//   success: function() {
//     sonsole.log("api created");
//     args = {word: 'sanctimonious'}
//     wordnik.word.getDefinitions(args, function(definitions){
//       console.log(definitions[0].word);
//       for (var i = 0; i < definitions.length; i++) {
//         var definition = definitions[i];
//         console.log(definition.partOfSpeech + ": " + definition.text);
//       }
//     });
//   }
// });        
