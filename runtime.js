
module.exports = function init() {
    const onConnectCallbacks = [];

    const spawnPort = name => {
        const onMessageListeners = [];
        const onDisconnectListeners = [];
        let childPort = null;

        return {
            onMessage: { addListener: l => onMessageListeners.push(l) },

            postMessage: m => 
                // Make sure this is async to give the chance to the other end to hook it's listeners 
                setTimeout(() => childPort._internal.onMessageListeners.forEach(l => l(m)), 0),

            onDisconnect: { addListener: l => onDisconnectListeners.push(l) },
            disconnect: () => {},
            sender: 'sender?',
            name,
            _internal: {
                onMessageListeners,
                onDisconnectListeners,
                setChildPort: cp => childPort = cp,
            },
        };
    };

    // a port that allows communication to another existing port
    // it has the same interface, and is basically the other end of the port.
    const spawnChildPort = port => {
        const onMessageListeners = [];
        const onDisconnectListeners = [];

        const childPort = {
            onMessage: { addListener: l => onMessageListeners.push(l) },

            // Sends a messsage to the parent port
            postMessage: m => setTimeout(() => 
                // Make sure this is async to give the chance to the other end to hook it's listeners 
                port._internal.onMessageListeners.forEach(l => l(m)), 0),

            onDisconnect: { addListener: l => onDisconnectListeners.push(l) },
            disconnect: () => {},
            sender: port.sender,
            name: port.name,
            _internal: {
                onMessageListeners,
                onDisconnectListeners,
            }
        };

        port._internal.setChildPort(childPort);
        return childPort;
        
    };

    return {

        // Called by iJS to create a port
        // Spawns a new port and fires all "onConnect" callbacks
        connect: ({ name }) => {
            const port = spawnPort(name);
            const childPort = spawnChildPort(port);

            // onConnectCallbacks.forEach(cb => cb(childPort))

            // Those callbacks should be called asynchronously.
            // `chrome.runtime.connect` runs synchronously, so the extensions code expect
            // their code to be executed synchronously.
            // If the callbacks are called synchronously, then creator of the port won't
            // be given a chance to add listeners.
            setTimeout(() => onConnectCallbacks.forEach(cb => cb(childPort)), 0);
            return port;
        },

        onConnect: { addListener: callback => onConnectCallbacks.push(callback) }
    };
}
