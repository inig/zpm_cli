<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Enkel ui'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  color: rgb(10, 81, 15);
}
.hello img {
  max-width: 500px;
}
.btn {
  padding: 4px 10px;
  background-color: transparent;
  border: 1px solid rgb(10, 81, 15);
  color: rgb(10, 81, 15);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
