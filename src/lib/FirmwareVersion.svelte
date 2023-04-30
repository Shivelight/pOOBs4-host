<script>
  let userAgent = navigator.userAgent.substring(
    navigator.userAgent.indexOf("6.72 (") + 28,
    navigator.userAgent.indexOf(") Apple")
  );
  let fwVersion = "Not Detected";
  if (userAgent == "layStation 4/9.00") {
    fwVersion = "9.00";
  }
</script>

<div>
  Detected Firmware Version: {fwVersion}
</div>
