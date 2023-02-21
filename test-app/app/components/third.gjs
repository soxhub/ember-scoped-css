<style>
  div {
    width: 170px;
    border: 1px solid black;
    padding: 0px 15px;
    margin-top: 15px;
  }

  .header {
    margin-top: 0;
    background-color: lightgreen;
    padding: 15px;
    margin: 0px -15px;
  }

  .message {
    font-weight: bold;
    font-size: 2em;
  }
</style>
<template>
  <div>
    <h3 class='header'>
      {{@title}}
    </h3>
    <p class='message'>
      {{@message}}
    </p>
  </div>
</template>
