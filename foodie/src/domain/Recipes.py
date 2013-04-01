from google.appengine.ext import db
from google.appengine.api import images

ICON_WIDTH = 64
ICON_HEIGHT = 64

class Recipe(db.Model):
    # TODO: We should probably constrain these but I was too lazy to think about it
    user_id = db.StringProperty()
    title = db.StringProperty()
    author = db.StringProperty()
    cookbook = db.StringProperty()
    photo = db.BlobProperty()
    icon = db.BlobProperty()
    
    def set_icon(self, temp_file):
        icon = images.resize(temp_file.data, ICON_WIDTH, ICON_HEIGHT)
        self.icon = db.Blob(icon)
        
    def set_photo(self, temp_file):
        self.photo = temp_file.data
                             
                             
class RecipeItem(db.Model):
    recipe = db.ReferenceProperty(Recipe, collection_name = "items")
    ingredient = db.StringProperty()
    quantity = db.FloatProperty()
    unit = db.StringProperty()
    

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
            
        