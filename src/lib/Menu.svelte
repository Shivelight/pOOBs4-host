<script>
  import { onMount, tick } from "svelte";
  import { goldhenBinloader, preferences } from "../stores";

  export let menus;
  let activeRow = 1;
  let activeCategoryIndex = 0;
  let activeItemIndex = 1;
  let itemPosition = -40;

  let loadingMessage = "";

  let target;
  $: target = menus[activeCategoryIndex].items[activeItemIndex];

  let triggerAction;
  let triggerOptions;
  let triggerSelected = null;

  let select;

  function handleKeydown(event) {
    let menuOffset = 110;
    switch (event.keyCode) {
      case 37: // left
        if (activeRow == 0) {
          changeCategory(Math.max(0, activeCategoryIndex - 1));
        } else if (activeRow == 1) {
          if (activeItemIndex > 0) itemPosition += menuOffset;
          activeItemIndex = Math.max(0, activeItemIndex - 1);
        }
        break;
      case 39: // right
        if (activeRow == 0) {
          changeCategory(Math.min(activeCategoryIndex + 1, menus.length - 1));
        } else if (activeRow == 1) {
          if (activeItemIndex < menus[activeCategoryIndex].items.length - 1) {
            itemPosition = itemPosition - menuOffset;
          }
          activeItemIndex = Math.min(
            activeItemIndex + 1,
            menus[activeCategoryIndex].items.length - 1
          );
        }
        break;
      case 38: // up
        activeRow = 0;
        break;
      case 40: // down
        activeRow = 1;
        break;
      case 116: // L1
        executeActionAndTrigger(target?.trigger?.left);
        break;
      case 117: // R1
        executeActionAndTrigger(target?.trigger?.right);
        break;
    }
  }

  function handleClick(event) {
    if (activeRow != 1) return;
    executeActionAndTrigger(target.action);
  }

  function executeActionAndTrigger(action) {
    switch (action) {
      case "loadPayload":
        loadingMessage = "Loading...";
        const preferedPayload =
          $preferences[`${target.title}changeVersion`] || target.payload;
        fetch(`/payloads/${preferedPayload}`)
          .then((res) => res.arrayBuffer())
          .then((buf) => {
            fetch("http://127.0.0.1:9090/status")
              .then((res) => res.json())
              .then((json) => {
                if (json.status == "ready") {
                  $goldhenBinloader = true;
                  fetch("http://127.0.0.1:9090", {
                    method: "POST",
                    body: buf,
                  }).then((res) => {
                    if (res.ok) loadingMessage = "Loaded";
                  });
                } else {
                  alert(
                    "Cannot Load Payload Because The BinLoader Server Is Busy"
                  );
                }
              })
              .catch((error) => {
                $goldhenBinloader = false;
                // @ts-ignore
                if (window.loadPayload(buf)) {
                  loadingMessage = "Loaded";
                } else {
                  loadingMessage = "Not Loaded!";
                }
              });
          })
          .catch((error) => alert(error))
          .finally(() => setTimeout(() => (loadingMessage = ""), 3000));
        break;
      case "autoLoad":
      case "changeVersion":
        triggerAction = action;
        triggerOptions = target?.triggerOptions?.[triggerAction];
        triggerSelected =
          $preferences[`${target.title}${triggerAction}`] || null;
        openSelect();
        break;
      case "runBinLoader":
        // @ts-ignore
        if (window.runBinLoader()) {
          loadingMessage = "Bin Loader Ready. Send Payload To Port 9020."
          setTimeout(() => loadingMessage = "", 5000);
        }
        break;
    }
  }

  async function openSelect() {
    await tick(); // Wait for select to populate its options before opening
    select.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  }

  function handleMouse(event, index) {
    changeCategory(index);
  }

  function saveTriggerOption() {
    $preferences[`${target.title}${triggerAction}`] = triggerSelected;
  }

  function changeCategory(index) {
    if (activeCategoryIndex != index && menus[index].items.length > 1) {
      activeCategoryIndex = index;
      activeItemIndex = 1;
      itemPosition = -40;
    }
  }

  let humanPreferedVersion;
  $: {
    let preferedPayload =
      $preferences[`${target.title}changeVersion`] || target.payload;
    let ver = target?.triggerOptions?.changeVersion?.find(
      (el) => el.value == preferedPayload
    );
    humanPreferedVersion = ver?.name ?? "";
  }

  onMount(async () => {
    // Auto load payloads
    if ($goldhenBinloader == false) {
      for (const category of menus) {
        for (const item of category.items) {
          if ($preferences[`${item.title}autoLoad`] == "ON") {
            let preferedPayload =
              $preferences[`${item.title}changeVersion`] || item.payload;
            const res = await fetch(`/payloads/${preferedPayload}`);
            // @ts-ignore
            window.loadPayload(await res.arrayBuffer());
            sessionStorage.setItem("sessionLoaded", "true");
          }
        }
      }
    }
  });
</script>

<svelte:window
  on:keydown|preventDefault={handleKeydown}
  on:click={handleClick}
/>

<div id="menu" class="menu">
  <div id="menuItem" class="menu__title">
    {#if activeRow == 1}
      {menus[activeCategoryIndex].items[activeItemIndex].title} {loadingMessage}
    {/if}
  </div>
  <div class="category">
    {#each menus as menu, i}
      <div
        class="category__name"
        class:category__name--active={activeCategoryIndex == i}
        class:category__name--focused={activeCategoryIndex == i &&
          activeRow == 0}
        on:mouseenter={(e) => handleMouse(e, i)}
      >
        {menu.name}
      </div>
    {/each}
  </div>
  <div class="item" style="left: {itemPosition}px">
    {#each menus as { items }, i}
      <div
        class="item__wrapper"
        class:item__wrapper--active={activeCategoryIndex == i}
      >
        {#each items as item, i}
          <div
            class="item__entry"
            class:item__entry--active={activeItemIndex == i}
            class:item__entry--focused={activeItemIndex == i && activeRow == 1}
          >
            {@html item.icon}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
<div id="info" class="info" style="display: block">
  <div class="info__title">
    {menus[activeCategoryIndex].items[activeRow == 0 ? 0 : activeItemIndex]
      .title}
  </div>
  <div class="info__ver">
    {humanPreferedVersion}
    {menus[activeCategoryIndex].items[activeRow == 0 ? 0 : activeItemIndex]
      .subtitle}
  </div>
  <div class="info__desc">
    {@html menus[activeCategoryIndex].items[
      activeRow == 0 ? 0 : activeItemIndex
    ].desc}
  </div>
</div>

<select
  bind:this={select}
  bind:value={triggerSelected}
  on:change={saveTriggerOption}
  name="triggerMenu"
  id="triggerMenu"
  style="position: fixed; bottom: 0px; opacity: 0"
>
  {#if triggerOptions}
    {#each triggerOptions as option}
      <option value={option.value}>{option.name}</option>
    {/each}
  {/if}
</select>
