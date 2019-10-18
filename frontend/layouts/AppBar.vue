<template>
  <div>
    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="changeMenuState" />

      <v-btn
        icon
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"/>
      <v-spacer />
      <exit-button/>
    </v-app-bar>
  </div>
</template>

<script>
  import ExitButton from "../components/ExitButton";
  export default {
    name: "AppBar",
    components: {ExitButton},
    data () {
      return {
        title: 'Your new application',
      }
    },
    methods: {
      changeMenuState() {
        this.$emit('changeMenuState')
      }
    }
  }
</script>

<style scoped>

</style>
