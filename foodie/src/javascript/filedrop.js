(function( $ ){
	
	var methods = {
		// -----------------------
		// Plugin public functions
		// -----------------------
		init : function( options ) { 
			var settings = $.extend( {
				'labelClass': undefined
			}, options);
			
			// TODO. It's probably a good idea to generalize the progress indicator.
			function setProcessingIndicator() {
				$('<img>', {
					'src': '/images/ajax-loader.gif',
					'class': 'foodie-ajax-busy'
				}).appendTo(dropDiv);
				stopProcessingIndicator();
			}
			
			function startProcessingIndicator() {
				setLabelText(dropDiv, settings.labelClass, "Processing...");
				dropDiv.children('img.foodie-ajax-busy').show();
			}
			
			function stopProcessingIndicator() {
				dropDiv.children('img.foodie-ajax-busy').hide();
			}
			
			function handleFileDropped(event) {
				event.stopPropagation();
				event.preventDefault();
				
				var files = event.dataTransfer.files;
				var count = files.length;
				 
				// Only call the handler if 1 or more files was dropped.
				if (count > 0)
					handleFiles(files);
			}
			
			function stopEventHandler(event) {
				event.stopPropagation();
				event.preventDefault();
			}
			
			function setupAddedFileDiv(fileKey, fileName) {
				var fileDiv = $('<div>', {
				'class': 'foodie-file-attach'
				});
				fileDiv.appendTo(dropDiv);

				var hiddenInput = $('<input>',{
					'type': 'hidden',
					'name': 'file_key',
					'value': fileKey
				});
				hiddenInput.appendTo(fileDiv);
				
				var fileElement = $('<span>', {
					'text': fileName
				}).appendTo(fileDiv);
				
				var removeElement = $('<a>', {
					'text': 'x',
					'href': 'javascript:void(0)'
				});
				removeElement.appendTo(fileDiv);
				
				removeElement.click(function() {
					removeServerFileAttachment(fileKey);

					$(this).parent().remove();
					setLabelText(dropDiv, settings.labelClass, "Drop files here...");
				});
			}
			
			function handleUploadSuccess(response) {
				stopProcessingIndicator();
				setLabelText(dropDiv, settings.labelClass, "File Added: ");
				removeOldFileAttachment(dropDiv);
				setupAddedFileDiv(response.key, response.name);
			}

			function handleFiles(files) {
				startProcessingIndicator();
				
				// Only handle a single file right now.
				// In the future we can allow for multiple uploads.
				var fileFormData = new FormData();
				var file = files[0];
				fileFormData.append('file', file);
				fileFormData.append('file_name', file.name);
				var upload_url = '';
				$.ajax({
					url: "/temp/fileupload",
					success: function(result) {
						upload_url = result; 
					},
					async: false
				})
				$.ajax({
					url: upload_url,
					type: 'POST',
					data: fileFormData,
					cache: false,
					contentType: false,
					processData: false,
					dataType:'json',
					success: function(data) {
						handleUploadSuccess(data)
					}
				});
			}

			// Only handle a single element..might need to change this assumption.
			var dropDiv = this.first();	
			
			// Bind to the events.
			dropDiv.bind('dragenter', stopEventHandler);
			dropDiv.bind('dragover', stopEventHandler);
			dropDiv.bind('dragexit', stopEventHandler);
			dropDiv.bind('drop', handleFileDropped);

			// Add the processing indicator to the div.
			setProcessingIndicator();

			// Set the initial label text.
			setLabelText(dropDiv, settings.labelClass, initialLabel);
		},
		clear: function(options) {
			var settings = $.extend( {
				'labelClass': undefined
			}, options);
			
			var dropDiv = this.first();
			removeOldFileAttachment(dropDiv);
			setLabelText(dropDiv, settings.labelClass, initialLabel)
		}
	};
	
	// ----------------
	// Shared functions
	// ----------------
	
	var initialLabel = "Drop files here..."
	
	function removeServerFileAttachment(key) {
		var formData = new FormData();
		formData.append('file_key', key);

		$.ajax({
			url: '/temp/fileupload/remove',
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
	}
	
	function removeOldFileAttachment(dropDiv) {
		var fileAttachElement = dropDiv.children('.foodie-file-attach');
		if (!fileAttachElement.length) {
			return;
		}
		
		var inputElement = fileAttachElement.children('input');
		if (!inputElement.length) {
			return;
		}
		
		var key = inputElement.attr("value");
		removeServerFileAttachment(key);
		
		fileAttachElement.remove();
	}
	
	function setLabelText(dropDiv, labelClass, text) {
		dropDiv.children('.' + labelClass).text(text);
	}
	
	// -------------------------------
	// Entry point to filedrop plugin.
	// -------------------------------
	$.fn.filedrop = function( method ) {   
		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.filedrop' );
		}    
	};
	
	$.event.props.push('dataTransfer');
})( jQuery );