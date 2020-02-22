/*
  Sources:
  Fish Images: Pixabay Images. Labelled for noncommercial reuse with modification.
    RED: https://cdn.pixabay.com/photo/2012/04/12/22/05/goldfish-30838_960_720.png		
    BLUE: https://cdn.pixabay.com/photo/2014/04/02/10/17/piranha-303345_960_720.png		
    YELLOW: https://cdn.pixabay.com/photo/2012/05/07/12/40/fish-48338_960_720.png
  Water Image: https://www.publicdomainpictures.net/en/view-image.php?image=41711&picture=seaside-beach-holiday-clipart
  Hook Image: http://pngimg.com/uploads/fish_hook/fish_hook_PNG11.png
  CollisionDetection Tutorial: https://www.youtube.com/watch?v=y6C6Gx8ui84
*/

//Variables
  //Condition of Rod
var isCast = false;
var isCasting = false;
var isReeling = false;
var lineCondition = "intact";
  //tension
var tension = false;
var tensionLoop = false;
  //Fish movement loops and checks
var blueFish = 0;
var yellowFish = 0;
var redFish = 0;
  //Condition of fish
var isSpawned = false;
var isCaught = false;
var typeCaught = null;
var direction = [0,1,1,0];
  //moving hook or fish
var reelCaughtFish = 0;
var reelHook = 0;
  //Scoring
var gameScore = 0;
var allScores = [0,0,0,0,0,0];
var money = 20;
var numberCaught = 0;
  //Other
var screenID="HomeScreen";

//Functions
  //Manages switching screens
function switchScreen(){
  //Switches screen from HomeScreen or Gamestart to Scores
  if(screenID== "HomeScreen" || screenID == "GameStart"){
    if(screenID == "GameStart"){
      //stops errors with calls to non-existant IDs
      if(tension!= false){
        stopTimedLoop(tension);
      }
      //Adds current gameScore to scores array before ranking from greatest to least
      appendItem(allScores,gameScore);
      for(var i = 0; i<allScores.length;i++){
        for(var n=i+1;n<allScores.length;n++)
          if(allScores[n]>allScores[i]){
            var temp = allScores[i];
            allScores[i] = allScores[n];
            allScores[n] = temp;
            
          }
      }
      
      setText("score1","1: " +allScores[0]);
      setText("score2","2: " +allScores[1]);
      setText("score3","3: " +allScores[2]);
      setText("score4","4: " +allScores[3]);
      setText("score5","5: " +allScores[4]);
      
    }
    //resets in-game variables
    screenID = "Scores";
    gameScore = 0;
    money = 20;
    numberCaught = 0;
    setTimeout(function(){
      setScreen("Scores");
    },300);
    setTimeout(function(){
      showScoreElements();
    },1000);
  }
  //switches from scores to home
  else if(screenID == "Scores"){
    hideScoreElements();
    setScreen("HomeScreen");
    showHomeElements();
    screenID = "HomeScreen";
  }
}
  
function hideScoreElements(){
  hideElement("score1");
  hideElement("score2");
  hideElement("score3");
  hideElement("score4");
  hideElement("score5");
  hideElement("ScoreText");
  hideElement("scoretohome");
}

function showScoreElements(){
  showElement("score1");
  showElement("score2");
  showElement("score3");
  showElement("score4");
  showElement("score5");
  showElement("ScoreText");
  showElement("scoretohome");
}

function hideHomeElements(){
  hideElement("playButton");
  hideElement("scoreButton");
  hideElement("helpButton");
}

function showHomeElements(){
  showElement("playButton");
  showElement("scoreButton");
  showElement("helpButton");
}

function showInstructions(){
  hideHomeElements();
  showElement("instructions");
  setTimeout(function(){
    showHomeElements();
    hideElement("instructions");
  },8000);
  
}
  //Shows animation for casting the rod and creates the hook and line
function castRod(){
    //Prevents a double cast and errors
    if (isCasting == true){
      
    }
    else{
      //Hides static uncast rod and shows gif of casting rod
      isCasting = true;
      hideElement("homeScreenRod");  
      setProperty("fishingRod", "image", "New Piskel (3).gif");
      showElement("fishingRod");
      //Waits before hiding gif and creating line and hook in water
      setTimeout(function() {
      if(screenID == "GameStart"){
        image("hook","assets/hook.png");
        image("line","assets/line.png");
        setProperty("line","fit","fill");
        setPosition("hook",20,275,10,20);
        isCast=true;
        showElement("castFishingRod");
        manageHook();
      }
      hideElement("fishingRod");
      isCasting = false;
    }, 1900);
    }
}
  //Resets rod, hook, line in game
function resetRod(){
  //stops timed loops that reel in the line/fish
  stopTimedLoop(reelCaughtFish);
  stopTimedLoop(reelHook);
  hideElement("castFishingRod");
  showElement("homeScreenRod");
  //Checks that the hook and line already exist before deleting them
  if(isCast == true){
    deleteElement("hook");
    deleteElement("line");  
  }
  //resets conditions surrounding the fishing rod
  isCast=false;
  isReeling=false;
  isCaught = false;
  typeCaught = null;
  tension = false;
  lineCondition = "intact";
}
  //Moves hook on player command. Also scales the size and position of the line accordingly.
function manageHook(keyCode){
  if(isCast==true && isCaught==false &&isReeling==false){
    var xPos = getXPosition("hook");
    var yPos = getYPosition("hook");
    //Checks if line needs to be reeled in b/c it is too close to land
    if(getXPosition("hook")>=190){
      updateTrackers();
    }
    //S
    if((keyCode==119)&&(yPos-1>265)){
      setPosition("hook",xPos,yPos-10);
    }
    //W
    else if((keyCode == 115) && (yPos+1<435)){
      setPosition("hook",xPos,yPos+10);
    }
    //D
    else if((keyCode == 100) && (xPos+1<190)){
      setPosition("hook", xPos+5,yPos);
    }
    
    setSize("line",getXPosition("castFishingRod")- getXPosition("hook")+120,getYPosition("hook")- getYPosition("castFishingRod")-70);
    setPosition("line",getXPosition("hook")+8 ,getYPosition("castFishingRod")+85);
  }
}
  //Returns a randomized Y value in a range according to each fish
function randomYPos(type){
  if(type=="blue"){
    return(randomNumber(285,300));
  }
  else if(type=="yellow"){
    return(randomNumber(280+40,280+80));
  }
  else if(type == "red"){
    return(randomNumber(280+90,280+140));
  }
  
}
  //Moves and creates the fish based on whether they are caught or if the game starts. Deletes if screen changes.
function manageFish(){
  //var xPosition= randomNumber(0,240);
  //var yPosition = randomNumber(280,440);

  if(screenID == "GameStart"){
    if(typeCaught == "blueFish" || (isCaught == false && isReeling == false)){
      //Stops a fish at hook when hooked
      if(isReeling == true){
        stopTimedLoop(blueFish);
      }
      //Only called when a fish is deleted(Either caught or game starts). Creates and moves fish.
      image("blueFish","assets/bluefishv2.png");
      setPosition("blueFish", randomNumber(0,160),randomYPos("blue"),80,30);
      blueFish = timedLoop(randomNumber(10,20),function(){
        moveFish("blueFish");
      });
    }
    
    if(typeCaught == "yellowFish" || (isCaught == false && isReeling == false)){
      if(isReeling == true){
        stopTimedLoop(yellowFish);
      }
      image("yellowFish","assets/yellowfishv2.png");
      setPosition("yellowFish", randomNumber(0,160),randomYPos("yellow"),100,40);
      yellowFish = timedLoop(randomNumber(10,20),function(){
        moveFish("yellowFish");
      });
    }
    
    if(typeCaught == "redFish" || (isCaught == false && isReeling == false)){
      if(isReeling == true){
        stopTimedLoop(redFish);
      }
      image("redFish","assets/redfishv2.png");
      setPosition("redFish", randomNumber(0,160),randomYPos("red"),100,40);
      redFish = timedLoop(randomNumber(10,20),function(){
        moveFish("redFish");
      });
    }
  }
  //stops and removes fish on quit/game end. Reduces lag and stops fish from appearing on other screens.
  else if(screenID!="GameStart"){
    stopTimedLoop(blueFish);
    stopTimedLoop(yellowFish);
    stopTimedLoop(redFish);
    removeFish();
    }
  
}

function removeFish(){
  if(isSpawned==true){
    deleteElement("blueFish");
    deleteElement("yellowFish");
    deleteElement("redFish");
    isSpawned = false;  
  }
  
}

function moveFish(name){
  //If a fish is not on the hook, check if it should be
  if(isReeling == false){
      detectCatch(name);
  }
  //tells the program which slot a fish's direction goes into the direction array.
  //In direction[] 0 is left 1 is right
  var direcArrayPos;
  //reduces typing
  var xPos = getXPosition(name);
  var yPos = getYPosition(name);
  if(name == "blueFish"){
    direcArrayPos = 0;
  }
  else if(name == "yellowFish"){
    direcArrayPos = 1;
  }
  else{
    direcArrayPos = 2;
  }
  //If a fish is not caught and it is moving left, continue moving left
  if(direction[direcArrayPos]===0 && typeCaught != name){
    if((xPos-1)>0 && (xPos-1)< 160){
      setPosition(name,xPos-2,yPos);
    }
    //if it cannot move any more left(boundary met) flip image an go right
    else{
      direction[direcArrayPos]=1;
      if(name=="blueFish"){
        setProperty("blueFish","image","assets/blueflip.png");
      }
      else if(name=="yellowFish"){
        setProperty("yellowFish","image","assets/yellowfishv2.png");
      }
      else{
        setProperty("redFish","image","assets/redfishv2.png");
      }
    }
    
  }
  //vice versa of above if statement
  else if(direction[direcArrayPos]==1 && typeCaught != name){
    if((xPos+1)>0 && (xPos+1)< 160){
      setPosition(name,xPos+2,yPos);
    }
    else{
      direction[direcArrayPos]=0;
      if(name=="blueFish"){
        setProperty("blueFish","image","assets/bluefishv2.png");
      }
      else if(name=="yellowFish"){
        setProperty("yellowFish","image","assets/yellowflip.png");
      }
      else{
        setProperty("redFish","image","assets/redflip.png");
      }
    }
  }
  //If a fish is hooked, set its position to the hook. When reeled in the x direction, set its image upward.
  //isCaught means that the fish is fully reeled in. 
  //I must check b/c the fish will be deleted- moving a nonexistantId causes errors.
  else{
    if(name=="blueFish" && isCaught == false){
      if(getXPosition(name)<130){
        setProperty(name,"image","assets/blueflip.png");
        setPosition(name, getXPosition("hook")-60,getYPosition("hook")-10);
      }
      else{
        setProperty(name,"image","assets/bluefishUp.png");
        setProperty(name, "width",30);
        setProperty(name,"height",80);
        setPosition(name, getXPosition("hook")-20,getYPosition("hook")-20);
      }
    }
    else if(name=="yellowFish" && isCaught == false){
      if(getXPosition(name)<130){
        setProperty(name,"image","assets/yellowfishv2.png"); 
        setPosition(name, getXPosition("hook")-60,getYPosition("hook"));
      }
      else{
        setProperty(name,"image","assets/yellowfishUp.png");
        setProperty(name, "width",40);
        setProperty(name,"height",100);
        setPosition(name, getXPosition("hook")-20,getYPosition("hook")-20);
      }
    }
    else if (name == "redFish" && isCaught == false){
      if(getXPosition(name)<130){
        setProperty(name,"image","assets/redfishv2.png");  
        setPosition(name, getXPosition("hook")-60,getYPosition("hook"));
      }
      else{
        setProperty(name,"image","assets/redfishUp.png");
        setProperty(name, "width",40);
        setProperty(name,"height",100);
        setPosition(name, getXPosition("hook")-20,getYPosition("hook")-20);
      }
    }
  }
}
  //Checks if the hook and fish have collided, checks tension before reeling/breaking line.
function detectCatch(name){
  //PART OF THIS FUNCTION IS NOT ORIGINAL WORK
  //Unoriginal work begins here
  if(isCast==true && isSpawned == true){
    var nameHeight = getProperty(name,"height");
    var nameWidth = getProperty(name, "width");
    var nameY = getProperty(name, "y");
    var nameX = getProperty(name, "x");
    var hookHeight = getProperty("hook", "height");
    var hookWidth = getProperty("hook","width");
    var hookY = getProperty("hook", "y");
    var hookX = getProperty("hook", "x");
    
    //checks image and hook collided
    if((hookY+hookHeight-20>=nameY  && hookY<=nameY+nameHeight-20) && (hookX+hookWidth-20>=nameX && hookX<=nameX+nameWidth-20) && isReeling == false){
    //End of non-original work     
      isReeling = true;
      typeCaught = name;
      reelCaughtFish = timedLoop(10,function(){
        //checks if tension is in green/orange before reelin in the x direction
        if(getXPosition("hook")<190 && tension >=20 && tension <=80 && tension!=false){
          setPosition("hook", getXPosition("hook")+2,getYPosition("hook"));
          setSize("line",getXPosition("castFishingRod")- getXPosition("hook")+120,getYPosition("hook")- getYPosition("castFishingRod")-70);
          setPosition("line",getXPosition("hook")+5 ,getYPosition("castFishingRod")+85);
        }
        else{
          //Reels in Y direction once hook reaches land
          if(getYPosition("hook")>170 && tension >=20 && tension <=80 && tension!=false){
            setPosition("hook",getXPosition("hook"),getYPosition("hook")-2);
            setSize("line",getXPosition("castFishingRod")- getXPosition("hook")+120,getYPosition("hook")- getYPosition("castFishingRod")-70);
            setPosition("line",getXPosition("hook")+5 ,getYPosition("castFishingRod")+85);
          }
          //Resets rod/fish and adds to the score, telling the updateTrackers() function what fish was caught etc.
          else if(getYPosition("hook")<=170){
            numberCaught= numberCaught+1;
            isCaught = true;
            deleteElement(name);
            manageFish();
            stopTimedLoop(reelCaughtFish);
            updateTrackers();
            resetRod();
          }
          //If line breaks, tells updateTrackers() function what happened b4 resetting
          else if((tension < 20 || tension > 80) && tension!=false){
            deleteElement(name);
            lineCondition = "broken";
            manageFish();
            stopTimedLoop(reelCaughtFish);
            updateTrackers();
            resetRod();
          }
        }
      });
    }
  }
}
  //Moves the tension meter and tells when to show it
function manageTension(keyCode){
  //0 is left 1 is right
  //if the loop is not running(initiates it)
  if(tensionLoop == false){
    tensionLoop = timedLoop(10,function(){
      //if a fish is hooked, show the meter
      if(isReeling == true && typeCaught != null){
        showElement("tensionBackground");
        showElement("tension");
      }
      else{
        hideElement("tensionBackground");
        hideElement("tension");
      }
      //Stop the tension from moving if user has pressed spacebar
      if(isReeling == true && tension != false){
        
      }
      //Otherwise move the tension meter to the right(if in bounds).
      else if(getProperty("tension","value")+1<=100 && direction[3] == 1){
        if(numberCaught<=7){
          //Increase the speed of the tension meter(and difficulty) for the first 7 fish
          setProperty("tension","value", getProperty("tension","value") +(1+(numberCaught/3)));
        }
        else{
          setProperty("tension","value", getProperty("tension","value")+3);
        }
        
      }
      //Same as above, for moving the tension bar left
      else if(getProperty("tension","value")-1>=0 && direction[3] === 0){
        if(numberCaught<=7){
          setProperty("tension","value", getProperty("tension","value") -(1+(numberCaught/3)));
        }
        else{
          setProperty("tension","value", getProperty("tension","value")-3);
        }
      }
      //If the tension bar cannot go any more left, change its direction to right and vice versa
      else{
        if(direction[3] == 1){
          direction[3] = 0;
        }
        else{
          direction[3] = 1;
        }
      }
    });
  }
  //If the user presses space and a fish is on the hook, set tension to current value
  if(isReeling==true && keyCode == 32 && tension == false){
    tension = getProperty("tension","value");
  }
    
}
  // Keeps track and updates money,score based on conditions at the time
function updateTrackers(){
  //Stops the game at 0 dollars or 25 fish caught
  if(money <= 0 || numberCaught==15){
    if(numberCaught == 15){
      gameScore = gameScore+10;
    }
    switchScreen();
    resetRod;
    manageFish(); 
    if(money<=0){
      setText("moneyTracker", "$$$: 0");
      console.log("You ran out of money");
    }
    else if(numberCaught == 15){
      console.log("You caught 15 fish- a good day's work!");
    }
    
  }
  //Gives appropiate amount of money/score based on specific fish caught
  else if(isCaught == true &&isReeling == true){
    gameScore = gameScore+10;
    setText("scoreTracker", "SCORE: " + gameScore);
    if(typeCaught == "blueFish"){
      money = money+5;
      setText("moneyTracker", "$$$: " + money);
    }
    else if(typeCaught == "yellowFish"){
      money = money+10;
      setText("moneyTracker", "$$$: " + money);
    }
    else if(typeCaught == "redFish"){
      money = money+15;
      setText("moneyTracker", "$$$: " + money);
    }
  }
  //Deducts money if the line breaks. More money lost after 10th fish caught
  else if(lineCondition == "broken" && isReeling == true){
    if(numberCaught<= 10){
      isReeling = false;
      money = money-10;
      setText("moneyTracker", "$$$: " + money);
      updateTrackers();
    }
    else{
      isReeling = false;
      money = money-20;
      setText("moneyTracker", "$$$: " + money);
      console.log("You now lose 20 dollars if the line breaks!");
      updateTrackers();
    }
  }
  //Deducts money and reels in the hook if reeled to the ground
  else if((isCast==true) && (getXPosition("hook")>=190) && (isReeling == false)){
    isReeling = true;
    reelHook = timedLoop(10,function(){
      if(getYPosition("hook")>150){
        setPosition("hook",getXPosition("hook"),getYPosition("hook")-2);
        setSize("line",getXPosition("castFishingRod")- getXPosition("hook")+120,getYPosition("hook")- getYPosition("castFishingRod")-70);
      }
    });
    reelHook;
    setTimeout(function(){
      stopTimedLoop(reelHook); 
      money = money-10;
      resetRod(); 
      updateTrackers();
    },1000);
  }
  //Otherwise, continue to update the score(redundant or used if money goes negative)
  else{
    if(money == 0){
      setText("moneyTracker","$$$: 0");
    }
    else{
      setText("moneyTracker", "$$$: " + money);
      setText("scoreTracker", "SCORE: " + gameScore);
    }
    
  }
}

//OnEvents
onEvent("helpButton", "click",function(event){
  showInstructions();
});
onEvent("playButton", "click", function(event) {
  //Initiates the water fillin pond animation
  hideHomeElements();
  
  setTimeout(function() {
    screenID="fillwater1";
    setScreen("fillwater1");  
    }, 700);
  //Updates variables so that the game knows which screen it on and updates score
  setTimeout(function() {
    screenID="GameStart";
    setScreen("GameStart");
    updateTrackers();
  }, 1500);
  //Creates fish and initiates tension meter.
  setTimeout(function() {
    manageFish();
    manageTension();
    isSpawned= true;

  }, 2000);

});
//Switches screen from scores to home
onEvent("scoretohome", "click", function(event) {
  switchScreen();
});
//Switches the screen to scores
onEvent("scoreButton", "click", function(event) {
  switchScreen();
});
//Listens for user inputs. This includes quitting, casting, reeling 
onEvent("GameStart", "keypress", function(event) {
  if(event.keyCode==113){
    screenID= "HomeScreen";
    showHomeElements();
    setScreen("HomeScreen");
    manageFish();
    resetRod();
    gameScore = 0;
    money = 20;
  }
  else if(event.keyCode==32 && isCast==false){
    castRod();
  }
  manageHook(event.keyCode);
  manageTension(event.keyCode);
});
//Listens for the pressing of "Q", which quits to home
onEvent("Scores", "keypress", function(event) {
  //make part of Switchscreen 
  if(event.keyCode==113){
    isCast=false;
    screenID= "HomeScreen";
    showHomeElements();
    setScreen("HomeScreen");
    gameScore = 0;
    money = 20;
  }
  
});
//main

  //a lightweight timed loop that doesn't stop. Animates water on GameStart.
var animatedWater = timedLoop(1500,function(){
  //0 is left 1 is right
  if(screenID == "GameStart"){
    if(direction[5]==0){
      setPosition("wateringame",getXPosition("wateringame")+10,getYPosition("wateringame"));
      direction[5] = 1;
    }
    else{
      setPosition("wateringame",getXPosition("wateringame")-10,getYPosition("wateringame"));
      direction[5] = 0;
    }
  }
});



