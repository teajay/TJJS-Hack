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
});

function addAnotherInputHandler() {
	var parent = $(this).parent();
	var clonedDiv = parent.clone();
	clonedDiv.children(":first").val("");
	parent.after(clonedDiv);
	parent.children().last().remove();
	clonedDiv.children().last().click(addAnotherInputHandler)
}

