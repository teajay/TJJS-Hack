(function( $ ){
	
	var methods = {
		init : function( options ) { 
			
			// Create some defaults, extending them with any options that were provided
			var settings = $.extend( {
				'labelElement': undefined,
				'formElement' : undefined
		    }, options);
			
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
			
			function handleUploadSuccess(response) {
				settings.labelElement.text("File Added: " + response.name);
	        	settings.formElement.children('.foodie-file-attach').remove();
	        	$('<input>',{
	        		'type': 'hidden',
	        		'class': 'foodie-file-attach',
	        		'name': 'file_key',
	        		'value': response.key
	        	}).appendTo(settings.formElement);
			}
			
			function handleFiles(files) {
				
				settings.labelElement.text("Processing...");
				
				var fileFormData = new FormData();
				var file = files[0];
				fileFormData.append('file', file);
				fileFormData.append('file_name', file.name);
				
				$.ajax({
			        url: '/temp/fileupload',
			        type: 'POST',
			        data: fileFormData,
			        //Options to tell JQuery not to process data or worry about content-type
			        cache: false,
			        contentType: false,
			        processData: false,
			        dataType:'json',
			        success: function(data) {
			        	handleUploadSuccess(data)
			        }
				});
			}
			
			return this.each(function() {
				$(this).bind('dragenter', stopEventHandler);
				$(this).bind('dragover', stopEventHandler);
				$(this).bind('dragexit', stopEventHandler);
				$(this).bind('drop', handleFileDropped);
			});
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