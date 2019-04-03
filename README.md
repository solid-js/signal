# Signal event system

> Signal is an object based event system.

Classic events dispatcher systems are __string based__, which can be difficult to track across your application.

```javascript
document.addEventListener( "which one already ?" );
```

With Signal, every "event" is represented by an __object__ with `add` and `dispatch` methods.
<br>Messages can be dispatched and followed __more fluently__ thanks to its object notation.

```javascript
const onModelReady = new Signal()

onModelReady.add( function ( state ) {
	console.log('Model ready state changed', state.ready) // true
})

onModelReady.dispatch({
	ready: true
})
```


# With classes

Signal can work inside a functionnal workflow, as well as in a oriented object paradygm.
Here is an example of Signals implements to create clear communication flow between objects.

```javascript
class UserModel
{
	readonly onReady            = new Signal();
	readonly onUserConnected    = new Signal();
	readonly onMessageReceived  = new Signal();

	[...]

	userConnectedHandler ( rawUserData )
	{
		const user = new User( rawUserData );
		this.onUserConnected.dispatch( user );
	}
}

class UserView
{
	constructor ( userModel )
	{
		userModel.onUserConnected.add( this, this.userConnectedHandler )
	}

	[...]

	userConnectedHandler ( user )
	{
		console.log( user );
	}
}
```

# Typescript

This library comes with __Typescript definitions__. Source code is pre-compiled to Javascript modules so Typescript is __opt-in and up to you__.
Signals can have [static types set](guide/5-typings.md) to help error checking in your project.

# Event Signal




# State Signal

