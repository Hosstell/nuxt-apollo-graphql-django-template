import graphene
from django.contrib.auth import authenticate, login, logout
from ..models import User


class Registration(graphene.Mutation):
    result = graphene.Boolean()

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        birth_date = graphene.Date(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        password = kwargs.pop('password')
        new_user = User.objects.create(username=kwargs['username'], email=kwargs['email'],
                                       birth_date=kwargs['birth_date'])
        new_user.set_password(password)
        new_user.save()
        return Registration(result=True)


class Login(graphene.Mutation):
    success = graphene.Boolean()

    class Meta:
        description = 'Вход пользователя в систему'

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        print(kwargs)
        user = authenticate(info.context, username=kwargs['email'], password=kwargs['password'])
        if user is not None:
            login(info.context, user)
        return Login(success=user is not None)


class Logout(graphene.Mutation):
    class Meta:
        description = 'Выход пользователя из системы'

    success = graphene.Boolean(required=True, description='Успех операции')

    @staticmethod
    def mutate(root, info):
        if info.context.user.is_authenticated:
            logout(info.context)
            return Logout(success=True)
        else:
            return Logout(success=False)


class Mutation(graphene.ObjectType):
    registration = Registration.Field()
    login = Login.Field()
    logout = Logout.Field()
