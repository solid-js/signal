
// ----------------------------------------------------------------------------- STRUCT

/**
 * Interface describing a internal listener.
 */
interface IListener<GArguments>
{
	scope		:any;
	handler		:(...GArguments) => any;
	once		:boolean;
}

/**
 * TODO : Doc
 */
export class Signal <GArguments extends any[] = any[]>
{
	// ------------------------------------------------------------------------- LOCALS

	// All registered listeners
	protected _listeners				:IListener<GArguments>[]	= [];


	// ------------------------------------------------------------------------- GETTERS

	// Get total attached listeners
	get length ():number { return this._listeners.length; }


	// ------------------------------------------------------------------------- ADDING / LISTENING

	/**
	 * TODO DOC
	 * - Interdire bind
	 * - scope optionnel
	 * 
	 * Add a listener. The handler will be called each time dispatch is called.
	 * The handler will get the dispatch parameters.
	 * Will return the id of the listening, for removing later.
	 * @param handler Called when signal is dispatched.
	 * @param scope Scope to apply to handler. Let null to keep default.
	 * @returns {number} The register index, to remove easily.
	 */
	add ( handler:(...GArguments) => any, scope? ):void
	{
		this.register( handler, scope, false );
	}

	/**
	 * TODO DOC
	 * Same as add, but will be removed when dispatched once.
	 * @param handler Called when signal is dispatched.
	 * @param scope Scope to apply to handler. Let null to keep default.
	 */
	addOnce ( handler:(...GArguments) => any, scope? ):void
	{
		return this.register( handler, scope, true );
	}

	/**
	 * Register a listening.
	 */
	protected register ( handler:(...GArguments) => any, scope, once:boolean ):void
	{
		this._listeners.push({
			handler, scope, once
		});
	}


	// ------------------------------------------------------------------------- DISPATCHING

	/**
	 * Dispatch the signal to all listeners. Will call all registered listeners with passed arguments.
	 * Will return the list of listeners returns (listeners not returning anythings will be ignored)
	 */
	dispatch (...rest):any[]
	{
		const listenersToRemove	:IListener<GArguments>[]	= [];
		const results = this._listeners.filter( currentListener =>
		{
            // Call the listener
            const currentResult = currentListener.handler.apply( currentListener.scope, rest );

            // If it's an once listener, mark as remove
            currentListener.once
        	&&
            listenersToRemove.push(currentListener);

            // If we have result, add it to the return package
            return currentResult != null;
        });

		// Remove all once listeners
		const total = listenersToRemove.length;
		for ( let listenerIndex = 0; listenerIndex < total; listenerIndex ++ )
		{
			this.remove( listenersToRemove[ listenerIndex ].handler );
		}

		// Return the result package of all listeners
		return results;
	}


	// ------------------------------------------------------------------------- REMOVING & DESTRUCT

	/**
	 * TODO
	 * Remove a listener by its id (returned by the add method) or by its handler reference.
	 * Will return true if the listener is found and removed.
	 */
	remove ( handler:(...GArguments) => any, scope? ):void
	{
		// New set of listeners
		let newListeners		:IListener<GArguments>[]	= [];

		// Browse all listeners
		const total = this._listeners.length;
		for ( let listenerIndex = 0; listenerIndex < total; listenerIndex ++ )
		{
			// Target current listener
			const currentListener = this._listeners[ listenerIndex ];

			// If this listener has the handler we want to removed
			if ( currentListener.handler == handler )
			{
				// If there is no scope,
				// remove this listener by not adding it to the new list
				if ( scope == null ) continue;

				// If there is a scope,
				// only remove it if this is the same scope
 				else if ( currentListener.scope == scope ) continue;
			}

			// This listener has not been removed, add it to the new set
			newListeners.push( currentListener );
		}

		// Throw error if handler has not been found and deleted.
		if ( newListeners.length == this._listeners.length )
		{
			throw new Error(`Signal // Handler ${handler} has not been removed. Set scope if needed and never add binded functions.`);
		}

		// Remap new listeners
		this._listeners = newListeners;
	}

	/**
	 * Remove all listeners
	 */
	clear ():void
	{
		this._listeners = [];
	}

	/**
	 * Destroy this signal and every registered handler.
	 */
	dispose ():void
	{
		this._listeners = null;
	}
}