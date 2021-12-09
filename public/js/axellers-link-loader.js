const defaultCallback = () => {
  console.log("FINISHED LOADING");
};

const AxellersLoader = {
  loadScript: function (callback = defaultCallback) {
    var scriptTag = document.createElement("script");
    scriptTag.async = true;
    scriptTag.type = "text/javascript";
    scriptTag.src = "https://cdn.jsdelivr.net/gh/axellers/react-axellers-link@7ef946249288a4e6a0a8a8bea8e3684a9b86971c/public/js/axellers-link.js";
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