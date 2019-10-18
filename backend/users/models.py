from django.db import models
from hashlib import sha256
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.utils.crypto import get_random_string, constant_time_compare
import re


class Avatar(models.Model):
    link = models.TextField('Ссылка')
    file = models.ImageField('Файл')


class Pictures(models.Model):
    link = models.TextField('Ссылка')
    file = models.ImageField('Файл')
    user_id = models.ForeignKey('users.User', null=True, on_delete=models.CASCADE)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField('ФИО пользователя', max_length=250)
    birth_date = models.DateField('Дата рождения', null=True)
    email = models.CharField('Электронная почта', max_length=64, null=True, default=None, blank=True, unique=True)
    password = models.CharField(max_length=64)
    last_online = models.DateTimeField('Последний заход', null=True)
    avatar = models.ForeignKey(Avatar, null=True, on_delete=models.CASCADE)

    salt = models.CharField(max_length=64)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    objects = UserManager()

    def set_password(self, raw_password):
        salt = get_random_string(64)
        hasher = sha256()
        raw_password = raw_password + '_' + salt
        hasher.update(raw_password.encode('utf-8'))
        self.salt = salt
        self.password = hasher.hexdigest()
        return self

    def check_password(self, raw_password):
        hasher = sha256()
        raw_password = raw_password + '_' + self.salt
        hasher.update(raw_password.encode('utf-8'))
        result = constant_time_compare(hasher.hexdigest(), self.password)
        return result

