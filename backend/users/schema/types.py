from graphene_django import DjangoObjectType
from ..models import User, Avatar


class UserType(DjangoObjectType):
    class Meta:
        model = User


class AvatarType(DjangoObjectType):
    class Meta:
        model = Avatar
