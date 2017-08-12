var $input;
var $chatbotWindow;
var enterKeyCode = 13;
var loading = false;
var $loading;

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
    var result;
    try {
      result = response.result.fulfillment.speech;
    } catch (error) {
      result = "";
    }
    attachResponse(response);
  }).catch(function(err) {
    attachResponse(err, "error");
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
  for (var i = 0; i < userQuery.length; i++) {
    var $p = $("<p>");
    $p.text(userQuery[i]);
    $bubbleText.append($p);
  }
  $bubble.append($bubbleText);
  $query.append($bubble);
  $chatbotWindow.append($query);
  $chatbotWindow.animate({ scrollTop: $chatbotWindow[0].scrollHeight}, 500);
  $input.val("");
};

var attachResponse = function(response, error) {
  var $response = $("<div class='response'></div>");


  // create node for response
  // if (error) {
    // deal with error (ie, if two arguments are passed in, reponse is an error. handle accordingly. still needs to populate and append node)
  // } else {
    // handle normal response (populate and append node)
    // responseType = response.result.fulfillment.messsages[0].payload.type
    // if (responseType === 11), is card
      //  need to add funtion to handle posts back as new queries
    // if (responseType === 12), is quick reply
      // need to add function to handle posts back as new queries
    // if (responseType === 10) || (responseType === 0), is basic reply or intent didn't understand the query.


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
