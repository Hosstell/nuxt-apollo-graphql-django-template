<template>
  <div>
    <h1>
      Your new application
    </h1>
    <v-card class="mb-2">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs5>
            <v-btn @click="makeQueryRequest"> Проверить Query запрос </v-btn>
          </v-flex>
          <v-flex v-if="queryResponseLine" class="pt-2" xs5>
            Ответ с сервера: {{queryResponseLine}}
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs2>
            <v-btn @click="makeMutationRequest"> Проверить Mutation запрос </v-btn>
          </v-flex>
          <v-flex xs2>
            <v-text-field
              label="Введите строку эхо"
              v-model="echoLine"
              hide-details
              class="pa-0 ma-0"
            />
          </v-flex>
          <v-flex xs1/>
          <v-flex v-if="queryMutationLine" class="pt-2" xs5>
            Ответ с сервера: {{queryMutationLine}}
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import gql from 'graphql-tag'
import auth from '../components/user/auth'

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data () {
    return {
      queryResponseLine: '',
      queryMutationLine: '',
      echoLine: '',
      auth: auth
    }
  },
  methods: {
    makeQueryRequest() {
      this.queryResponseLine = ''
      this.$apollo.query({
        query: gql`
          query {
            firstQuery
          }
        `,
      }).then(({data}) => {
        this.queryResponseLine = data
      })
    },
    makeMutationRequest() {
      this.$apollo.mutate({
        mutation: gql`
          mutation ($line: String!) {
            echo(line: $line) {
              response
            }
          }
        `,
        variables: {
          line: this.echoLine
        }
      }).then(({data}) => {
        this.queryMutationLine = data.echo
      })
    }
  },
  computed: {
    id() {
      return this.$$user
    }
  }
}
</script>
