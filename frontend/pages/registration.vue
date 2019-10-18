<template>
  <div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Регистрация</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>

                <v-text-field
                  v-model="username"
                  name="login"
                  label="ФИО"
                  type="text"
                  :rules="[required]"
                  autocomplete="off"
                />

                <date-picker
                  label="День рождение"
                  v-model="birthDate"
                  :rules="[required]"
                  autocomplete="off"
                />

                <v-text-field
                  label="Email*"
                  v-model="email"
                  required
                  :rules="[required, emailRul]"
                  autocomplete="off"
                />

                <v-text-field
                  id="password"
                  v-model="password"
                  name="password"
                  label="Пароль"
                  :rules="[required]"
                  type="password"
                  autocomplete="off"
                />

              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!valid" @click="createUser">Зарегистрироваться</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>

<!--    <v-card>-->
<!--      <v-card-label>-->
<!--        Регистрация-->
<!--      </v-card-label>-->
<!--      <v-card-text>-->
<!--        <v-layout row wrap>-->
<!--          <v-flex xs12>-->
<!--            <v-text-field-->
<!--              lable=""-->
<!--            />-->
<!--          </v-flex>-->
<!--          <v-flex xs12>-->

<!--          </v-flex>-->
<!--        </v-layout>-->

<!--      </v-card-text>-->
<!--    </v-card>-->
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  import DatePicker from "../components/common/DatePicker";
  export default {
    name: "registration",
    components: {DatePicker},
    data() {
      return {
        username: null,
        birthDate: null,
        email: 'a@a.ru',
        password: null,
        valid: false,
        required: value => !!value || 'Поле не может быть пустым',
        emailRul: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Неверный формат email'
        }

      }
    },
    methods: {
      createUser() {
        this.$apollo.mutate({
          mutation: gql`
          mutation ($birthDate: Date!, $email: String!, $password: String!, $username: String!) {
            registration(birthDate: $birthDate, email: $email, password: $password, username: $username) {
              result
            }
          }`,
          variables: {
            username: this.username,
            password: this.password,
            birthDate: this.birthDate,
            email: this.email,
          }
        }).then(data => {
          this.$router.push({ path: '/login' })
        })
      }
    }
  }
</script>

<style scoped>

</style>
