(function( $ ){
	
	var methods = {
		init : function( options ) { 
			
			// Create some defaults, extending them with any options that were provided
			var settings = $.extend( {
				'labelClass': undefined,
				'initialLabel' : 'Drop files here...'
		    }, options);
			
			function setLabelText(text) {
				dropDiv.children('.' + settings.labelClass).text(text);
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
			
			function removeOldFileAttachment() {
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
	        		setLabelText("Drop files here...");
	        	});
			}
			
			function handleUploadSuccess(response) {
				setLabelText("File Added: ");
	        	removeOldFileAttachment();
	        	setupAddedFileDiv(response.key, response.name);
			}
			
			function handleFiles(files) {
				setLabelText("Processing...");
				
				// Only handle a single file right now.
				// In the future we can allow for multiple uploads.
				var fileFormData = new FormData();
				var file = files[0];
				fileFormData.append('file', file);
				fileFormData.append('file_name', file.name);
				
				$.ajax({
					url: '/temp/fileupload',
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
			
			// Set the initial label text.
			setLabelText(settings.initialLabel);
		}
	};
	
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