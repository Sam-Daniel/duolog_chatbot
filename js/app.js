var chatbot = {
  headerImage: "http://i.imgur.com/NggwaAk.png",
  backgroundColor: "#82adb0",
  accessToken: "b745f3f6e65b458e895add17566b55dc",
  enterKeyCode: 13,
  loading: false,
  error: false,
  responseTypes: {
    0: "default",
    4: "custom"
  },
  messageTypes: {
    10: "text",
    11: "card",
    12: "quick"
  },
  get client() {
    return new ApiAi.ApiAiClient({accessToken: this.accessToken});
  },
  get sessionId() {
    return this.client.sessionId;
  },
  sendText: function(text, options) {
    return this.client.textRequest(text, options);
  },
  eventRequest: function(event, eventOptions, options) {
    return this.client.eventRequest(event, eventOptions, options);
  },
  init: function() {
    this.toggleLoading();
    this.eventRequest("custom_welcome").then(function(response) {
      chatbot.attachResponse(response);
    }).catch(function(err) {
      console.log("Error:", err);
      chatbot.attachResponse(err, "error");
    });
  }, activeContexts: {contexts: []}
};

chatbot.toggleLoading = function() {
  if (!chatbot.loading) {
    $loading.removeClass("loading--hidden").addClass("loading--visible");
  } else {
    $loading.removeClass("loading--visible").addClass("loading--hidden");
  }
  chatbot.loading = !chatbot.loading;
};

chatbot.toggleError = function(msg) {
  msg = (msg === undefined)
    ? "Something went wrong. Please check your connection."
    : msg;
  if (!chatbot.error) {
    $error.find(".error__message").text(msg).end().removeClass("error--hidden").addClass("error--visible");
    window.setTimeout(function() {
      $error.removeClass("error--visible").addClass("error--hidden");
      window.setTimeout(function() {
        $error.find(".error__message").text("");
      }, 100);
    }, 2000);
  }
};

chatbot.sendClicked = function() {
  var value = chatbot.getInputValue();
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

chatbot.inputKeyDown = function(event, value) {
  if (event.which !== chatbot.enterKeyCode) {
    return;
  }
  $input.val("");
  chatbot.handleInput(value);
};

chatbot.handleInput = function(query) {
  chatbot.attachQuery(query);
  chatbot.handleQuery(query);
};

chatbot.attachQuery = function(query) {
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
  $chatbotWindow.animate({
    scrollTop: $chatbotWindow[0].scrollHeight
  }, 500);
};

chatbot.handleQuery = function(input) {
  chatbot.toggleLoading();
  chatbot.sendText(input, chatbot.activeContexts).then(function(response) {
    chatbot.attachResponse(response);
  }).catch(function(err) {
    console.log("Error:", err);
    chatbot.attachResponse(err, "error");
  });
};

chatbot.attachResponse = function(response, error) {

  if (error === undefined) {

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

    $response = $("<div class='response'></div>");

    chatbot.activeContexts.contexts = response.result.contexts;

    responseType = chatbot.responseTypes[response.result.fulfillment.messages[0].type];

    if (responseType !== "default") {
      payload = response.result.fulfillment.messages[0].payload;
      messageType = chatbot.messageTypes[payload.type];
    } else {
      payload = null;
      messageType = chatbot.messageTypes[10]; //Aside from custom payload responses, assume response type is basic text.
    }

    if (messageType === "text") {
      text = payload
        ? payload.text.split("\n")
        : new Array(response.result.fulfillment.messages[0].speech);
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
      var numberOfReplies = replies.length;
      $quickReply.addClass("quick-reply--" + numberOfReplies);
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

      var subheadingText = (payload.subtitle.length >= 80)
        ? payload.subtitle.substring(0, 80) + "..."
        : payload.subtitle;
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
    }

    $chatbotWindow.append($response);
    $(".quick-reply__button").after(" ");

  } else {
    chatbot.toggleError();
  }

  $chatbotWindow.animate({
    scrollTop: $chatbotWindow[0].scrollHeight
  }, 500);
  $input.val("");
  chatbot.toggleLoading();
};

$(document).ready(function() {

  /**************************/
  /***** jQUERY OBJECTS *****/
  /**************************/
  $input = $(".input__text");
  $container = $("body");
  $chatbotWindow = $(".chatbot__window");
  $chatbotHeader = $(".chatbot__header");
  $loading = $(".loading");
  $error = $(".error");
  $send = $(".input__send");

  $container.css("background-color", chatbot.backgroundColor);
  $chatbotHeader.css("background-image", "url('" + chatbot.headerImage + "')");

  chatbot.init();

  /**************************/
  /***** EVENT HANDLERS *****/
  /**************************/
  $send.on("click", function() {
    var value = chatbot.getInputValue();

    if (value === "") {
      return; //API throws an error to blank queries.
    }
    chatbot.sendClicked(value);
  });

  $input.on("keydown", function(e) {
    var value = chatbot.getInputValue();

    if (chatbot.getInputValue() === "") {
      return; //API throws an error to blank queries.
    }

    chatbot.inputKeyDown(e, value);
  });

  $(document).on("click", ".quick-reply__button, .card__button", function(e) {
    chatbot.buttonClicked(e);
  });

});
