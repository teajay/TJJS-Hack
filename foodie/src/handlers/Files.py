from FoodieHandler import FoodieHandler
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext import blobstore
import json
import logging

class FileUploadHandler(FoodieHandler, blobstore_handlers.BlobstoreUploadHandler):
    
    def post(self):
        upload = self.get_uploads()[0]
        # Make the assumption that there is only one image being uploaded since the 
        # AJAX call uses a FormData object with just one file.
        file_name = self.request.get('file_name')
        logging.info("LOGGING KEY %s for file %s" % (upload.key(),file_name) )
        json_response = {'key': str(upload.key()), 'name': file_name}
        self.set_json_response(json.dumps(json_response))
        
    def get(self):
        # Generate a URL that can be used for clients to send us files
        # i.e., to upload, call GET /temp/fileupload to get a blobstore 
        # upload URL that can then be used in a POST /temp/fileupload
        upload_url = blobstore.create_upload_url('/temp/fileupload')
        logging.info('CREATED UPLOAD URL %s' % upload_url)
        self.response.out.write(upload_url)
        
    @staticmethod
    def location():
        return '/temp/fileupload'
    
    
class RemoveFileUploadHandler(FoodieHandler):
    
    def post(self):
        # TODO: Implement removal of image from blob store if user hits 'cancel' button on form
        file_key = self.request.get("file_key")
        #temp_file = TempFile.get(file_key)
        #temp_file.delete()
        
    @staticmethod
    def location():
        return '/temp/fileupload/remove'