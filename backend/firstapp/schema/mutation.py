import graphene


class Echo(graphene.Mutation):
    response = graphene.String()

    class Arguments:
        line = graphene.String(required=True)

    def mutate(self, info, line):
        print('query: ', line)
        return Echo(response=line)


class Mutation(graphene.ObjectType):
    echo = Echo.Field()
