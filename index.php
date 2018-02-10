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

    </head>

    <body>
	    
               
                
           
        
	    <div class="headerBar">
                <div class="user-photo"><img src="https://image.ibb.co/govGY7/oie_transparent_12.png"></div>
                <p class="title"> NVT Phybridge </p>
		    

        </div>

        
        
        <div class="chatbox"> 
	  
            <div class="chatlogs">
            
                <div class="chat friend">
                    <div class="user-photo"><img src="https://image.ibb.co/govGY7/oie_transparent_12.png"></div>
                    <p class="chat-message">Hi!</p>
                </div>

                <div class="chat friend" id="loadingGif" style="display: none;">
                     <div class="user-photo"><img src="https://image.ibb.co/govGY7/oie_transparent_12.png"></div>
                    <div class="gif"><img src="Images/loading.gif"></div>
                </div>

            </div>

             <div class="chat-form">
                <div id="inputDiv" autofocus/>
                    <textarea class="input" type="text" name="" value="" placeholder="Ask Us" autofocus></textarea>
                </div>
                <div id="chat-form-buttons">
                    
      
                </div>
               <!--<button id="switchInputType"></button>-->

        </div>

        <script type="text/javascript" src="index.js"></script>  
    </body>

</html>
