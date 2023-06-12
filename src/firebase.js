import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";

import { Notifications } from "./gen/service_connectweb.ts";
import { createPromiseClient } from "@bufbuild/connect";
import { createConnectTransport } from "@bufbuild/connect-web";

const firebaseConfig = {
  apiKey: "AIzaSyC6zKD5-mGA5agzgv2oyQfCihzsoZ9t9Z8",
  authDomain: "xmtp-web.firebaseapp.com",
  projectId: "xmtp-web",
  storageBucket: "xmtp-web.appspot.com",
  messagingSenderId: "847135391532",
  appId: "1:847135391532:web:9141c5b8dd8d026b2bb689",
  measurementId: "G-3G4XJ8LW4H",
};

//console.log("*** Firebase Config ***", firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getOrRegisterServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    return window.navigator.serviceWorker
      .getRegistration("/firebase-push-notification-scope")
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/firebase-push-notification-scope",
          }
        );
      });
  }
  throw new Error("The browser doesn`t support service worker.");
};

export const getFirebaseToken = () =>
  getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
    getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
      serviceWorkerRegistration,
    })
  );

async function register() {
  const transport = createConnectTransport({
    baseUrl:
      "http://localhost:8080/" || "https://notifications.dev.xmtp.network/",
  }); // Here we make the client itself, combining the service
  // definition with the transport.
  const client = createPromiseClient(Notifications, transport);
  console.log("client", client);

  const deviceToken = await getFirebaseToken();
  console.log("deviceToken", deviceToken);
  const installationId = deviceToken; // Use the device token as installationId for simplicity

  console.log("jeje", {
    installationId,
    deliveryMechanism: {
      deliveryMechanismType: {
        value: deviceToken,
        case: "firebaseDeviceToken",
      },
    },
  });
  await client.registerInstallation(
    {
      installationId,
      deliveryMechanism: {
        deliveryMechanismType: {
          value: deviceToken,
          case: "firebaseDeviceToken",
        },
      },
    },
    {}
  );
}

export const onForegroundMessage = () =>
  new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));
