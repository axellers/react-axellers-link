const defaultCallback = () => {
  console.log("FINISHED LOADING");
};

const AxellersLoader = {
  loadScript: function (callback = defaultCallback) {
    var scriptTag = document.createElement("script");
    scriptTag.async = true;
    scriptTag.type = "text/javascript";
    scriptTag.src = "https://cdn.jsdelivr.net/gh/axellers/react-axellers-link@714e3864669a8b3c4b0f692f30d0fc1aa823a57f/public/js/axellers-link.js";
    scriptTag.onload = callback;

    var otherScripts = document.getElementsByTagName("script");
    if (otherScripts.length > 0) {
      otherScripts[0].parentNode.insertBefore(scriptTag, otherScripts[0]);
    } else {
      document.body.appendChild(scriptTag);
    }
  },
};

window.AxellersLoader = AxellersLoader;