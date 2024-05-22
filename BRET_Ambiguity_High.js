Qualtrics.SurveyEngine.addOnload(function()
{
  /Place your JavaScript here to run when the page loads/
  
  $(document).ready(function() { 
    
    // initialize values
	
	var risk = 0; // 0 = ambiguity, 1 = risk
	var highAmountOfMoney = 1; // 0 or 1
	  
	
	  
    var round = 0;
  
    var total = 0; // money that has been earned in total
    var x = total;
    var last_win = 0; // initialize variable that contains the win of the previous round
    var present_win = 0; //initialize variable of win in present around
    var rounds_played = 5;
    
    var totalBoxesClicked = 0;
    var bombsClicked = 0;
    var gameEnabled = 0;
    
    var totalBoxesClickedArr = [];
    var bombsClickedArr = [];
    var nBombsArr = [];
    var beliefArr = [];
	  
	var gameState = 0; // 0 = game, 1 = beliefQuestion
    
	// this round will be used for payout
    var payoutRoundOneBasedIndex = Math.floor(Math.random() * rounds_played)+1;
	 
     var nBombs = 1;
     if (risk == 0) { // ambiguitiy // see also function new_round
		  nBombs =  Math.floor(Math.random() * 3);
     }

	  
    // initialize language
    var label_collect = 'Collect Money';
    var label_balance = 'Bank Account:'; // AARON ich würde eher zufällig eine der 5 Runden ausbezhalen daher ist diese Variable (Summe do Gewinne) ned wirklich relevant..... Erledigt
    var label_last = 'Gain last round:';
    var label_currency = ' £';
    var label_times=' Times';
    var label_header = 'Round ';
    var label_gonext1 = 'Start next round';
    var label_gonext2 = 'End Game';
    var label_gobelief = 'Continue';
	 
	var message2 = "";
	if (risk == 0) { // ambiguity
		if (highAmountOfMoney == 0) {
			message2 =  'Now the first round of the game starts. You can click as many boxes as you like.<b> <br>Another participant who has completed the same task as you before has earned 2£</b> ';
		}
		else {
			message2 =  'Now the first round of the game starts. You can click as many boxes as you like.<b>  <br>Another participant who has completed the same task as you before has earned 6£</b> ';
		}
	}
	else { // risk
		if (highAmountOfMoney == 0) {
			message2 = ' In a previous study, another person did not play the game, but received a fixed amount of 2£'; 
		}
		else {
			message2 =  'In a previous study, another person did not play the game, but received a fixed amount of 5£';
		}
	}
	
	var messageBelief = "How many bombs do you think are hidden in the matrix in this round? How likely do you think is it that there are zero, one, or two bombs? Please assign percentage points to each of the 3 alternatives listed below and make sure that they sum up to 100%. If you think that one of these alternatives occurs for sure, assign all 100% to this alternative and 0% to the other alternatives.";
	  
    var label_present_time = 'Number of collected boxes:';
    var label_present_value = 'Potential gain if you don`t click on a bomb:';		
    
    // initialize labels 
    //$('#press').html(label_press); 
    $('#collect').html(label_collect);
    $('#total_term').html(label_balance);
    $('#total_value').html(total+label_currency);
    $('#last_term').html(label_last);
    $('#last_value').html(last_win+label_currency);
    $('#present_value_term').html(label_present_value);
    $('#present_times_term').html(label_present_time);
    $('#present_value').html(present_win+label_currency);
    //$('#present_times').html(pumpmeup+label_times);
    $('#present_times').html(totalBoxesClicked+label_times);
    //$('#outcomes').html(number_pumps);
	  
	 $('#tblBelief').hide();
    
    // below: create functions that define game functionality
    var initTbl = function(){
      totalBoxesClicked = 0; // reset on restart
      bombsClicked = 0; // reset on restart

      var nCols = 10;
      var nRows = 10;

      var i;
      var j;
      
      var bombsIdx = [];
      for (i=0; i<nBombs; i++) {
        var bombIdx = Math.floor(Math.random() * nCols*nRows);
        if (bombsIdx.includes(bombIdx)) {
          i--;
        }
        else {
          bombsIdx.push(bombIdx);
        }
      }
      var tbl = document.getElementById("tbl");
      tbl.innerHTML = ""; // clear table on restart
      for (i=0; i<nRows; i++) {
        var row = tbl.insertRow(0);
        for (j=0; j<nCols; j++) {
          var cell = row.insertCell(j);
          cell.classList.add("box");
          cell.classList.add("boxUnclicked");
          if (bombsIdx.includes(i*nRows+j)) {
            cell.classList.add("isBomb");
          }
          else {
            cell.classList.add("isNoBomb");
          }
        }
      } 
    }
    
    $('#tbl').on('click', '.isNoBomb', function(){
      if (gameEnabled > 0) {  
        $(this)[0].classList.remove("isNoBomb"); // prevent multiple clicks on same box
        $(this)[0].classList.remove("boxUnclicked");
        $(this)[0].classList.add("boxClicked");
        totalBoxesClicked++;
        present_win +=0.10;
        show_present_earns();
        show_present();
      }
    });

    $('#tbl').on('click', '.isBomb', function(){
      if (gameEnabled > 0) {
        $(this)[0].classList.remove("isBomb"); // prevent multiple clicks on same box
        $(this)[0].classList.remove("boxUnclicked");
        $(this)[0].classList.add("boxClicked");
        $(this)[0].classList.add("wasBomb");
        //elemnt.innerHTML = "X"; // uncomment this if you want to immediately show the bomb when you clicked on it
        totalBoxesClicked++;
        bombsClicked++;
        present_win +=0.10;
        show_present_earns();
        show_present();
      }
    });
    
    

    var gameStop = function() {
      gameEnabled = 0;
      // show the bomb(s)
      var bombs = document.getElementsByClassName("isBomb")
      var i;
      for (i=0; i<bombs.length; i++) {
        bombs[i].innerHTML = "";
      }
      var bombs = document.getElementsByClassName("wasBomb")
      var i;
      for (i=0; i<bombs.length; i++) {
        bombs[i].innerHTML = "";
      }
      
      //alert("You clicked on a total of "+totalBoxesClicked+" boxes and hit "+bombsClicked+" bombs");
    }
    
    // what happens when a new round starts
    var new_round = function() {
	  if (risk == 0) { // ambiguitiy
		  nBombs =  Math.floor(Math.random() * 3);
	  }
	  nBombsArr.push(nBombs);	
		
      gameEnabled = 1;
      //console.log(number_pumps);
      //console.log(exploded);
      $('#gonext').hide();
      $('#message').hide();  
      $('#collect').show();
      $('#press').show();
	  if (round == 0) {
        $('#message2').html(message2).show();
	  }
      else {
	  	$('#message2').html("<br />");
	  }
      $('#present_times').show();
      $('#present_value').show();
      round += 1;
      last_win = present_win;
      //show_last();
      initTbl();
      present_win = 0;
      show_present_earns();
      show_present();
      //$('#ballon').width(size); 
      //$('#ballon').height(size);
      $('#ballon').show();
      $('#round').html('<h2>'+label_header+round+'<h2>');
      $('#present_round').show();
      $('#outcomes').hide();
      $('#NextButton').hide();
    };
    
    // what happens when the game ends
    var end_game = function() {
      $('#total').remove();
      $('#collect').remove();
      $('#ballon').remove();
      $('#press').remove();
      $('#message2').remove();
      $('#gonext').remove();
      $('#round').remove();
      $('#present_round').remove();
      $('#last_round').remove();
      $('#goOn').show();
	
	  $('#tbl').hide();
		
	  
      $('#message').html("<p>The game ends. Round "+payoutRoundOneBasedIndex+" was randomly selected for payout. You earned "+total.toFixed(1)+" £. </ p> <p>Klick on <i> the lower arrow </ i> to continue with the questionnaire. </ p>").show();
		
      $('#outcomes').show();
      $('#NextButton').show();
		
      Qualtrics.SurveyEngine.setEmbeddedData('risk',risk);
      Qualtrics.SurveyEngine.setEmbeddedData('highAmountOfMoney',highAmountOfMoney);
      Qualtrics.SurveyEngine.setEmbeddedData('totalBoxesClickedArr',totalBoxesClickedArr.join());
      Qualtrics.SurveyEngine.setEmbeddedData('bombsClickedArr',bombsClickedArr.join());
      Qualtrics.SurveyEngine.setEmbeddedData('nBombsArr',nBombsArr.join());
      Qualtrics.SurveyEngine.setEmbeddedData('total_win',total);
      Qualtrics.SurveyEngine.setEmbeddedData('payoutRoundOneBasedIndex',payoutRoundOneBasedIndex);
      Qualtrics.SurveyEngine.setEmbeddedData('beliefArr',beliefArr.join());				
	};
   
    
    // show button that starts next round
    var gonext_message = function() {
      if (round < rounds_played) {
        $('#gonext').html(label_gonext1).show();
      }
      else {
        $('#gonext').html(label_gonext2).show();
      }
    };
    var gobelief_message_ambiguity = function() {
      $('#gobelief').html(label_gonext3).show();
    };
    
    // add money to bank
    var increase_value = function() {
     $('#total_value').html(total+label_currency);/////hier geändert $('#total_value').html(total+label_currency);
    };
    
    var show_last = function() {
      $('#last_value').html(last_win+label_currency);
    };
    var show_present=function(){
      $('#present_times').html(totalBoxesClicked+label_times)
    }
    var show_present_earns=function(){
      $('#present_value').html(present_win.toFixed(1)+label_currency)
    }
    
    // button functionalities
    // collect button: release pressure and hope for money
    $('#collect').click(function() {
      if (gameState == 0) {
		  if (totalBoxesClicked == 0) {
			alert('you can only collect the money once you click on a box ');
		  }
		  else {
			gameStop();
			totalBoxesClickedArr.push(totalBoxesClicked);
			bombsClickedArr.push(bombsClicked);
			if (bombsClicked > 0) {
			  present_win = 0;
			  //show_present_earns();
			}
			if (round == payoutRoundOneBasedIndex) {
				total = present_win;
			}
			//increase_value();*/
			if (risk == 0) { // ambiguity
				gameState = 1;
		        $('#tbl').hide();
		        $('#message2').html(messageBelief).show();
				$(belief0).val(0);
				$(belief1).val(0);
				$(belief2).val(0);
				$('#tblBelief').show();
				$('#collect').html(label_gobelief);

			}
			else { // risk
				$('#message').html("<p>You clicked on a total of "+totalBoxesClicked+" boxes, containing  "+bombsClicked+" bombs.</p>").show();
				gonext_message();
		        $('#collect').hide();
			}
		 }
      }
	  else { // belief finished
		  if (((parseInt($(belief0).val())+parseInt($(belief1).val())+parseInt($(belief2).val())) != 100)&((parseInt($(belief0).val())+parseInt($(belief1).val())+parseInt($(belief2).val())) != 99)) {
			  alert('The sum is not 100, please revise your answer.');
		  }
		  else {
			   beliefArr.push(parseInt($(belief0).val()));
			   beliefArr.push(parseInt($(belief1).val()));
			   beliefArr.push(parseInt($(belief2).val()));

			   $('#tblBelief').hide();
			   $('#message2').hide()
			   $('#collect').html(label_collect);
			   $('#collect').hide();
			   $('#tbl').show();
			   $('#message').html("<p>You clicked on a total of "+totalBoxesClicked+" boxes, containing  "+bombsClicked+" bomb(s). There were "+nBombs+" bomb(s) in total.</p>").show();
			  gonext_message();
			  gameState = 0;
		  }
	  }
    
    });
	  
    
    // click this button to start the next round (or end game when all rounds are played)
    $('#gonext').click(function() {
      if (round < rounds_played) {
        $('#collect').show();
        new_round();
      }
      else {
        end_game();
      }
    });
    
    
    // start the game!
    new_round();
    
  });
  
});

Qualtrics.SurveyEngine.addOnReady(function()
{
  /Place your JavaScript here to run when the page is fully displayed/
    
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
  /Place your JavaScript here to run when the page is unloaded/
    
});
