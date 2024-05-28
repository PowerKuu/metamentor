<script setup lang="ts">

</script>

<template>
	<div></div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@200;300;400;500;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@200;300;400;500;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Figtree:wght@200;300;400;500;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap");


:root {
	--primary: rgb(55, 32, 227);
	--weak-primary: rgb(244, 243, 255);
	--secondary: #001C44;
	--background: #ffffff;
	--neutral: #f9f8f7;
	--text: #001C44;
	--error: #FF0000;

	--page-padding: 7vw;
	
	--normal-height: 2.5rem;
	--border-radius: 5px;

	--border-width: 2px;
}

html, body {
	overflow-x: hidden;
	overflow-y: auto;
	scroll-behavior: smooth;

	max-width: 100%;
}

* {
	font-family: "Lato", sans-serif;
	font-weight: 500;

	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.text-overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.text-underline {
	text-decoration: underline;
}

.text-bold {
	font-weight: 600 !important;
}

.text-reverse {
	color: var(--background) !important;
}

.pointer {
	cursor: pointer;
}

.border {
	border: var(--border-width) solid var(--neutral);
	border-radius: var(--border-radius);
}

a {
	text-decoration: none;
	color: inherit;
}

*[data-hide="true"] {
	opacity: 0;
	pointer-events: none;
}

/* custom scrollbar */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background-color: var(--neutral);
}

::-webkit-scrollbar-thumb {
  background-color: var(--text);
  border-radius: var(--border-radius);

  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--text);
}
</style>