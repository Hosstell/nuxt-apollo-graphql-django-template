<template>
  <v-btn @click="exit" icon>
    <v-icon>
      mdi-exit-to-app
    </v-icon>
  </v-btn>
</template>

<script>
  import gql from 'graphql-tag'

  export default {
    name: "ExitButton",
    methods: {
      exit() {
        this.$apollo.mutate({
          mutation: gql`
          mutation {
            logout {
              success
            }
          }`
        }).then(data => {
          console.log(data)
          this.$router.push({ path: '/login' })
        })
      }
    }
  }
</script>

<style scoped>

</style>
