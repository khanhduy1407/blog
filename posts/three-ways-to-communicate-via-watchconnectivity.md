---
title: 'Three Ways to communicate via WatchConnectivity'
date: 2024-08-01
author: NKDuy
gravatar: bd037185b042fdcaf1f6b701935b4baaf690d728c2c6f77b067bdcb96504ff93
twitter: ''
facebook: 'khanhduy1407'
github: 'khanhduy1407'
---

WatchOS I want to highlight the different methods we have to communicate between iPhone and Apple Watch devices. I dived deep into WatchConnectivity and how it can be used to exchange data. This post should give an overview about my findings and help to choose the correct method for a given use case.

---

## WatchConnectivity Setup

When working with data transfer to the watch, you will work with `WatchConnectivity`. This framework abstracts away most of the underlying communication and lets you work with high level methods. The main interaction point is the `WCSession` class. This object is used to create the connection between the phone and watch. It offers a default singleton session for the current device, which I will assume is used throughout the post. For all code snippets in this post I additionally assume they are embedded in a simple wrapper class. This makes it a little bit easier to encapsulate the whole connectivity flow in a single object.

First thing to set up is the `WCSession` instance. Its necessaty to check if the current device supports using a session object at all. If this is not checked and the instance is then used on a device which is not supported, all subsequent calls to the `WCSession` instance are considered to be programmer error. If the check is successful its save to activate the session.

```swift
// WatchConnectivityService.swift
final class WatchConnectivityService: NSObject, WCSessionDelegate {

    private let session: WCSession

    init() {
        guard WCSession.isSupported() else { fatalError() } // In a productive code, this should handled more gracefully
        self.session = WCSession.default
        self.session.delegate = self
        self.session.activate()
    }

```

In addition to the check, its useful to set the delegate on the session instance. The delegate needs to conform to `WCSessionDelegate`, which offers callback to the most important events during the lifetime of the session. The delegate can now be used to wait until the `WCSessionDelegate.session(\_:activationDidCompleteWith:error:)` method reports the activated state of the session. As soon as we have this confirmed we can use the `WCSession` instance and send data.

## WatchConnectivity Data Transfer Options

In the following we will take a look at the different ways of sending and receiving data when communicating over `WCSession`. We will also take a look at matching `WCSessionDelegate` methods you can implement to receive counterpart messages. All methods in the following will work with a dictionary of type `[String: Any])`. But be careful. Even though the value is of type `Any` you are only allowed to send "Plist encodable types", meaning primitive types like Strings, Integers, Doubles, Data, Array, etc. So be sure to properly encode custom types prior to sending.

Before going on, I want to highlight that the following methods are intended to transfer small amount data. They should not be used sent complete backend responses or similar to your counterpart. The recommendation by Apple is to use the native `URLSession` capabilities on the watch or the phone to request data ( ref: [Apple Documentation](https://developer.apple.com/documentation/watchos-apps/keeping-your-watchos-app-s-content-up-to-date), [WWDC Video](https://developer.apple.com/videos/play/wwdc2019/208/?time=1434) )

### ApplicationContext

The application context is used to communicate state changes in your app. It should be used for frequently updated data, like the playback time of a song or can be used to communicate the logged in state of user to the watch.

```swift
// WatchConnectivityService.swift

public func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
    // Receive application context sent from counterpart
    // session.receivedApplicationContext is updated automatically
}

public func updateApplicationContext(with context: [String: Any]) {
    do {
        try self.session.updateApplicationContext(context)
    } catch {
        print("Updating of application context failed \(error)")
    }
}
```

`WCSession.updateApplicationContext(_:)` is used to sent an update to the counterpart. The OS will tries to make sure that the most recent value will reach the counterpart as soon as it is possible. This means that, if you update the application context three times without the counterpart being reachable only the last update will be transmitted as soon as the connection has been re-established.

`WCSessionDelegate.session(\_:didReceiveApplicationContext:)` is then called whenever an updated application context is received. Besides the aforementioned methods, the following properties can be accessed on the `WCSession` instance.

- `applicationContext` - represents the latest application context that is about to be or was sent to the counterpart
- `receivedApplicationContext` - represents the latest received application context from the counterpart

Use them to retrieve the necessary application context on demand.

## Transfer Userinfo

Transfer of user info should be used when you want to be sure that your data is eventually delivered and even continue to be delivered when your app goes into background.

```swift
// WatchConnectivityService.swift

public func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
	  // Receive user info sent from counterpart
}

public func transferUserInfo(_ userInfo: [String: Any]) {
    // Use session to transfer user info
    let transferInfo = let self.session.transferUserInfo(userInfo) // returns a WCSessionUserInfoTransfer instance which you can use to monitor or cancel the sending
}
```

In contrast to the application context, all messages you send via this methods are queued up. This means that even if your counterpart is not reachable it will eventually receive all messages that were sent, when reachable again, not only the latest one. The order of messages will be sequentially.

❗ Attention! This method will not work in the simulator. Be sure to test it on real devices.

## Send messages

The last possibility to communicate is to "send messages". This again, uses the same dictionary type but is a little bit special. It depends on which device the respective active sending is executed. This kind of communication is more tailored to a direct 2-way communication between the devices and relies that the counterpart is reachable. If the counterpart is not reachable the sending will fail and the messages are not delivered.

The methods in charge are:

```swift
// WatchConnectivityService.swift

public func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    // Receiving messages sent without a reply handler
}

public func session(
    _ session: WCSession,
    didReceiveMessage message: [String: Any],
    replyHandler: @escaping ([String: Any]) -> Void
) {
    // Receiving messages sent with a reply handler
}

public func sendMessage(_ message: [String: Any], errorHandler: ((Error) -> Void)?) {
    // Send message without reply handler
    session.sendMessage(message, errorHandler: errorHandler)
}

public func sendMessage(
    _ message: [String: Any],
    replyHandler: (([String: Any]) -> Void)?,
    errorHandler: ((Error) -> Void)?
) {
    // Send message with reply handler
    session.sendMessage(message, replyHandler: replyHandler, errorHandler: errorHandler)
}
```

As you might have already seen, we have two more methods available. The additional methods are using the concept of a reply handler. This is a real 2-way communication. The handler can be used by the counterpart to directly react on the message received and reply directly. All messages sent via these methods are delivered sequentially.

❗ If you use `sendMessage` (independent of using the reply handler or not) from iOS -> watchOS, the watch app needs to be in the foreground to actually receive messages. If you go the other way around, watchOS -> iOS, the iOS app can also be in the background and is woken up to be reachable.

## Conclusion

In this small post we saw what different methods are available when communicating between the phone and watch. The following table should give a concise overview about the different methods.

| Transfer Method     | Counterpart needs to be reachable | Guaranteed delivery | Order of data                      |
| :------------------ | :-------------------------------- | :------------------ | :--------------------------------- |
| Application Context | ❌                                | ✅                  | Only the latest one is received    |
| Transfer User Info  | ❌                                | ✅                  | All data is delivered sequentially |
| Send message        | ✅                                | ❌                  | All data is delivered sequentially |
