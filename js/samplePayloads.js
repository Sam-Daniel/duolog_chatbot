var sampleBasicPayload = {
  "id": "5bc3eb60-1f9f-4d3b-bdee-8cd09c0046c1",
  "timestamp": "2017-08-13T01:12:13.226Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "text",
    "action": "",
    "actionIncomplete": false,
    "parameters": {},
    "contexts": [],
    "metadata": {
      "intentId": "2eb36c74-db11-4d28-b61a-0464d1381df8",
      "webhookUsed": "false",
      "webhookForSlotFillingUsed": "false",
      "intentName": "richtext"
    },
    "fulfillment": {
      "speech": "",
      "messages": [
        {
          "type": 4,
          "payload": {
            "type": 10,
            "text": "Chatbot text response\nwith line break 😀"
          }
        }
      ]
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success"
  },
  "sessionId": "e8c46dfd-95f5-41df-b008-662f2a2742d6"
};

var sampleQuickReplyPayload = {
  "id": "cfa54ff4-b256-4445-9442-f894d2f55a0d",
  "timestamp": "2017-08-13T01:13:40.674Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "quick",
    "action": "",
    "actionIncomplete": false,
    "parameters": {},
    "contexts": [],
    "metadata": {
      "intentId": "a0c3adaf-cffd-46f2-988c-968a0233a620",
      "webhookUsed": "false",
      "webhookForSlotFillingUsed": "false",
      "intentName": "quickreplies"
    },
    "fulfillment": {
      "speech": "",
      "messages": [
        {
          "type": 4,
          "payload": {
            "type": 12,
            "title": "What is your quick reply ?",
            // TODO: I think the Quick Replies JSON may need either a context or for more data in the payload itself, to be attached to the reply button elements as data attributes, in order for the agent to be able to handle the reply ("Yes" or "No", etc, wouldn't be meaningful enough on their own)
            "replies": ["Reply 1", "Reply 2", "Reply 3"]
          }
        }
      ]
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success"
  },
  "sessionId": "e8c46dfd-95f5-41df-b008-662f2a2742d6"
};

var sampleCardPayload = {
  "id": "1a10aa88-9ab4-4096-b944-e33ef807bca5",
  "timestamp": "2017-08-13T01:14:23.738Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "card",
    "action": "",
    "actionIncomplete": false,
    "parameters": {},
    "contexts": [],
    "metadata": {
      "intentId": "cfd40370-6588-4a41-b558-f45f4524b8a4",
      "webhookUsed": "false",
      "webhookForSlotFillingUsed": "false",
      "intentName": "card"
    },
    "fulfillment": {
      "speech": "",
      "messages": [
        {
          "type": 4,
          "payload": {
            "type": 11,
            "imageurl": "http://placehold.it/200x105",
            "title": "This is the …",
            "subtitle": "This is …",
            "buttons": [
              {
                "label": "Button 1",
                "web_url": "http://www.google.com"
              }, {
                "label": "Button 2",
                "postback": "some text"
              }
            ]
          }
        }
      ]
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success"
  },
  "sessionId": "e8c46dfd-95f5-41df-b008-662f2a2742d6"
};
