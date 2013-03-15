import webapp2
from handlers.Recipes import *


app = webapp2.WSGIApplication([(CreateRecipeHandler.location(), CreateRecipeHandler),
                               (RecipesHandler.location(), RecipesHandler),
                               (IngredientsHandler.location(), IngredientsHandler),
                               (RecipeHandler.location(), RecipeHandler),
                               (DeleteRecipeHandler.location(), DeleteRecipeHandler),
                               (RecipePhotoHandler.location(), RecipePhotoHandler),
                               (RecipeIconHandler.location(), RecipeIconHandler)],
                              debug=True)