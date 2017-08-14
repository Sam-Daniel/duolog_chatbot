
var $input;
var $chatbotWindow;
var enterKeyCode = 13;
var loading = false;
var $loading;
var responseTypes = {
  0: "stock",
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
    console.log("I'm sorry, bork");
    toggleLoading(); //TODO: remove this. Just to toggle loading til errors are handled. 
  });
};

var handleInput = function(query) {
  attachQuery(query);
  handleQuery(query);
};

var sendClicked = function() {
  var value = getInputValue();
  handleInput(value);
};

var getInputValue = function() {
  return $($input).val();
};

var inputKeyDown = function(event) {
  if (event.which !== enterKeyCode) {
    return;
  }
  var value = getInputValue();
  handleInput(value);
};

var attachQuery = function(query) {
  // TODO: Refactor — basically identical to text response (func w/ args type, text)
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

var attachResponse = function(response, error) {
  // At the moment, this is equivalent to (if error === undefined).
  if (error === "error") {

    console.log('bork');

  }
  var $response = $("<div class='response'></div>");
  console.log(response);
  var messageType = response.result.fulfillment.messages[0].type;
  var payload = response.result.fulfillment.messages[0].payload;
  var responseType = responseTypes[payload.type];
  console.log(responseType);
  if (responseType === "text") {
    // TODO: Refactor — basically identical to query and quick reply bubble (func w/ args type, text).
    var text = payload.text.split("\n");
    var $bubble = $("<div class='bubble'></div>");
    var $bubbleText = $("<div class='bubble__text'>");
    for (var i = 0; i < text.length; i++) {
      var $p = $("<p>");
      $p.text(text[i]);
      $bubbleText.append($p);
    }
    $bubble.append($bubbleText);
    $response.append($bubble);
    $chatbotWindow.append($response);

  } else if (responseType === "quick") {

    var title = payload.title;
    var replies = payload.replies;
    var $bubble = $("<div class='bubble'></div>");
    var $bubbleText = $("<div class='bubble__text'></div>");
    var $p = $("<p>");
    $p.text(title);
    $bubbleText.append($p);
    $quickReply = $("<div class='quick-reply'></div>");
    for (var i = 0; i < replies.length; i++) {
      var $button = $("<div class='quick-reply__button'></div>");
      $button.text(replies[i]);
      $quickReply.append($button);
    }
    $bubble.append($bubbleText);
    $response.append($bubble);
    $response.append($quickReply);
    $chatbotWindow.append($response);


  } else if (responseType === "card") {

  } else {
    if (messageType === 0) {
      // TODO: Confirm that this correlates to default API.AI intent responses (welcome, fallback, etc). If so, handle same as responseType === 'text'
    } else {
      // error or not type not in responseTypes. Catchall response. Error?
    }

  }

  // TODO: for card and quick reply, need to add function to handle posts back as new queries

  // append node to chat window
  // scroll to bottom of chat window:
  $chatbotWindow.animate({ scrollTop: $chatbotWindow[0].scrollHeight}, 500);
  $input.val("");
  toggleLoading();
};

$(document).ready(function() {

  $input = $(".input__text");
  $chatbotWindow = $(".chatbot__window");
  $loading = $(".chatbot__loading");
  $send = $(".input__send");
  $send.on("click", sendClicked);
  $input.on("keydown", function(e) {
    inputKeyDown(e);
  });

  $(document).on("click", ".quick-reply__button", function() {
    console.log("quick reply button clicked");
    //handle quick reply post back. A data attribute on $(this) should store info to post back
  });

  $(document).on("click", ".card__button", function() {
    console.log("card reply button clicked");
    //handle card post back. A data attribute on $(this) should store info to post back
  });

});
