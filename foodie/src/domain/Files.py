from google.appengine.ext import db
from google.appengine.api import images

PHOTO_WIDTH = 512
PHOTO_HEIGHT = 512

class TempFile(db.Model):
    data = db.BlobProperty()
    name = db.StringProperty()
    
    def set_photo(self, photo):
        trimmed_photo = images.resize(photo, PHOTO_WIDTH, PHOTO_HEIGHT)
        self.data = db.Blob(trimmed_photo)