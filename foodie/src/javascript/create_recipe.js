$(function() {
	
	// ----------------
	// Plugin "members"
	// ----------------
	var form = $("#create-recipe-form");
	var formElement = form[0];
	var recipeList = $("#recipe-list");
	var tips = $('.validate-tips');
	var fileDrop = $('.foodie-file-drop');
	
	
	// ---------------------
	// Main plugin behaviour
	// ---------------------
	function addMoreInputs() {
		return $('.add-more-input');
	}
	
	function cleanupForm() {
		formElement.reset();
		
		var addMoreInputsSelector = addMoreInputs();
		var parent = addMoreInputsSelector.parent();
		addMoreInputsSelector.remove();
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
		var addMoreInputsSelector = addMoreInputs();
		var recipeItems = addMoreInputsSelector.addMoreInput("getJson");
		addMoreInputsSelector.addMoreInput("remove");
		var formData = new FormData(formElement); 
		formData.append("ingredients", recipeItems);
		return formData;
	}
	
	function validateIngredients() {
		var valid = true;
		var addMoreInputsSelector = addMoreInputs();
		addMoreInputsSelector.each(function() {
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
		var addMoreInputsSelector = addMoreInputs();
		addMoreInputsSelector.each(function() {
			var quantityElement = $(this).children('.foodie-quantity-group').children('input.foodie-quantity');
			quantityElement.removeClass( "ui-state-error" );
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
	
	// ------------
	// Dialog setup
	// ------------
	$(".create-recipe-button").click(function() {
		form.dialog( "open" );
		return false;
	})
	
	addMoreInputs().addMoreInput({
		class:'add-more-input'
	});
	
	$(".foodie-file-drop").filedrop({
		'labelClass': 'foodie-drop-label'
	});
});