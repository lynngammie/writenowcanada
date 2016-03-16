	var civicMinded = {};
  // civicMinded.allResultsArray = [];
	civicMinded.apiURL = 'https://represent.opennorth.ca'
	// civicMinded.key = 'AIzaSyCPJiNp9WLhIaAVBYrpsPWqCluZWalWjj8';

	civicMinded.getInput = function(){
		$('#addressForm').on('submit',function(e){
			e.preventDefault();
			civicMinded.userName = $('#nameInput').val();
			civicMinded.userInput = $('#textInput').val();
			civicMinded.getLocation(civicMinded.userInput);
			civicMinded.govLevel = $('input[name="government"]:checked').val();
			civicMinded.userIssue = $('input[name="' + civicMinded.govLevel + '"]:checked').val();
      $('.everythingElse').css('display', 'block');
      $('html, body').animate({
        scrollTop: $(".everythingElse").offset().top
         }, 2000);
		});
	}

// 	function textAreaAdjust(o) {
//     o.style.height = "1px";
//     o.style.height = (25+o.scrollHeight)+"px";
// }


	// }
	//get the elected_office value from each matched set
	//make a function that compares municipal provincial or federal to MP, MPP/MLA, Councillor/Regional Councillor/Conseiller de la ville/Mayor.

	civicMinded.getLocation = function(query){
		
		$.ajax({
			url:"https://maps.googleapis.com/maps/api/geocode/json",
			type:'GET',
			dataType:'json',
			data: {
				address: query
			}
			}).then(function(answer){
				var userLat = answer.results[0].geometry.location.lat;
				var userLng = answer.results[0].geometry.location.lng;
				var userLatLng = userLat + ',' + userLng;
				// console.log(userLatLng);
				civicMinded.getInfo(userLatLng);
		});
	}
	
	civicMinded.getInfo = function(userLatLng){
		$.ajax({
      url: 'https://represent.opennorth.ca/representatives/?',
      method: 'GET',
      dataType: 'jsonp',
      data: {
          point: userLatLng,    
      }
     }).then(function(data) {
     	// var result = data.objects
     	civicMinded.filterResults(data.objects);
      console.log(data.objects);
 		});
  }

  civicMinded.filterResults = function(data) {

  	var comparator = {
  		municipal: ['councillor', 'mayor'],
  		provincial: ['mpp', 'mla'],
  		federal: ['mp']
  	}

  	var result = data.filter(function(val) {
  		for (var i = 0; i < comparator[civicMinded.govLevel].length; i++) {
  			return val.elected_office.toLowerCase() === comparator[civicMinded.govLevel][i]
  		}
  	});
  	civicMinded.showResults(result);
  }

  civicMinded.showResults = function(singleResult) {
  	// console.log(singleResult);
  	$('#chosenIssue').text(civicMinded.userIssue);
    //what if there is no name?
  	$('#electedOfficialName').text(singleResult[0].name);

  	var today = new Date();
  	var year = today.getFullYear();
  	var month = today.getMonth()+1;
  	if (month == 1){
  		month = 'January'
  	} else if (month == 2){
  		month = 'February'
  	} else if (month == 3){
  		month = 'March'
  	} else if (month == 4){
  		month = 'April'
  	} else if (month == 5){
  		month = 'May'
  	} else if (month == 6){
  		month = 'June'
  	} else if (month == 7){
  		month = 'July'
  	} else if (month == 8){
  		month = 'August'
  	} else if (month == 9){
  		month = 'September'
  	} else if (month == 10){
  		month = 'October'
  	} else if (month == 11){
  		month = 'November'
  	} else {
  		month = 'December'
  	}
  	var day = today.getDate();
  	var fullDate = month + ' ' + day + ', ' + year;
  	console.log(fullDate);
  	$('.todaysDate').text(fullDate);
  	$('.officialName').text(singleResult[0].name + ', ' + singleResult[0].elected_office);
  	// var findIfOffice = singleResult[0].offices;
  	// console.log(findIfOffice);
  	// if (findIfOffice.hasOwnProperty('postal') == true){
  	// 	console.log('TRUENESS');
  	// }
  	var postal = singleResult[0].offices[0].postal;
  	//if postal does not exist write some code to go into the second array if it exists to get the postal address
  	//OR if postal does not exist write in the address for queens park, etc
  	if (postal == undefined){
  		console.log('undefined');
  		$('.officialAddress').html('<textarea onkeyup="textAreaAdjust(this)" style="overflow:hidden" class="textareaAddress" rows="3" placeholder="' + singleResult[0].name + ' does not have a postal address in our system. Add the address here, or see email options below.">');
  	} else {
  		console.log('works')
  		var postalFormatted = postal.replace(/(\r\n|\n|\r)/gm, '<br/>');
  		// console.log(postalFormatted);
  		$('.officialAddress').html(postalFormatted);
  	}
  	//if postal has a value, save it as this variable. If postal is undefined add some 'address unavailable at this time' text or something...?
  	
  	var userArea = singleResult[0].district_name;
  	$('.officialGreeting').text('Dear Mr. / Ms. ' + singleResult[0].last_name + ',');
  	$('.letterOpener').html('I am writing to you concerning ' +  civicMinded.userIssue + '. As a constituent of ' +  userArea + ' I am writing to you directly concerning this issue; one that is very important to me. It is my hope that you will make an effort to bring about positive change in this area.');
  	$('#result').addClass('result_display');
  	$('.personalLetter').attr('placeholder','Write a paragraph or two detailing why ' + civicMinded.userIssue + ' is an issue that concerns you, and what actions you would like ' + singleResult[0].name + ' and his or her government to take in order to further the resolution of this issue.');
  	$('.letterQuestions').text('Do you have plans to work on a ' + civicMinded.govLevel + ' strategy concerning ' + civicMinded.userIssue + ' and the items that I have raised above? What actions will you take to make these plans be realized?');
  	$('.letterCloser').text('Thank you for your continued commitment to the ' + civicMinded.govLevel + ' government and the constituents of ' + userArea + '.');
  	$('.userName').text(civicMinded.userName);
  	$('.userAddress').text(civicMinded.userInput);
  	$('.printInstructions').html('You may send mail to MPs free of postage, providing that you are only sending printed material.');
  	$('.officialEmail').html('Rather send an email? Contact ' + singleResult[0].name + ' at <a href="mailto:' + singleResult[0].email + '">' + singleResult[0].email + '</a> or hit the button below to copy your letter to the clipboard. When your email client opens, hit ctrl/cmmd + v to paste.');
    $('.mailto').html('<a href="mailto:' + singleResult[0].email + '?subject=' + singleResult[0].district_name + ':%20' + civicMinded.userIssue + '" id="copyclip" data-clipboard-target="#result" value="COPY TO CLIPBOARD">SEND YOUR EMAIL</a>');
  }

  civicMinded.showIssues = function(){
  	$('.govSquare').on('click',function(){
  	});
  }

  civicMinded.cycleFacts = function(){

    var words = $(".fact-item");
    var wordIndex = -1;
    
    //add one to word index, 
    function showNextQuote() {
        ++wordIndex;
        words.eq(wordIndex % words.length)
            .fadeIn(1500)
            .delay(4000)
            .fadeOut(1500, showNextQuote);
    }
    showNextQuote();

  };

  civicMinded.print = function(){
    $('#printme').on('click', function(e){
      e.preventDefault();
      window.print();
    })
  };

  civicMinded.copyLetter = function(){
    $('#copyclip').on('click', function(e){
      e.preventDefault;
      var userText = $('#userPara').val();
      $('.userText').text(userText);
      $('.textForm').remove();
      $('.textareaAddress').remove();
      new Clipboard('#copyclip');
    })
    
  };

  civicMinded.smoothscroll = function(){
    $('a[href*=#]:not([href=#])').click(function() {
          if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html,body').animate({
                scrollTop: target.offset().top
              }, 1000);
              return false;
            }
          }
        });
  };

	civicMinded.init = function(){
		civicMinded.getInput();
		civicMinded.cycleFacts();
    civicMinded.print();
    civicMinded.copyLetter();
    civicMinded.smoothscroll();

    $('.hamburger').on('click', function(event){
      event.preventDefault();
      $('.hamburger-container').slideToggle();
    });

	}


	$(document).ready(function(){
		civicMinded.init();

	});