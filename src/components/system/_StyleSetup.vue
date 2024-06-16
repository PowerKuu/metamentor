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
	--primary: #583c34;
	--weak-primary: #8d8c8b;
	--secondary: #241d18;
	--background: #ffffff;
	--neutral: hsl(30, 10%, 96%);
	--text: #241d18;
	--weak-text: #8d8c8b;
	--error: #d22222;

	--page-padding: 8vw;
	
	--normal-height: 2.8rem;
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

*::placeholder {
	color: var(--weak-text);
	opacity: 0.7;
}

.text-overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.text-nowrap {
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

.hidden {
	display: none;
}

.weak-text {
	color: var(--weak-text) !important;
}

a {
	text-decoration: none;
	color: inherit;
}

*[data-hide="true"] {
	opacity: 0;
	pointer-events: none;
}

.hide-overflow {
    overflow-y: scroll; /* Add the ability to scroll the y axis */

    /* Hide the scrollbar for Internet Explorer, Edge and Firefox */
    -ms-overflow-style: none;  /* Internet Explorer and Edge */
    scrollbar-width: none;  /* Firefox */

    /* Hide the scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
       display: none;
    }
}

/* custom scrollbar */
::-webkit-scrollbar {
  width: 4px !important;
  height: 4px !important;
}

::-webkit-scrollbar-track {
  background-color: var(--neutral);
}

::-webkit-scrollbar-thumb {
  background-color: var(--primary);
  border-radius: var(--border-radius);

  cursor: pointer;

  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary);
}
</style>