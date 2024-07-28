//selectize options
var selectOptions = {
    valueField: 'id',
    labelField: 'title',
    searchField: 'title',
    create: true,
    persist: false,
    options: (function() {
        var optionArray = [];  
        for(var i = 0; i <= 50; i++) {
          optionArray.push({
            'id': i, 
            'title': i,
          });
        }
        return optionArray;
    })(),
    onInitialize: function() {
      //clear session storage if exists
      if(sessionStorage) {
        sessionStorage.clear();
      }
    }
}

//selectize callback function
var checkNumber = function(value, $item) { 
  var errorMessage = $('.input-error');
  //check if input is  number
  if(!$.isNumeric(value)) {
    errorMessage.show('fast');;
    this.clear();
    this.removeOption(value);
    this.focus();
    return;
  }  
  
  //get id of input and remove "-selectized"
  var inputID = this.$control_input[0].id;
  inputID = inputID.substring(0, inputID.indexOf('-selectized'));
  
  //add selected value as interget to session storage
  sessionStorage.setItem(inputID, value);
  
  //update price  
  var price = totalPrice(totalAccounts());
  $('.js-price').html(price);
  //clear error message if it displayed 
  if(errorMessage.css('display') === 'block') {
    errorMessage.hide();
  }  
}

//get total amount of accounts from session storage
function totalAccounts() {
  var total = 0;
  for(var i = 0; i < sessionStorage.length; i++) {
    var acctNum = sessionStorage.getItem(sessionStorage.key(i));
    total += parseInt(acctNum);
  }
  return total;
}

//calculate total price based of pricing table;
function totalPrice(amount) {
  var tier1Limit = 30; //max amount of accounts for tier
  var tier1Price = 10; //price of tier
  var tier1MaxPrice = 300; //max amount for tier 30 * 10
  var tier2Limit = 50;
  var tier2Price = 8;
  var tier2MaxPrice = 460;
  var tier3Limit = 70;
  var tier3Price = 7;
  var tier3MaxPrice = 600; 
  var tier4Limit = 90;
  var tier4Price = 6;
  var tier4MaxPrice = 720;
  var tier5Price = 5;
  
  if(amount <= tier1Limit) {
    return amount * tier1Price;
  }
  if(amount > tier1Limit && amount <= tier2Limit) {
    return  tier1MaxPrice + ((amount - tier1Limit) * tier2Price);
  }
  if(amount > tier2Limit && amount <= tier3Limit) {
    return  tier2MaxPrice + ((amount - tier2Limit) * tier3Price);
  }
  if(amount > tier3Limit && amount <= tier4Limit) {
    return  tier3MaxPrice + ((amount - tier3Limit) * tier4Price);
  }
  if(amount > tier4Limit) {
    return tier4MaxPrice + ((amount - tier4Limit) * tier5Price);
  }
}

//selectize stuffs
var fbSelectize = $('#fbAccounts').selectize(selectOptions);
var twitterSelectize = $('#twitterAccounts').selectize(selectOptions);
var instaSelectize = $('#instaAccounts').selectize(selectOptions);

var facebook = fbSelectize[0].selectize;
var twitter = twitterSelectize[0].selectize;
var instagram = instaSelectize[0].selectize;

facebook.on('item_add', checkNumber);
twitter.on('item_add', checkNumber);
instagram.on('item_add', checkNumber);

//debounce 
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

//Horse Tornado (carousel)
function carousel(slideClass, carouselClass, carouselWrap, animateTime) {
  var slide = $(slideClass);
  var slideWidth = slide.width();
  var slideHeight = slide.outerHeight();
  var containerWidth = $(carouselWrap).width();
  var margin = (containerWidth - slideWidth) / 2;
  var carouselWidth = $(carouselClass).width();
  var slideNum = slide.length;
  var animateTime = animateTime;

  //set carousel width and height
  $(carouselClass).width(slideNum * (slideWidth + margin));
  $(carouselClass).height(slideHeight + 40);
  //set margins on slide to center in container.
  if(margin > 0 ) {
    slide.css({
      marginLeft: margin,
      marginRight: margin
    });
  } else {
    slide.css({
      marginLeft: 0,
      marginRight: 0
    });
  }

  return {
    "next": function() {
      $(slideClass + ':last').css('margin-left', (margin + slideWidth) * -1);
      $(slideClass + ':first').before($(slideClass + ':last'));
      $(slideClass + ':first').animate({'margin-left': margin}, animateTime);
    },
    "previous": function(){
      $(slideClass + ':first').animate({ "margin-left": (slideWidth + margin) * -1 }, animateTime, function(){
            $(slideClass +':last').css('margin-left', margin);
            $(slideClass +':last').after($(slideClass +':first'));
            slide.css('margin-left', margin);
        }
      );
    }
  }
}

var priceNavButton = $('.price-nav-button');
var priceCalculator = $('.price-calculator');
var priceTable = $('.price-table');

function showPriceNav() {
  priceNavButton.addClass('show-button');
}

function hidePriceNav() {
  priceNavButton.removeClass('show-button');
}$('.features-prev').off('click');
	    $('.features-next').off('click');

function showCarousel() {
  if(priceNavButton.hasClass('show-button')) {
    var mobileHorseTornado = carousel('.price-table', '.price-calculator', '.price-calculator-wrap', '1000');
    $('.price-next').on('click', function() {
      mobileHorseTornado.next()
    });
  
    $('.price-prev').on('click', function() {
      mobileHorseTornado.previous();
    });
  }
}

var showNavButtons = debounce(function() {  
  priceNavButton.off('click');

  if($(window).width() < 768) {
    showPriceNav();
    priceCalculator.addClass('auto-width');
    priceTable.addClass('auto-margin');
  } else {
    hidePriceNav();
     if( priceCalculator.hasClass('auto-width')) {
      priceCalculator.removeClass('auto-width');
    }
    if( priceTable.hasClass('auto-margin')) {
      priceTable.removeClass('auto-margin');
    }
    priceCalculator.width('100%');
  }
  
  showCarousel();  
}, true);

$(window).resize(function() {
    showNavButtons();
  });
  
  if($(window).width() < 768) {
    showNavButtons();
    showCarousel();
  }