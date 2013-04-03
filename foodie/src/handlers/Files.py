from FoodieHandler import FoodieHandler
from domain.Files import TempFile
import json

class FileUploadHandler(FoodieHandler):
    
    def post(self):
        posted_file = self.request.get('file')
        file_name = self.request.get('file_name')
        temp_file = TempFile(name=file_name)
        temp_file.set_photo(posted_file) #TODO should ensure mime type
        json_response = {'key': str(temp_file.put()), 'name': file_name}
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
        file_key = self.request.get("file_key")
        temp_file = TempFile.get(file_key)
        temp_file.delete()
        
    @staticmethod
    def location():
        return '/temp/fileupload/remove'