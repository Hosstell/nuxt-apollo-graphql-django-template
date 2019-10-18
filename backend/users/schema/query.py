import graphene
from .types import UserType


class Query(graphene.ObjectType):
    get_current_user = graphene.Field(UserType)

    def resolve_get_current_user(self, info):
        print('Hello')
        return info.context.user
