$(function() {
	
	var form = $("#create-recipe-form");
	var formElement = form[0];
	var recipeList = $("#recipe-list");
	var addMoreInputs = $(".add-more-input");
	var tips = $('.validate-tips');
	var fileDrop = $('.foodie-file-drop');
	
	function cleanupForm() {
		formElement.reset();
		
		var parent = addMoreInputs.parent();
		addMoreInputs.remove();
		$('<div>', {
			'class':'add-more-input'
		}).addMoreInput({
			'class': 'add-more-input'
		}).appendTo(parent);
		
		fileDrop.filedrop("clear", {
			"labelClass": "foodie-drop-label"
		});
		
		clearErrors();
	}
	
	function createFormData() {
		var recipeItems = addMoreInputs.addMoreInput("getJson");
		addMoreInputs.addMoreInput("remove");
		var formData = new FormData(formElement); 
		formData.append("ingredients", recipeItems);
		return formData;
	}
	
	function validateIngredients() {
		var valid = true;
		addMoreInputs.each(function() {
			var quantityElement = $(this).children('.foodie-quantity-group').children('input.foodie-quantity');
			var quantityValue = quantityElement.val();
			var isValid = isNumber(quantityValue)
			if(!isNumber(quantityValue)) {
				quantityElement.addClass( "ui-state-error" );
				updateTips('Please enter a valid quantity');
				valid = false;
			}
		});
		return valid;
	}
	
	function clearErrors() {
		addMoreInputs.each(function() {
			var quantityElement = $(this).children('.foodie-quantity-group').children('input.foodie-quantity');
			quantityElement.val("").removeClass( "ui-state-error" );
		});
		tips.text('');
	}
	
	function updateTips( t ) {
		tips.text( t ).addClass( "ui-state-highlight" );
		setTimeout(function() {
			tips.removeClass( "ui-state-highlight", 1500 );
		}, 500 );
	}
	
	form.dialog({
	      autoOpen: false,
	      height: 600,
	      width: 450,
	      modal: true,
	      buttons: {
	    	Save: function() {
	    		
	    		if(!validateIngredients()) {
	    			return;
	    		}
	    		
	    		var formData = createFormData();
	    		$.ajax({
	    	        url: form.attr("action"),
	    	        type: 'POST',
	    	        data: formData,
	    	        //Options to tell JQuery not to process data or worry about content-type
	    	        cache: false,
	    	        contentType: false,
	    	        processData: false,
	    	        success: function(data) {
	    	        	recipeList.append(data);
	    	        	cleanupForm();
	    	        }
	    		});
	    		$(this).dialog("close");
	    	},
	        Cancel: function() {
	        	cleanupForm();
	          $( this ).dialog("close");
	        }
	      },
	      close: function() {
	    	  cleanupForm();
	      }
	});
	
	$(".create-recipe-button").click(function() {
		form.dialog( "open" );
		return false;
	})
	
	$(".add-more-input").addMoreInput({
		class:'add-more-input'
	});
	
	$(".foodie-file-drop").filedrop({
		'labelClass': 'foodie-drop-label'
	});
});