# Signal Statements

A signal should never be overridable from outside

```javascript
class MyClass
{
	// Bad example, we can override this Signal from outisde
	public onWindowResized = new Signal()
}
```

### Solution A

Use a getter :

```javascript
class MyClass
{
	protected _onWindowResized = new Signal()
	get onWindowResized () { return this._onWindowResized }
}
```

### Solution B

Use a `readonly` property ( Typescript only ) :

```javascript
class MyClass
{
	readonly onWindowResized = new Signal()
}
```