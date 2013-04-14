from FoodieHandler import FoodieHandler
from domain.Files import TempFile
from google.appengine.ext.webapp import blobstore_handlers
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
        file_key = self.request.get('file_key')
        temp_file = TempFile.get(file_key)
        
        self.set_img_response(temp_file.data)
    
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