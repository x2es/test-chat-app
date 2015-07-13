
Overview
========

This is sample WebSocket / Server-Sent Event chat application. Github: https://github.com/x2es/test-chat-app 


Transport Layer
---------------

I have implemented zero-dependency communication libraries:

 * WebSocket implementation (Raw WS) by part of RFC-6455: `./backend/lib/raw_ws/*`
   It depends only on node's `http` and `crypto` libraries.
   It supports `opcodes=[1,8]` and successfully passes about 100 tests of `wstest` [Autobahn TestSuite](http://autobahn.ws/testsuite/).
   Recent test reports plased at: `./testsuite-raw-ws-autobahn/reports/servers/index.html`
   Echo server was implemented for testing purposes: `./echo-servers-raw-ws.js`. It responds to `wstest` requests.

 * Server-Sent Events (SSE) implementation: `./backend/lib/sse/*`
   It is absolutely minimal implementation for chat-app purposes.

Both libraries have similar structure: `socket/endpoint` representation connected to `http.Server` trough similar `middleware`.
It is possible to host HTTP, WebSocket and SSE service on same `url:port`.

This WebSocket / SSE libraries used in chat servers: 

 * `./chat-server-sse-raw-ws.js` - two channels of communication: SSE for outgoing and WebSocket for incomming data
 * `./chat-server-raw-ws.js`. - single channel of communication: WebSocket

Other two chat-server implementation was used as reference and depend on `ws` library.


Backend Logic Layer
-------------------

Chat behaviour implemented with low-coupling with transport. It is easy to configure chat-server both for single WebSocket and 
dual SSE+WebSocket channels.

For this design purposes `ChatRoom` interacts with abstract `Peer` representation. `Peer` relies on `AbstractTransportFacade` API
`./lib/transport/*`. `AbstractTransportFacade` extended by appropriate facade.

This approach allows to implement hybrid channel transparently for application's logic layer (see usage of `HybridChannel`).
Additionally hybrid channel architecture requires mapping ("pairing") incomming and outgoing channels. This is concern of `ChannelController`.

Backend Logic Layer covered by tests partially (see `./spec/*`).


Front-end
---------

Front-end implemented using Angular. Development environment depends on (Yeoman) [http://yeoman.io/] and `grunt-cli`.
Recent "compiled" release placed in: `./frontend/dist`. It not depends on yeoman and may be served by any HTTP-server.

Front-end have may work both with single (#/chat-ws) and hybrid (#/chat-sse) chnnels.
Simple SSE and WebSocket endpoint-services was implemented for this purposes:

 * `./frontend/app/scripts/services/sse_endpoint.js`
 * `./frontend/app/scripts/services/web_socket_endpoint.js`

Base chat controller `./frontend/app/scripts/controllers/chat.js` have two extensions: `chat_sse.js` and `chat_ws.js`.

Connection configuration placed in `./frontend/app/scripts/app.js`.


TDD
===

From beginning backend was developed using TDD approach. This approach allows to significantly reduce integration issues.
For example the backend v0.0.1 (https://github.com/x2es/test-chat-app/tree/v0.0.1) was developped without any 
integration debugging. I had focused only on specs implementation and was not wasted time on continious debugging. 
But I have invested gained time to test coverate, which will help on next steps of development.

Another benefit is clarity of development process. At any point you can run `npm test` and see progress.
TDD specs is a good reflection of an application backlog. It should be easy to understand progress even by 
non-programmers, especially by product/project managers.

Implemented Logic Layer at this point was not significantly changed later.

Backend
=======

    $ cd backend
    $ npm install

Run tests:

    $ npm test

Run server:

    $ npm start


Front-end
=========

Depends on yeoman and `grunt-cli`

    $ cd frontend
    $ npm install
    $ bower install

Run server:

    $ grunt serve


