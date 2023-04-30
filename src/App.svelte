<script>
  import FirmwareVersion from "./lib/FirmwareVersion.svelte";
  import Menu from "./lib/Menu.svelte";
  import { goldhenBinloader, preferences } from "./stores";

  const menuJson = fetch(`/menu.json`).then((res) => res.json());
  let webkitDone = false;

  fetch("http://127.0.0.1:9090/status")
    .then((res) => res.json())
    .then((json) => {
      $goldhenBinloader = true;
      webkitDone = true;
    })
    .catch(() => {
      // @ts-ignore
      if (window.webkitExploit()) {
        webkitDone = true;
      }
    });

</script>

<main>
  {#if webkitDone}
    {#await menuJson}
      <div class="webkit-info">Loading Menu, Please Wait ...</div>
    {:then menus}
      <Menu {menus} />
      <div id="status">
        <div>Payload Loader: {$goldhenBinloader ? "GoldHEN" : "Webkit"}</div>
        <div>GoldHEN Auto Load: {$preferences[`GoldHENautoLoad`] ?? "OFF"}</div>
        <FirmwareVersion />
      </div>
    {/await}
  {:else}
    <div class="webkit-info">Running Webkit Exploit, Please Wait ...</div>
  {/if}
</main>

<style>
  #status {
    position: fixed;
    right: 10px;
    bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    text-shadow: -1px 1px #646468;
    text-align: right;
    z-index: 901;
  }

  .webkit-info {
    overflow: hidden;
    position: absolute;
    top: 45%;
    left: 50%;
    font-size: 25px;
    font-family: sans-serif;
    color: #b8b8b8;
    transform: translate(-50%, -50%);
  }
</style>
