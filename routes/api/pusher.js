const express = require("express");
const router = express.Router();
const PushNotifications = require("@pusher/push-notifications-server");
const beamsClient = new PushNotifications({
  instanceId: "6af2ffd6-7acf-4ff5-9099-45bd1624be39",
  secretKey: "8B9AFA8838E2D7A271D34AF7407DF93B7F7514A1F80DDE49DB12AF8F845C4B3C",
});

router.get("/beams-auth", function (req, res) {
  // Do your normal auth checks here 🔒
  // const userId = '' // get it from your auth system

  // Convert req.user._id object to string
  const userId = JSON.stringify(req.user._id); // get it from your auth system

  const userIDInQueryParam = req.query["user_id"];

  // Check for variable type, must be String
  //   console.log("Type of userIDInQueryParam = ", typeof userIDInQueryParam);
  //   console.log("Type of userId = ", typeof userId);

  if (req.user._id != userIDInQueryParam) {
    res.send(401, "Inconsistent request");
  } else {
    const beamsToken = beamsClient.generateToken(userId);
    res.send(JSON.stringify(beamsToken));
  }
});

/*You should now be able to associate devices with users in your application. 
This will allow you to send notifications to all devices belonging to a 
particular user by publishing to their user ID. Use one of the Beams server 
SDKs to publish to your users:
 */

beamsClient
//   .publishToUsers(["user-001", "user-002"], { // specify your users
  .publishToUsers(["5f3901143505bf79fce1d50d", "user-002"], { // specify your users
    apns: {
      aps: {
        alert: {
          title: "Hello",
          body: "Hello, world!",
        },
      },
    },
    fcm: {
      notification: {
        title: "Hello",
        body: "Hello, world!",
      },
    },
    web: {
      notification: {
        title: "Hello",
        body: "Hello, world!",
      },
    },
  })
  .then((publishResponse) => {
    console.log("Just published:", publishResponse.publishId);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

module.exports = router;