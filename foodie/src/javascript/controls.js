$(function() {
	$('.foodie_button').button().click(function() {
		var location = $(this).attr('value');
		if(location) {
			window.location.href = location;
		}
	});
	
	$('.foodie_post_button').button().click(function() {
		var location = $(this).attr('value')
		$.ajax({
		    type: "POST",
		    url: location,
		    dataType: "json",
		    success: function(data, textStatus) {
		        if (data.location) {
		            // data.redirect contains the string URL to redirect to
		            window.location.href = data.location;
		        }
		    }
		});
	});
	
	function addAnotherInputHandler() {
		var parent = $(this).parent();
		var clonedDiv = parent.clone();
		clonedDiv.children(":first").val("");
		parent.after(clonedDiv);
		parent.children().last().remove();
		clonedDiv.children().last().click(addAnotherInputHandler)
	}
	
	$('.add_another_input').button().click(addAnotherInputHandler);
	
	$('.form_submit').button().click(function() {
		var form = $(this).parent().parent();
		form.submit();
	});
	
	$(".auto_complete_blah").autocomplete({
	      source: "get_ingredients",
	      minLength: 2,
	      select: function(event, ui) {
	    	  
	      }
	});
	
	$("#create-recipe-form").dialog({
	      autoOpen: false,
	      height: 600,
	      width: 400,
	      modal: true,
	      buttons: {
	    	Save: function() {
	    		var form = $(this);
	    		var formData = new FormData(form[0]); 
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
	    	        }
	    		});
	    		$(this).dialog("close");
	    	},
	        Cancel: function() {
	          $( this ).dialog("close");
	        }
	      },
	      close: function() {
	      }
	});
	
	$(".create-recipe-button").click(function() {
		$( "#create-recipe-form" ).dialog( "open" );
		return false;
	})
})

