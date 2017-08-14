
var $input;
var $chatbotWindow;
var enterKeyCode = 13;
var loading = false;
var $loading;
var responseTypes = {
  0: "default",  // default intents. TODO: Confirm (fulfilment.messages.type === 0) indicates default
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
    console.log(err);
    attachResponse(err, "error");
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
  // TODO: Refactor — basically identical to text response
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
  // TODO: Refactor - all responses are similar
  if (error !== undefined) {
    console.log(response);
    console.log("An error has occurred.");
  // TODO: Add error handling
    return;
  }

  var $response = $("<div class='response'></div>");

  var payload;
  try {
    payload = response.result.fulfillment.messages[0].payload;
  } catch(e) {
    payload = null;
  }

  var responseType = payload ? responseTypes[payload.type] : responseTypes[0];

  if ((responseType === "text") || (responseType === "default")) {
    var text = payload ? payload.text.split("\n") : new Array(response.result.fulfillment.messages[0].speech);
    var $bubble = $("<div class='bubble'></div>");
    var $bubbleText = $("<div class='bubble__text'>");

    for (var i = 0; i < text.length; i++) {
      var $p = $("<p>");
      $p.text(text[i]);
      $bubbleText.append($p);
    }

    $bubble.append($bubbleText);
    $response.append($bubble);


  } else if (responseType === "quick") {
    var title = payload.title;
    var replies = payload.replies;
    var $bubble = $("<div class='bubble'></div>");
    var $bubbleText = $("<div class='bubble__text'></div>");
    var $p = $("<p>");
    $p.text(title);
    $bubbleText.append($p);
    // TODO:
    $quickReply = $("<div class='quick-reply'></div>");
    for (var i = 0; i < replies.length; i++) {
      var $button = $("<div class='quick-reply__button'></div>");
      $button.text(replies[i]);
      $button.after(" ");
      $quickReply.append($button);
    }
    $bubble.append($bubbleText);
    $response.append($bubble);
    $response.append($quickReply);


  } else if (responseType === "card") {
    var $card = $("<div class='card'></div>");
    var $cardImage = $("<div class='card__image'></div>");
    var $cardHeading = $("<div class='card__heading'></div>");
    var $cardSubheading = $("<div class='card__subheading'></div>");

    $cardImage.css("background-image", "url(" + payload.imageurl + ")");

    $cardHeading.text(payload.title);

    var subheadingText = (payload.subtitle.length >= 80) ? payload.subtitle.substring(0,80) + "..." : payload.subtitle;
    $cardSubheading.text(subheadingText);

    $card.append($cardImage);
    $card.append($cardHeading);
    $card.append($cardSubheading);

    var cardButtons = payload.buttons;
    for (var cardButton in cardButtons) {
      var $cardButton = $("<div class='card__button'></div>");
      $cardButton.text(cardButtons[cardButton].label);
      if (cardButtons[cardButton].hasOwnProperty("web_url")) {
        $cardButton.addClass("web-button");
        $cardButton.data("webUrl", cardButtons[cardButton].web_url);
      } else {
        $cardButton.addClass("query-button");
        $cardButton.data("queryLink", cardButtons[cardButton].postback);
      }
      $card.append($cardButton);
    }

    $response.append($card);

  } else {
    // error or not type not in responseTypes. Catchall response.
  }

  $chatbotWindow.append($response);
  // TODO: Must be a better way of doing this:
  $(".quick-reply__button").after(" ");
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
    if (getInputValue() === "") {
      return;
    }
    inputKeyDown(e);
  });

  $(document).on("click", ".quick-reply__button", function() {
    console.log("quick reply button clicked");
    //handle quick reply post back. A data attribute on $(this) should store info to post back
  });

  $(document).on("click", ".card__button", function() {
    console.log("card reply button clicked");
    if ($(this).data("webUrl")) {
      window.open($(this).data("webUrl"), "_blank");
    } else if ($(this).data("queryLink")) {
      handleInput($(this).data("queryLink"));
    }

  });

});
