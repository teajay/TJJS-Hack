(function( $ ){
	
	$.fn.addMoreInput = function( options ) {   
		
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			'class': 'add-more-input'
	    }, options);
	
		return this.each(function() {
			var mainDiv = $(this);
			
			$("<input>", {
				"type": "number",
				"name": "quantity",
				"class": "text ui-widget-content ui-corner-all"
			}).appendTo(mainDiv);
			
			$("<input>", {
				"type": "text",
				"name": "ingredient",
				"class": "text ui-widget-content ui-corner-all"
			}).appendTo(mainDiv);
	    	
			$("<button>", {
				"class": "foodie_button {{ class }}",
				"text": "+"
			}).button().click(function() {
				mainDiv.children("button").remove();
				$("<div>", {
					"class": settings.class
				})
				.addMoreInput(settings.class)
				.appendTo(mainDiv.parent());
				return false;
			}).appendTo(mainDiv);
		});
	};
})( jQuery );