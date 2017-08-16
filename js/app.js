

var chatbot = {
  enterKeyCode: 13,
  loading: false,
  responseTypes: {
    0: "default",
    4: "custom"
  },
  messageTypes: {
    10: "text",
    11: "card",
    12: "quick"
  },
  accessToken: "b745f3f6e65b458e895add17566b55dc",
  get client() {
    return new ApiAi.ApiAiClient({accessToken: this.accessToken});
  },
  get sessionId() {
    return this.client.sessionId;
  },
  sendText: function(text, options) {
    if (options === undefined) {
      // simple text query, no options to include in the request (eg context, etc)
      return this.client.textRequest(text);
    } else {
      // complex request, including options (eg context, etc)
    }
  }, init: function() {

  }
};


chatbot.toggleLoading = function() {
  if (!chatbot.loading) {
    $loading.removeClass("chatbot__loading--hidden").addClass("chatbot__loading--visible");
  } else {
    $loading.removeClass("chatbot__loading--visible").addClass("chatbot__loading--hidden");
  }
  chatbot.loading = !chatbot.loading;
};

chatbot.sendClicked = function() {
  var value = getInputValue();
  $input.val("");
  chatbot.handleInput(value);
};

chatbot.buttonClicked = function(el) {
  var $el = $(el.target);
  if ($el.data("webUrl")) {
    window.open($el.data("webUrl"), "_blank");
  } else if ($el.data("queryLink")) {
    chatbot.handleInput($el.data("queryLink"));
  }
};

chatbot.getInputValue = function() {
  return $($input).val();
};

chatbot.inputKeyDown = function(event) {
  if (event.which !== chatbot.enterKeyCode) {
    return;
  }
  var value = chatbot.getInputValue();
  $input.val("");
  chatbot.handleInput(value);
};

// var attach = function(type, payload, $wrapper) {
//   if (type === "query") {
//
//   } else if (type === "default") {
//
//   } else if (type === "text") {
//
//   } else if (type === "quick") {
//
//   } else if (type === "card") {}
//
// };

chatbot.handleInput = function(query) {
  chatbot.attachQuery(query);
  chatbot.handleQuery(query);
};

chatbot.attachQuery = function(query) {
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

};

chatbot.handleQuery = function(input) {
  chatbot.toggleLoading();
  chatbot.sendText(input).then(function(response) {
    chatbot.attachResponse(response);
  }).catch(function(err) {
    console.log(err);
    chatbot.attachResponse(err, "error");
  });
};

chatbot.attachResponse = function(response, error) {
  var $response;
  var $bubble;
  var $bubbleText;
  var $p;
  var $card;
  var $cardTitle;
  var $cardSubtitle;
  var $cardImage;
  var $cardButton;
  var $quickReply;
  var $text;
  var responseType;
  var messageType;
  var payload;
  var title;
  var replies;

  // TODO: Refactor - all responses are similar
  if (error !== undefined) {
    console.log("An error has occurred. Response below:");
    console.log(response);
  // TODO: Add error handling
    return;
  }

  $response = $("<div class='response'></div>");

  // try {
  //   payload = response.result.fulfillment.messages[0].payload;
  // } catch(e) {
  //   payload = null;
  // }

  responseType = chatbot.responseTypes[response.result.fulfillment.messages[0].type];

  if (responseType !== "default") {
    payload = response.result.fulfillment.messages[0].payload;
    messageType = chatbot.messageTypes[payload.type];
  } else {
    payload = null;
    messageType = chatbot.messageTypes[10]; // This assumes that all default/type 0 responses from the API will be basic text messages.
  }

  if (messageType === "text") {
    text = payload ? payload.text.split("\n") : new Array(response.result.fulfillment.messages[0].speech);
    $bubble = $("<div class='bubble'></div>");
    $bubbleText = $("<div class='bubble__text'>");

    for (var i = 0; i < text.length; i++) {
      $p = $("<p>");
      $p.text(text[i]);
      $bubbleText.append($p);
    }

    $bubble.append($bubbleText);
    $response.append($bubble);

  } else if (messageType === "quick") {
    title = payload.title;
    replies = payload.replies;
    $bubble = $("<div class='bubble'></div>");
    $bubbleText = $("<div class='bubble__text'></div>");
    $p = $("<p>");
    $p.text(title);
    $bubbleText.append($p);
    // TODO:
    $quickReply = $("<div class='quick-reply'></div>");
    for (var j = 0; j < replies.length; j++) {
      var $button = $("<div class='quick-reply__button'></div>");
      $button.text(replies[j]);
      $button.data("queryLink", replies[j]);

      $button.after(" ");
      $quickReply.append($button);
    }
    $bubble.append($bubbleText);
    $response.append($bubble);
    $response.append($quickReply);

  } else if (messageType === "card") {
    $card = $("<div class='card'></div>");
    $cardImage = $("<div class='card__image'></div>");
    $cardTitle = $("<div class='card__title'></div>");
    $cardSubtitle = $("<div class='card__subtitle'></div>");

    $cardImage.css("background-image", "url(" + payload.imageurl + ")");

    $cardTitle.text(payload.title);

    var subheadingText = (payload.subtitle.length >= 80) ? payload.subtitle.substring(0,80) + "..." : payload.subtitle;
    $cardSubtitle.text(subheadingText);

    $card.append($cardImage);
    $card.append($cardTitle);
    $card.append($cardSubtitle);

    var cardButtons = payload.buttons;
    for (var cardButton in cardButtons) {
      $cardButton = $("<div class='card__button'></div>");
      $cardButton.text(cardButtons[cardButton].label);
      if (cardButtons[cardButton].hasOwnProperty("web_url")) {
        $cardButton.data("webUrl", cardButtons[cardButton].web_url);
      } else {
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
  chatbot.toggleLoading();
};

$(document).ready(function() {

  /**************************/
  /***** jQUERY OBJECTS *****/
  /**************************/
  $input = $(".input__text");
  $chatbotWindow = $(".chatbot__window");
  $loading = $(".chatbot__loading");
  $send = $(".input__send");

  /**************************/
  /***** EVENT HANDLERS *****/
  /**************************/
  $send.on("click", chatbot.sendClicked);
  $input.on("keydown", function(e) {
    if (chatbot.getInputValue() === "") {
      return; //API throws an error to blank queries, so just return for the timebeing.
    }
    chatbot.inputKeyDown(e);
  });
  $(document).on("click", ".quick-reply__button, .card__button", function(e) {
    chatbot.buttonClicked(e);
  });

});
