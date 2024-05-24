Qualtrics.SurveyEngine.addOnload(function() {
  // Initialization of variables
  $(document).ready(function() { 
    var risk = 1; // 0 = ambiguity, 1 = risk
    var highAmountOfMoney = 0; // 0 or 1 (This is for either high or low SRP) 
    var round = 0;
    var total = 0;
    var last_win = 0;
    var present_win = 0;
    var rounds_played = 5;
    var totalBoxesClicked = 0;
    var bombsClicked = 0;
    var gameEnabled = 0;
    var totalBoxesClickedArr = [];
    var bombsClickedArr = [];
    var nBombsArr = [];
    var beliefArr = [];
    var gameState = 0; // 0 = game, 1 = beliefQuestion
    var payoutRoundOneBasedIndex = Math.floor(Math.random() * rounds_played) + 1;
    var nBombs = risk === 0 ? Math.floor(Math.random() * 3) : 1;

    // Initialize language variables
    var label_collect = 'Collect Money';
    var label_balance = 'Bank Account:';
    var label_last = 'Gain last round:';
    var label_currency = '£';
    var label_times = ' Times';
    var label_header = 'Round ';
    var label_gonext1 = 'Start next round';
    var label_gonext2 = 'End Game';
    var label_gobelief = 'Continue';
    var message2 = highAmountOfMoney === 0 ? 'Another participant earned X£' : 'Another participant earned Y£'; // this is the Social reference point (please edit) 
    var messageBelief = 'Assign percentage points to each of the 3 alternatives listed below and ensure they sum up to 100%.'; // (This is the belief elicitation tasks, only shown in the ambiguity condition) 

    // Display initial labels
    $('#collect').html(label_collect);
    $('#total_term').html(label_balance);
    $('#total_value').html(total + label_currency);
    $('#last_term').html(label_last);
    $('#last_value').html(last_win + label_currency);
    $('#present_value_term').html('Potential gain if you don`t click on a bomb:');
    $('#present_times_term').html('Number of collected boxes:');
    $('#present_value').html(present_win + label_currency);
    $('#present_times').html(totalBoxesClicked + label_times);
    $('#tblBelief').hide();

    // Function to initialize the game table
    var initTbl = function() {
      totalBoxesClicked = 0;
      bombsClicked = 0;
      var nCols = 10;
      var nRows = 10;
      var bombsIdx = [];

      for (var i = 0; i < nBombs; i++) {
        var bombIdx = Math.floor(Math.random() * nCols * nRows);
        if (bombsIdx.includes(bombIdx)) {
          i--;
        } else {
          bombsIdx.push(bombIdx);
        }
      }

      var tbl = document.getElementById("tbl");
      tbl.innerHTML = "";
      for (var i = 0; i < nRows; i++) {
        var row = tbl.insertRow(0);
        for (var j = 0; j < nCols; j++) {
          var cell = row.insertCell(j);
          cell.classList.add("box", "boxUnclicked");
          if (bombsIdx.includes(i * nRows + j)) {
            cell.classList.add("isBomb");
          } else {
            cell.classList.add("isNoBomb");
          }
        }
      }
    };

    // Event handlers for clicking on boxes
    $('#tbl').on('click', '.isNoBomb', function() {
      if (gameEnabled > 0) {  
        $(this).removeClass("isNoBomb boxUnclicked").addClass("boxClicked");
        totalBoxesClicked++;
        present_win += 0.10; // THIS ADDS 10 pens for each click (MONEY) 
        show_present_earns();
        show_present();
      }
    });

    $('#tbl').on('click', '.isBomb', function() {
      if (gameEnabled > 0) {
        $(this).removeClass("isBomb boxUnclicked").addClass("boxClicked wasBomb");
        totalBoxesClicked++;
        bombsClicked++;
        present_win += 0.10; // THIS ADDS 10 pens for each click (MONEY) 
        show_present_earns();
        show_present();
      }
    });

    // Function to stop the game
    var gameStop = function() {
      gameEnabled = 0;
      $('.isBomb, .wasBomb').html("");
    };

    // Function to start a new round
    var new_round = function() {
      if (risk === 0) {
        nBombs = Math.floor(Math.random() * 3);
      }
      nBombsArr.push(nBombs);    
      gameEnabled = 1;
      $('#gonext, #message').hide();
      $('#collect, #press').show();
      if (round === 0) {
        $('#message2').html(message2).show();
      } else {
        $('#message2').html("<br />");
      }
      $('#present_times, #present_value').show();
      round++;
      last_win = present_win;
      initTbl();
      present_win = 0;
      show_present_earns();
      show_present();
      $('#round').html('<h2>' + label_header + round + '<h2>');
      $('#present_round').show();
      $('#outcomes').hide();
      $('#NextButton').hide();
    };

    // Function to end the game
    var end_game = function() {
      $('#total, #collect, #ballon, #press, #message2, #gonext, #round, #present_round, #last_round').remove();
      $('#goOn').show();
      $('#tbl').hide();
      $('#message').html("<p>The game ends. Round " + payoutRoundOneBasedIndex + " was randomly selected for payout. You earned " + total.toFixed(1) + " £. </p><p>Click on <i>the lower arrow</i> to continue with the questionnaire.</p>").show();
      $('#outcomes').show();
      $('#NextButton').show();
      Qualtrics.SurveyEngine.setEmbeddedData('risk', risk);
      Qualtrics.SurveyEngine.setEmbeddedData('highAmountOfMoney', highAmountOfMoney);
      Qualtrics.SurveyEngine.setEmbeddedData('totalBoxesClickedArr', totalBoxesClickedArr.join());
      Qualtrics.SurveyEngine.setEmbeddedData('bombsClickedArr', bombsClickedArr.join());
      Qualtrics.SurveyEngine.setEmbeddedData('nBombsArr', nBombsArr.join());
      Qualtrics.SurveyEngine.setEmbeddedData('total_win', total);
      Qualtrics.SurveyEngine.setEmbeddedData('payoutRoundOneBasedIndex', payoutRoundOneBasedIndex);
      Qualtrics.SurveyEngine.setEmbeddedData('beliefArr', beliefArr.join());    
    };

    // Function to display the next round button
    var gonext_message = function() {
      $('#gonext').html(round < rounds_played ? label_gonext1 : label_gonext2).show();
    };

    // Function to show present values
    var show_present_earns = function() {
      $('#present_value').html(present_win.toFixed(1) + label_currency);
    };

    var show_present = function() {
      $('#present_times').html(totalBoxesClicked + label_times);
    };

    // Collect button functionality
    $('#collect').click(function() {
      if (gameState === 0) {
        if (totalBoxesClicked === 0) {
          alert('You can only collect the money once you click on a box.');
        } else {
          gameStop();
          totalBoxesClickedArr.push(totalBoxesClicked);
          bombsClickedArr.push(bombsClicked);
          if (bombsClicked > 0) {
            present_win = 0;
          }
          if (round === payoutRoundOneBasedIndex) {
            total = present_win;
          }
          if (risk === 0) {
            gameState = 1;
            $('#tbl').hide();
            $('#message2').html(messageBelief).show();
            $('#belief0, #belief1, #belief2').val(0);
            $('#tblBelief').show();
            $('#collect').html(label_gobelief);
          } else {
            $('#message').html("<p>You clicked on a total of " + totalBoxesClicked + " boxes, containing " + bombsClicked + " bomb(s).</p>").show(); // IF NO FEEDBACK EDIT THIS PART TO NOT SHOW IF BOMB Was collected 
            gonext_message();
            $('#collect').hide();
          }
        }
      } else {
        var beliefSum = parseInt($('#belief0').val()) + parseInt($('#belief1').val()) + parseInt($('#belief2').val());
        if (beliefSum !== 100) {
          alert('The sum is not 100, please revise your answer.');
        } else {
          beliefArr.push(parseInt($('#belief0').val()), parseInt($('#belief1').val()), parseInt($('#belief2').val()));
          $('#tblBelief, #message2').hide();
          $('#collect').html(label_collect).hide();
          $('#tbl').show();
          $('#message').html("<p>You clicked on a total of " + totalBoxesClicked + " boxes, containing " + bombsClicked + " bombs. There were " + nBombs + " bombs in total.</p>").show();
          gonext_message();
          gameState = 0;
        }
      }
    });

    // Start the next round or end the game
    $('#gonext').click(function() {
      if (round < rounds_played) {
        $('#collect').show();
        new_round();
      } else {
        end_game();
      }
    });

    // Start the game
    new_round();

  });
});

Qualtrics.SurveyEngine.addOnReady(function() {
  // Code to run when the page is fully displayed
});

Qualtrics.SurveyEngine.addOnUnload(function() {
  // Code to run when the page is unloaded
});
