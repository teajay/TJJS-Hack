$(function() {
	
	var form = $("#create-recipe-form");
	var formElement = form[0];
	
	function cleanupForm() {
    	formElement.reset();
    	
    	var lastInput = $('.foodie-add-more-input').last();
    	var parent = lastInput.parent();
    	var clone = lastInput.clone();
    	$('.foodie-add-more-input').remove();
    	parent.append(clone);
    	clone.children().last().click(addAnotherInputHandler);
	}
	
	form.dialog({
	      autoOpen: false,
	      height: 600,
	      width: 400,
	      modal: true,
	      buttons: {
	    	Save: function() {
	    		var formData = new FormData(formElement); 
	    		$.ajax({
	    	        url: form.attr("action"),
	    	        type: 'POST',
	    	        data: formData,
	    	        //Options to tell JQuery not to process data or worry about content-type
	    	        cache: false,
	    	        contentType: false,
	    	        processData: false,
	    	        success: function(data) {
	    	        	$('#recipe-list').append(data);
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
});