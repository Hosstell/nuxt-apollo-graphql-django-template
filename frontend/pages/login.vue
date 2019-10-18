<template>
  <div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Вход</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>

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
                <v-btn color="primary" :disabled="!valid" @click="login">Вход</v-btn>
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
      login() {
        this.$apollo.mutate({
          mutation: gql`
          mutation ($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              success
            }
          }`,
          variables: {
            email: this.email,
            password: this.password,
          }
        }).then(data => {
          this.$router.push({ path: '/start' })
        })
      }
    }
  }
</script>

<style scoped>

</style>
