import importlib
import graphene

from importlib import util
from django.apps import apps


# Собираем схему из установленных пакетов (INSTALLED_APPS)
query_types = []
mutation_types = []
subscription_types = []
non_django_configs = (config for config in apps.get_app_configs() if not config.name.startswith('django'))
for app_config in non_django_configs:
    # Проверяем что пакет содержит пакет schema
    schema_path = '{}.schema'.format(app_config.name)
    schema_spec = importlib.util.find_spec(schema_path)
    if schema_spec is not None:
        # Импортируем модуль по полученной спецификации
        schema_module = importlib.import_module(schema_path)
        # Проверяем наличие и собираем список из всех классов запросов и мутаций
        if hasattr(schema_module, 'Query'):
            query_types.append(schema_module.Query)
        if hasattr(schema_module, 'Mutation'):
            mutation_types.append(schema_module.Mutation)
        # if hasattr(schema_module, 'Subscription'):
        #     subscription_types.append(schema_module.Subscription)

# Создаем общие классы, которые наследуются от всех классов запросов и мутаций
AppQuery = type('AppQuery', tuple(query_types), dict())
AppMutation = type('AppMutation', tuple(mutation_types), dict())
# AppSubscription = type('AppSubscription', tuple(subscription_types), dict())

scheme = graphene.Schema(
    query=AppQuery,
    mutation=AppMutation,
    # subscription=AppSubscription
)
