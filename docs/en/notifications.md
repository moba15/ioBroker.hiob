## Notifications

❗**Important** ❗: This feature is still in the beta phase:
- If the app has **no** active connection to the ioBroker, all messages sent within the period will be **lost**
- There is **no** guarantee that notifications will be received
- There may be **considerable** battery consumption
- The app can **lose** the connection to the server **at any time** if it is in the background

### First steps
1. switch off the battery optimization on your device for the app. (Under the device settings)
    - This is to prevent Android from stopping the app in the background to save energy.
2. allow notifications for the app 
3. activate background notifications in the app under the settings
4. restart the app once

### Send notifications
- To do this, go to the ioBroker objects and select your device under hiob.x.devices
- There should now also be a "sendNotification" data point here
- Set the data point to any text -> message is sent

### Custom notifications
#### Schema

```JSON
{
	"$schema": "https://json-schema.org/draft/2019-09/schema",
    "type": "object",
    "properties": {
      "title": {
      	"type": "string",
        "descreption": "The title of your notification",
        "exclusiveMinimum": 0
      },
      "body": {
      	"type": "string",
        "descreption": "The body of your notification",
        "exclusiveMinimum": 0
      },
      "colorARGB": {
      	"type": "string",
        "descreption": "ARGB Color Hex code ",
        "exclusiveMinimum": 0
      }
   
    }
}
```
#### Example
```JSON
{
  "title": "Bewegung",
  "body": "Es wurde eine Bewungung in der Küche erkannt",
  "locked": false,
  "colorARGB": "FFFF0000"
}
```