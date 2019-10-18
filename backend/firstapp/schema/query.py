import graphene


class Query(graphene.ObjectType):
    first_query = graphene.Field(graphene.String)

    def resolve_first_query(self, info):
        return "Response for request"
