document.getElementsByTagName('button')[0].addEventListener('click', function() {
  var placeBidButton = this;

  // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
  var mb_encodeURIComponent = function(string) {
    return encodeURIComponent(string).replace(/%20/g, '+').replace(/[!'()*]/g, escape);
  }

  // Validate inputs and generate requestBody.
  var inputs = document.getElementsByTagName('input');
  var statusP = document.getElementById('status');
  var requestBody = '';
  for (var idx = 0; idx < inputs.length; idx++) {
    var input = inputs[idx];
    var errorMessage;
    if (idx === 5) { // email
      if (!/\S+@\S+/.test(input.value)) {
        errorMessage = 'Please enter a valid email.';
      }      
    } else if (!input.value.length) {
      errorMessage = 'Please fill out all fields.';
    }
    if (errorMessage) {
      statusP.className = 'error';
      statusP.innerHTML = 'Error! ' + errorMessage;
      return;
    }
    requestBody += (idx ? '&' : '') + input.name + '=' + mb_encodeURIComponent(input.value);
  }

  var httpRequest = new XMLHttpRequest();
  if (httpRequest) {
    statusP.className = 'hidden'; // in case I place another bid
    httpRequest.open('POST', '/bid-a-bed', true);

    // Handle the httpResponse.
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        placeBidButton.disabled = false;
        placeBidButton.innerHTML = "Place Bid";

        if (httpRequest.status === 200) {
          statusP.className = 'success';
          statusP.innerHTML = 'Thanks! Feel free to place another.';
        } else {
          var errorMessage;
          try {
            errorMessage = JSON.parse(httpRequest.responseText).message;
          } catch (exception) { }
          if (!errorMessage || !errorMessage.length) {
            errorMessage = 'Please <a href="https://www.facebook.com/messages/Myownbedcom">Facebook message us</a>.';
          }
          statusP.className = 'error';
          statusP.innerHTML = 'Error! ' + errorMessage;
        }
      }
    }

    // Configure & send the httpRequest.
    // httpRequest.responseType = 'json'; // isn't yet supported by WebKit
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    placeBidButton.disabled = true;
    placeBidButton.innerHTML = "Placing Bid...";
    httpRequest.send(requestBody);
  } else {
    statusP.className = 'error';
    statusP.innerHTML = 'Error! Please <a href="http://browsehappy.com">upgrade your browser</a>.';
  }
});

//// To add spinner, add this to HTML:
// <canvas height="24" width="24"></canvas>

//// Draw spinner in canvas.
// var canvas = placeBidButton.getElementsByTagName('canvas')[0];
// var context = canvas.getContext('2d');
// var started = new Date();
// window.setInterval(function () {
//   var rotationsSinceStarted = (new Date() - started) / 1000;
//   var rotationInTwelfths = parseInt(rotationsSinceStarted * 12) / 12;
//   context.save();
//   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
//   context.translate(11, 12);
//   context.rotate(Math.PI * 2 * rotationInTwelfths);
//   for (var i = 0; i < 16; i++) {
//     context.rotate(Math.PI * 2 / 12);
//     context.beginPath();
//     context.moveTo(5, 0);
//     context.lineTo(12, 0);
//     context.strokeStyle = "rgba(0,0,0," + i / 12 + ")";
//     context.stroke();
//   }
//   context.restore();
// }, 1000 / 30);

// (function() {
//   
// })();
