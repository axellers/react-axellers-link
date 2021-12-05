const defaultCallback = () => {
  console.log("FINISHED LOADING");
};

const AxellersLoader = {
  loadScript: function (callback = defaultCallback) {
    var scriptTag = document.createElement("script");
    scriptTag.async = true;
    scriptTag.crossorigin = ""
    scriptTag.type = "text/javascript";
    scriptTag.src = "http://localhost:4000/public/axellers-link.js";
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