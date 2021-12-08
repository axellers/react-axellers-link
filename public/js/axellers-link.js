function getNonce(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

var Axellers = {
  create: (config = {
    publicKey: "sandbox_pk_",
    onSuccess: () => { },
    onLoad: () => { },
    onExit: () => { }
  }) => {
    return {
      open: (options) => {
        const { onSuccess, onExit, publicKey, dev } = config;

        let container = document.createElement("span");
        container.className = "selectorgadget_ignore";
        document.body.appendChild(container);
        window.Axellers._axellersContainer = container;

        let authComplete = false;
        let defaultUrl = "https://production.axellers.io";
        if ("development" === "development" || dev.openUrl) {
          if (dev.openUrl) {
            defaultUrl = dev.openUrl;
          } else {
            defaultUrl = "http://localhost:4000";
          }
        }

        const nonce = getNonce(5);
        let iframeUri = `${defaultUrl}?token=${publicKey}&origin=${encodeURIComponent(window.location.origin)}&nonce=${nonce}`;
        if (options.platform) {
          iframeUri += `&platform=${options.platform}`;
        }

        const newWindow = window.open(iframeUri, "axellerslinkwindow", "menubar=1,resizable=1,width=800,height=700");
        
        const popupTick = setInterval(() => {
          if (newWindow.closed) {
            if (!authComplete && onExit) {
              onExit("MERCHANT_CLOSED");
            }
            window.removeEventListener("message", handleMessage);
            clearInterval(popupTick);
          }
        }, 400);

        function handleMessage(event) {
          if (typeof event.data === "string") {
            try {
              const parsedMessage = JSON.parse(event.data);
              
              const { nonce } = parsedMessage;
              if (frameNonce !== nonce) {
                return;
              }

              const { type } = parsedMessage;
              if (type === "SUCCESS") {
                const { publicToken } = parsedMessage;
                authComplete = true;
                if (onSuccess) {
                  onSuccess(publicToken);
                }
              } else if (type === "EXIT") {
                if (onExit) {
                  onExit();
                }
                newWindow.close();
              }
            } catch (e) {
              if (e.message.includes("Unexpected")) {
                return;
              }
              console.error(e);
            }
            if (onExit) {
              onExit("UNKNOWN_ERROR");
              return;
            }
          }
        }

        window.addEventListener("message", handleMessage);
      },
      
      exit: () => {
        if (window.Axellers._axellersContainer) {
          window.Axellers._axellersContainer.remove();
        }
      },

      destroy: () => {
        if (window.Axellers._axellersContainer) {
          window.Axellers._axellersContainer.remove();
        }
      }
    };
  }
};

window.Axellers = Axellers;