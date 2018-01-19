<template>
  <div id="app">
    <img src="./assets/logo.png">

    <Timer></Timer>

    <aside class="hint">
      Press <kbd>Spacebar</kbd> to start.
    </aside>

    <aside class="last-times">
      <recorded-time :time="1" uuid="abc-def"></recorded-time>
      <recorded-time :time="100" uuid="abc-def"></recorded-time>
      <recorded-time :time="10090" uuid="abc-def"></recorded-time>
      <recorded-time :time="15020" uuid="abc-def"></recorded-time>
      <recorded-time :time="70030" uuid="abc-def"></recorded-time>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
