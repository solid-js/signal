# Naming Signals

Signals should always be named correctly to be recognizable throughout your entire app.
Here is the naming convention we use with Solid-JS, we strongly recommand you to follow it :

- Signal names should always starts with `on`.
- Signal names should always clearly express action and subjet.
- Signal names should always use preterit.

### Some examples :
- `onWindowResized`
- `onUserSubscribed`
- `onMessageReceived`
- `onErrorThrown`

### Bad examples :
- `userConnectingSignal`
- `messageReception`


### Auto-complete

If you follow those simple rules while naming your signals, auto-completion will work great, especially if you work with typescript :


```javascript
myObject.on // will show every signals on myObject
```