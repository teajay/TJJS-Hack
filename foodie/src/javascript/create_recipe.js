$(function() {
	
	var form = $("#create-recipe-form");
	var formElement = form[0];
	var recipeList = $("#recipe-list");
	
	function cleanupForm() {
		formElement.reset();
    	
		var addMoreInputsSelector = $('.add-more-input');
		var parent = addMoreInputsSelector.parent();
		addMoreInputsSelector.remove();
		$('<div>', {
			'class':'add-more-input'
		}).addMoreInput({
			'class': 'add-more-input'
		}).appendTo(parent);
	}
	
	function createFormData(addMoreInputSelector) {
		var recipeItems = addMoreInputSelector.addMoreInput("getJson");
		addMoreInputSelector.addMoreInput("remove");
		var formData = new FormData(formElement); 
		formData.append("ingredients", recipeItems);
		return formData;
	}
	
	form.dialog({
	      autoOpen: false,
	      height: 600,
	      width: 450,
	      modal: true,
	      buttons: {
	    	Save: function() {
	    		var formData = createFormData($(".add-more-input"));
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
});