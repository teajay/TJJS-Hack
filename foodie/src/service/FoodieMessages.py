from protorpc import messages

class IngredientMessage(messages.Message):
    ingredient = messages.StringField(1, required=True)
    quantity = messages.FloatField(2, required=True)
    unit = messages.StringField(3, required=True)

class RecipeMessage(messages.Message):
    title = messages.StringField(1, required=True)
    author = messages.StringField(2, required=True)
    cookbook = messages.StringField(3, required=True)
    photo = messages.StringField(4, required=True)
    icon = messages.StringField(5, required=True)
    ingredients = messages.MessageField(IngredientMessage, 6, repeated=True)
    
class GetRecipesRequest(messages.Message):
    user_id = messages.StringField(1, required=True)
    include_ingredients = messages.StringField(2, required=False)
    
class GetRecipesResponse(messages.Message):
    recipes =  messages.MessageField(RecipeMessage, 1, repeated=True)
    
    