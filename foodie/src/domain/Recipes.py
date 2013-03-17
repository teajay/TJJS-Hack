from google.appengine.ext import db
from google.appengine.api import images

ICON_WIDTH = 64
ICON_HEIGHT = 64

PHOTO_WIDTH = 512
PHOTO_HEIGHT = 512

class Recipe(db.Model):
    title = db.StringProperty()
    author = db.StringProperty()
    cookbook = db.StringProperty()
    photo = db.BlobProperty()
    icon = db.BlobProperty()
    
    def set_photo(self, photo):
        trimmed_photo = images.resize(photo, PHOTO_WIDTH, PHOTO_HEIGHT)
        self.photo = db.Blob(trimmed_photo)
        icon = images.resize(photo, ICON_WIDTH, ICON_HEIGHT)
        self.icon = db.Blob(icon)
                             
                             
class RecipeItem(db.Model):
    recipe = db.ReferenceProperty(Recipe, collection_name = "items")
    ingredient = db.StringProperty()
    

class IngredientProvider:
    
    def get_all_ingredients(self):
        return db.GqlQuery("SELECT DISTINCT ingredient " +
                           "FROM RecipeItem").run()
    
    def get_ingredient_starting_with(self, partial_ingredient, limit=10):
        recipe_items = db.GqlQuery("SELECT DISTINCT ingredient " +
                                  "FROM RecipeItem " +
                                  "WHERE ingredient > :1 AND ingredient < :2",
                                  partial_ingredient, partial_ingredient + u"\ufffd").fetch(limit)
                 
        return [recipe_item.ingredient for recipe_item in recipe_items]
            
        