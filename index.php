<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script type="text/javascript" src="js/ApiAi.min.js"></script>
  <script type="text/javascript" src="js/app.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="css/style.css">

  <title>NVT Phybridge</title>
</head>

<body>
  <div class="chatbot">
    <div class="header">
     <div  class="title" <p> Phybridge </p>  </div>
       <div class="header__wrapper">
         <div class="header__color"></div>
        <h1 class="header__text">  </h1>
      </div>
    </div>
    <div class="window">
      <div class="conversation"></div>
      <div class="status">
        <div class="loading loading--hidden">
          <div class="loading__left "></div>
          <div class="loading__middle"></div>
          <div class="loading__right"></div>
        </div>
        <div class="error error--hidden">
          <div class="error__message"></div>
        </div>
      </div>
    </div>

    <div class="input">
      <input class="input__text" type="text" name="" value="" placeholder="Chat with us.." autofocus>
      <div class="input__button">
        <i class="material-icons input__send input__send--inactive" style="color:#1b4c82;">&#xE163;</i>
      </div>
    </div>
  </div>
</body>
</html>
