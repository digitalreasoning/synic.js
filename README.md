synic.js
========

SynIC Javascript Client

# Installation

There are a couple of options here:

* Clone the repo: `git clone https://github.com/digitalreasoning/synic.js.git`
* Install with Bower: `bower install https://github.com/digitalreasoning/synic.js.git`


# Requirements

synic.js depends on jQuery.  If you use require.js, you shouldn't have any issues.  Otherwise you need to be sure to include jQuery in your code:

```html
<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
```


# Usage

First you must create an instance of the client:

```javascript
// Replace YOUR_SYNIC_SERVER_HOST with the hostname or IP of your synic server.
// If you do not pass a string as a parameter to the constructor, the url
// will default to http://localhost:9011
var client = new SynicClient("http://YOUR_SYNIC_SERVER_HOST:9011");
```

Once you have a client object, you can call the various methods on it.  As shown below, there are two ways to utilize the client - the callback function or the javascript promise interface.

```javascript
// Callback function
client.listKGs(function(kglist) {
    // Do something with the list of KGs
});

// Promises
client.listKGs().then(function(kglist) {
    // Do something with the list of KGs
});

// You can even do both, since a promise object is ALWAYS returned
// by each client method
client.listKGs(function (kglist) {
    var newKGlist;
    // transform the kglist into something else
    return newKGlist;
}).then(function (newKGlist) {
    // Do something with the new list
});
```

Both methods work equivalently, and you may use whichever you're more comfortable with.