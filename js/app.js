var $input;
var $chatbotWindow;
var enterKeyCode = 13;
var loading = false;
var $loading;
var responseTypes = {
  10: "text",
  11: "card",
  12: "quick"
};

var client = new ApiAi.ApiAiClient({accessToken: "b745f3f6e65b458e895add17566b55dc"});

var toggleLoading = function() {
  if (!loading) {
    $loading.removeClass("chatbot__loading--hidden").addClass("chatbot__loading--visible");
  } else {
    $loading.removeClass("chatbot__loading--visible").addClass("chatbot__loading--hidden");
  }
  loading = !loading;
};

var sendText = function(text) {
  return client.textRequest(text);
};

var handleQuery = function(input) {
  toggleLoading();
  sendText(input).then(function(response) {
    attachResponse(response);
  }).catch(function(err) {
    attachResponse(err);
  });
};

var inputKeyDown = function(event) {
  if (event.which !== enterKeyCode) {
    return;
  }
  var value = $($input).val();
  attachQuery(value);
  handleQuery(value);
};

var attachQuery = function(query) {
  query = query.split("\n");
  var $query = $("<div class='query'></div>");
  var $bubble = $("<div class='bubble'></div>");
  var $bubbleText = $("<div class='bubble__text'>");
  for (var i = 0; i < query.length; i++) {
    var $p = $("<p>");
    $p.text(query[i]);
    $bubbleText.append($p);
  }
  $bubble.append($bubbleText);
  $query.append($bubble);
  $chatbotWindow.append($query);
  $chatbotWindow.animate({ scrollTop: $chatbotWindow[0].scrollHeight}, 500);
  $input.val("");
};

var attachResponse = function(response) {
  var $response = $("<div class='response'></div>");
  var payload = response.result.fulfillment.messages[0].payload;
  var responseType = responseTypes[payload.type];
  if (responseType === "text") {

  } else if (responseType === "quick reply") {

  } else if (responseType === "card") {

  } else {
    // error or not type not in responseTypes
  }

  // TODO: for card and quick reply, need to add function to handle posts back as new queries


  // append node to chat window
  // scroll to bottom of chat window:
  $chatbotWindow.animate({ scrollTop: $chatbotWindow[0].scrollHeight}, 500);
  toggleLoading();
};

$(document).ready(function() {

  $input = $(".input__text");
  $chatbotWindow = $(".chatbot__window");
  $loading = $(".chatbot__loading");
  $input.on("keydown", function(e) {
    inputKeyDown(e);
  });

  $(document).on("click", ".quick-reply__button", function() {
    console.log("quick reply button clicked");
    //handle quick reply post back. A data attribute on $(this) should store info to post back
  });

  $(document).on("click", ".card__button", function() {
    console.log("card reply button qlicked");
    //handle card post back. A data attribute on $(this) should store info to post back
  });

});
