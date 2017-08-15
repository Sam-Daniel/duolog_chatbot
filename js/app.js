

var chatbot = {
  enterKeyCode: 13,
  loading: false,
  responseTypes: {
    0: "default", // default intents. TODO: Confirm (fulfilment.messages.type === 0) indicates default
    10: "text",
    11: "card",
    12: "quick"
  },
  accessToken: "b745f3f6e65b458e895add17566b55dc"
};


/**************************/
/******** ELEMENTS ********/
/**************************/
// var $input;
// var $chatbotWindow;
// var $loading;

chatbot.client = new ApiAi.ApiAiClient({accessToken: chatbot.accessToken});

chatbot.toggleLoading = function() {
  if (!chatbot.loading) {
    $loading.removeClass("chatbot__loading--hidden").addClass("chatbot__loading--visible");
  } else {
    $loading.removeClass("chatbot__loading--visible").addClass("chatbot__loading--hidden");
  }
  chatbot.loading = !chatbot.loading;
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

var buttonClicked = function(el) {
  var $el = $(el.target);
  if ($el.data("webUrl")) {
    window.open($el.data("webUrl"), "_blank");
  } else if ($el.data("queryLink")) {
    handleInput($el.data("queryLink"));
  }
};

var getInputValue = function() {
  return $($input).val();
};

var inputKeyDown = function(event) {
  if (event.which !== chatbot.enterKeyCode) {
    return;
  }
  var value = getInputValue();
  handleInput(value);
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
  var payload;
  var title;
  var replies;


  // TODO: Refactor - all responses are similar
  if (error !== undefined) {
    console.log(response);
    console.log("An error has occurred.");
  // TODO: Add error handling
    return;
  }

  $response = $("<div class='response'></div>");

  try {
    payload = response.result.fulfillment.messages[0].payload;
  } catch(e) {
    payload = null;
  }

  var responseType = payload ? chatbot.responseTypes[payload.type] : chatbot.responseTypes[0];

  if ((responseType === "text") || (responseType === "default")) {
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


  } else if (responseType === "quick") {
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

  } else if (responseType === "card") {
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
  toggleLoading();
};

$(document).ready(function() {

  /**************************/
  /******** ELEMENTS ********/
  /**************************/
  $input = $(".input__text");
  $chatbotWindow = $(".chatbot__window");
  $loading = $(".chatbot__loading");
  $send = $(".input__send");

  /**************************/
  /***** EVENT HANDLERS *****/
  /**************************/
  $send.on("click", sendClicked);
  $input.on("keydown", function(e) {
    if (getInputValue() === "") {
      return; //API throws an error to blank queries.
    }
    inputKeyDown(e);
  });
  $(document).on("click", ".quick-reply__button, .card__button", function(e) {
    buttonClicked(e);
  });
});
