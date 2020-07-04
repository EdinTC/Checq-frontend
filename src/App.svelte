<script>
  import { onMount } from 'svelte';
  import { getQueryParam, extractHostname, updateURL } from './utils';
  import Header from "./Header.svelte";
  import Results from "./Results.svelte";
  import Footer from "./Footer.svelte";

  export let promise;
  const apiUrl = "https://api.checq.intercube.io";
  let hostname = getQueryParam();

  onMount(async () => {
    promise = fetchDomain();
  });

  async function fetchDomain() {
    if (hostname === "") return;
    hostname = extractHostname(hostname);
    const response = await fetch(`${apiUrl}/${hostname}`, { mode: "cors" });
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      if(json.message != undefined) {
        throw new Error(json.message);
      }
      else {
        throw new Error("No results found.")
      }
    }
  }

  function handleClick() {
    updateURL(extractHostname(hostname))
    promise = fetchDomain();
  }
</script>

<!-- This component contains the header with our application title. -->
<Header />

<!-- This is our search component -->
<div class="flex mb-4 container mx-auto ">
  <form 
    class="w-full max-w-sm mx-auto" 
    on:submit|preventDefault={handleClick}
    >
    <div class="flex items-center border-b border-b-2 border-green-400 py-2">
      <!-- svelte-ignore a11y-autofocus -->
      <input
        class="appearance-none bg-transparent border-none w-full text-gray-700
        mr-3 py-1 px-2 leading-tight focus:outline-none"
        bind:value={hostname}
        type="text" 
        placeholder="www.google.com"
        role="searchbox"
        autofocus
        aria-label="Domain name" />
      <button
        class="flex-shrink-0 bg-green-700 hover:bg-green-800 border-green-700
        hover:border-green-800 text-md border-4 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline focus:border-transparent"
        on:click={handleClick}
        type="button"
        role="button"
        >
        Checq now
      </button>
    </div>
    <small class="text-xs">Enter a valid domain name or IP address</small>
  </form>
</div>

<div class="container mx-auto px-4 pl-2">
  {#await promise}
    <div class="flex justify-center mt-12">
      <div class="loader"></div>
    </div>
  {:then data}
    <Results {data}/>
  {:catch error}
    <div class="w-1/2 whitespace-normal bg-red-200 overflow-x-auto mx-auto p-3 mb-3 text-center rounded">
      <p>{error.message} 😔</p>
    </div>
  {/await}
</div>

<!-- This component contains the footer text -->
<Footer />

<style lang="postcss">
  @import "tailwindcss/base";
  @import "tailwindcss/components";
  @import "tailwindcss/utilities";

  div.loader {
    position: relative;
    width: 2em;
    height: 2em;
    border: 3px solid #68d391;
    overflow: hidden;
    animation: spin 3s ease infinite;
  }

  div.loader::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    width: 2em;
    height: 2em;
    background-color: #48bb78;
    transform-origin: center bottom;
    transform: scaleY(1);
    animation: fill 3s linear infinite;
  }

  @keyframes spin {
    50%,
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes fill {
    25%,
    50% {
      transform: scaleY(0);
    }
    100% {
      transform: scaleY(1);
    }
  }
</style>
