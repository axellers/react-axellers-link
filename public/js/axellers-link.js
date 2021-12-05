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
    // handle passed in variables and initialize Link component
    return {
      open: options => {
        const { onSuccess, onExit, publicKey, dev } = config;
        let container = document.createElement("span");
        container.className = "selectorgadget_ignore";
        document.body.appendChild(container);
        window.Axellers._axellersContainer = container;
        let authComplete = false; // MUST CALL window.open IMMEDIATELY OTHERWISE POPUP BLOCKED ON MOBILE

        let defaultUrl = "https://production.axellers.io";

        if ("development" === "development" || dev?.openUrl) {
          if (dev?.openUrl) {
            defaultUrl = dev.openUrl;
          } else {
            defaultUrl = "http://localhost:4000";
          }
        }

        const nonce = getNonce(5);
        let iframeUri = `${defaultUrl}/linkstart/${publicKey}?token=${publicKey}&origin=${encodeURIComponent(window.location.origin)}&nonce=${nonce}`;

        if (options?.platform) {
          iframeUri += `&platform=${options.platform}`;
        }

        const newWindow = window.open(iframeUri, "axellerslinkwindow", "menubar=1,resizable=1,width=800,height=700");
        const popupTick = setInterval(() => {
          if (newWindow?.closed) {
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
              const {
                nonce: frameNonce
              } = parsedMessage;

              if (frameNonce !== nonce) {
                // DIFFERENT FRAME
                return;
              } // Handle message (public token only for now)


              const {
                type
              } = parsedMessage;

              if (type === "SUCCESS") {
                const {
                  publicToken
                } = parsedMessage;
                authComplete = true;

                if (onSuccess) {
                  onSuccess(publicToken);
                }
              } else if (type === "EXIT") {
                if (onExit) {
                  onExit();
                }

                newWindow?.close();
              } else if (type === "OAUTH_INITIATE") {
                const {
                  link
                } = parsedMessage;
              }
            } catch (e) {
              if (e.message?.includes("Unexpected")) {
                // ignore non JSON messages
                return;
              } // link
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
      // can call openAxellers function to do the react stuff
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