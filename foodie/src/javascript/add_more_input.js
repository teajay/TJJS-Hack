(function( $ ){
	
	 var methods = {
		init : function( options ) { 
			
			// Create some defaults, extending them with any options that were provided
			var settings = $.extend( {
				'class': 'add-more-input'
		    }, options);
			
			return this.each(function() {
				var mainDiv = $(this);
				
				$("<input>", {
					"type": "text",
					"name": "ingredient",
					"class": "text foodie-ingredient ui-widget-content ui-corner-all"
				}).appendTo(mainDiv);
				
				var quantityDiv = $("<div>", {
					"class": "foodie-quantity-group"
				});
				quantityDiv.appendTo(mainDiv);
				
				$("<label>", {
					"for": "quantity",
					"text": "How much?"
				}).appendTo(quantityDiv);
				
				$("<input>", {
					"type": "number",
					"name": "quantity",
					"class": "foodie-quantity ui-widget-content ui-corner-all"
				}).appendTo(quantityDiv);
				
				$("<input>", {
					"type": "text",
					"name": "unit",
					"class": "foodie-unit ui-widget-content ui-corner-all"
				}).appendTo(quantityDiv);
						
		    	
				$("<button>", {
					"class": "add-more-button foodie_button",
					"text": "+"
				}).button().click(function() {
					removeButton($(this));
					quantityDiv.children("button").click(function() {
						$(this).parent().parent().remove();
					});
					
					var newInput = $("<div>", {
						"class": settings.class
					});
					
					addMoreInput(newInput, mainDiv.parent(), settings.class);
					return false;
				}).appendTo(quantityDiv);
			});
		},
		getJson : function( ) {
			objects = [];
			this.each(function() {
				object = {};
				object.ingredient = $(this).children(".foodie-ingredient").val();
				
				var quantitySelector = $(this).children(".foodie-quantity-group");
				object.quantity = quantitySelector.children(".foodie-quantity").val();
				object.unit = quantitySelector.children(".foodie-unit").val();
				objects.push(object);
			});
			return JSON.stringify(objects);
		},
		remove: function() {
			this.each(function() {
				this.remove();
			});
		}
	 };
	 
	function addMoreInput(newInput, parent, myClass) {
		newInput.addMoreInput('init', myClass).appendTo(parent);
	}

	function removeButton(button) {
		var parent = button.parent();
		button.remove();
		
		$("<button>", {
			"class": "add-more-button foodie_button",
			"text": "-"
		}).button().click(function() {
			parent.parent().remove();
		}).appendTo(parent);
	}
	
	$.fn.addMoreInput = function( method ) {   
		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.addMoreInput' );
		}    
	};
})( jQuery );