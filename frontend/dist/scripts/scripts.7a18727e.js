"use strict";function createSetter(a){return function(b){this["_"+a]=b}}function createGetter(a){return function(){return this["_"+a]}}var MiniFrame={};MiniFrame.accessors=function(a,b){for(var c=0;c<b.length;c++){var d=b[c],e=d.charAt(0).toUpperCase()+d.slice(1);a.prototype["get"+e]=createGetter(d),a.prototype["set"+e]=createSetter(d)}},MiniFrame.delegate=function(a,b){for(var c=b.methods,d=b.to,e=0;e<c.length;e++){var f=c[e];!function(a,b,c){a.prototype[b]=function(){var a=this[c],d=Array.prototype.slice.call(arguments);a[b].apply(a,d)}}(a,f,d)}},MiniFrame.events=function(a,b){b.forEach(function(b){var c=b.charAt(0).toUpperCase()+b.slice(1),d="on"+c,e="_fire"+c;a.prototype[d]=function(a){return void 0==this._evHandlers&&(this._evHandlers={}),void 0==this._evHandlers[b]&&(this._evHandlers[b]=[]),this._evHandlers[b].push(a),this},a.prototype[e]=function(){if(void 0!=this._evHandlers&&void 0!=this._evHandlers[b])for(var a=Array.prototype.slice.call(arguments),c=this._evHandlers[b],d=0;d<c.length;d++){var e=c[d];e.apply(this,a)}}})},angular.module("frontendApp",["ngAnimate","ngRoute","ngSanitize","ngTouch","ngMessages"]).value("sseURI","//localhost:12001/").value("wsURI","//localhost:12002").config(["$routeProvider",function(a){a.when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/chat-ws",{templateUrl:"views/chat.html",controller:"ChatWSCtrl",controllerAs:"chatWS"}).when("/chat-sse",{templateUrl:"views/chat.html",controller:"ChatSSECtrl",controllerAs:"chatSSE"}).otherwise({redirectTo:"/chat-sse"})}]).controller("LocationCtrl",["$scope","$location",function(a,b){a.isActive=function(a){return a==b.path()?!0:!1}}]),angular.module("frontendApp").controller("AboutCtrl",function(){}),angular.module("frontendApp").controller("ChatCtrl",["$scope","nickname","endpoint",function(a,b,c){function d(){c.send({type:"name",body:e()})}function e(){return a.nickname||a.defaultNickname}function f(){a.inp_message="",k=[e()]}function g(){angular.element(".message-input").trigger("focus")}function h(){a.preventSendingTyping||(a.preventSendingTyping=!0,l=setTimeout(function(){a.preventSendingTyping=!1},3e3),c.send({from:e(),type:"typing"}))}function i(b){var c=m[b];void 0!=c&&clearTimeout(c);var d=a.typers.indexOf(b);-1!==d&&(a.typers.splice(d,1),a.$apply())}function j(b){console.log("typingEvent",b);var c=b.from;-1===a.typers.indexOf(b.from)&&(a.typers.push(c),a.$apply());var d=m[c];void 0!=d&&clearTimeout(d),d=setTimeout(function(){i(c)},5e3),m[c]=d}var k,l,m={};a.defaultNickname=b,a.noOneTyping=!0,a.typers=[],a.$watchCollection("typers",function(){0===a.typers.length?a.noOneTyping=!0:a.noOneTyping=!1}),a.messages=[{from:e(),body:"Which difference between #/chat-sse and #/chat-ws?"},{from:"Konstantin Ivanov",body:"I have implemented two versions of chat-server.\n#/chat-see comunicates with server using two channel: Server-Sent Events for incomming and WebSocket for outgoing data."},{from:"Konstantin Ivanov",body:"#/chat-ws use WebSocket for sending data in both directions."},{from:e(),body:"My name is too weird.."},{from:"Konstantin Ivanov",body:"Just type another one!"},{from:"Konstantin Ivanov",body:"Hint, you may click on my name to put it into textbox."}],a.$watchCollection("messages",function(a){if(a){var b=angular.element(".conversation");b.scrollTop(b[0].scrollHeight)}}),a.incommingMessage=function(b){return"typing"===b.type?void j(b):(i(b.from),a.messages.push(b),void a.$apply())},f(),d(),a.send=function(){if(""!==a.inp_message){var b={from:e(),body:a.inp_message};c.send(b),a.preventSendingTyping=!1,void 0!=l&&clearTimeout(l),a.messages.push(b),f(),g()}},a.nicknameKeypress=function(a){13===a.charCode&&g()},a.inputKeypress=function(b){h(),b.altKey!==!0&&b.ctrlKey!==!0&&b.metaKey!==!0&&b.shiftKey!==!0&&13===b.charCode&&(a.send(),b.preventDefault())},a.appealTo=function(b){var c=a.messages[b].from;-1===k.indexOf(c)&&(k.push(c),a.inp_message+=c+", ",g())},a.getNickname=e,a.isSystem=function(a){return 0===a.origin},a.isMe=function(a){return a.from===e()},a.br=function(a){return a.replace("\n","<br />")}}]),angular.module("frontendApp").controller("ChatWSCtrl",["$scope","$controller","wsURI","webSocketEndpoint",function(a,b,c,d){function e(){a.connection={$error:{failed_ws:!0}},a.$apply()}var f,g="ws:"+c;f=d.connect(g),f.onError(e),f.onClose(e),f.onOpen(function(){a.connection={$error:{failed_ws:!1}},a.$apply()}),f.onMessage(function(b){a.incommingMessage(b)}),angular.extend(this,b("ChatCtrl",{$scope:a,endpoint:f}))}]),angular.module("frontendApp").controller("ChatSSECtrl",["$scope","$controller","sseURI","webSocketEndpoint","sseEndpoint",function(a,b,c,d,e){function f(){a.connection={$error:{failed_ws:!0}},a.$apply()}var g={},h="http:"+c,i="ws:"+c,j=e.connect(h),k=d.connect(i);k.setReady("paired",!1),k.onError(f),k.onClose(f),j.onOpen(function(){a.connection={$error:{failed_sse:!1}},a.$apply()}),j.onError(function(){a.connection={$error:{failed_sse:!0}},a.$apply()}),j.onMessage(function(b){return void 0!=b.type&&"pair"===b.type?(k.send(b,{system:!0}),void k.setReady("paired")):void a.incommingMessage(b)}),g.send=k.send.bind(k),angular.extend(this,b("ChatCtrl",{$scope:a,endpoint:g}))}]),function(a){function b(a){this._eSource=a,this._bindESourceEvents()}function c(){}MiniFrame.events(b,["open","error","message"]),b.prototype._bindESourceEvents=function(){!function(a,b){b.onmessage=function(b){a._fireMessage(JSON.parse(b.data))},b.onerror=function(b){a._fireError(b)},b.onopen=function(){a._fireOpen()}}(this,this._eSource)},c.prototype.connect=function(a){var c=new b(new EventSource(a));return c},a.module("frontendApp").service("sseEndpoint",c)}(angular),function(a){function b(a){this._ws=a,this._queue=[],this._queueSys=[],this._readyState={open:!1},this.setReady("open",!1),this._bindWSEvents()}function c(){}MiniFrame.events(b,["open","close","error","message"]),b.prototype._bindWSEvents=function(){!function(a,b){b.onerror=function(){a._fireError()},b.onopen=function(){a.setReady("open"),a.flush()},b.onclose=function(){a._fireClose()},b.onmessage=function(b){a._fireMessage(JSON.parse(b.data))}}(this,this._ws)},b.prototype.setReady=function(a,b){var c=!0;b===!1&&(c=!1),this._readyState[a]=c,this.flush()},b.prototype.isReady=function(a){var b=a;void 0==b&&(b=Object.keys(this._readyState));for(var c=0;c<b.length;c++){var d=b[c];if(this._readyState[d]!==!0)return!1}return!0},b.prototype.send=function(a,b){var c=b||{},d=this._queue;c.system===!0&&(d=this._queueSys),d.push(JSON.stringify(a)),this.flush()},b.prototype.flush=function(){if(this.isReady()){for(;this._queueSys.length>0;)this._ws.send(this._queueSys.shift());for(;this._queue.length>0;)this._ws.send(this._queue.shift())}else if(this.isReady(["open"]))for(;this._queueSys.length>0;)this._ws.send(this._queueSys.shift())},c.prototype.connect=function(a){var c=new b(new WebSocket(a));return c},a.module("frontendApp").service("webSocketEndpoint",c)}(angular),angular.module("frontendApp").factory("nickname",function(){for(var a="chi at om na fi pa tam nik la son dav".split(" "),b=Math.floor(Math.random(2))+2,c="",d=0;b>d;d++)c+=a[Math.floor(Math.random()*a.length)];return c.charAt(0).toUpperCase()+c.slice(1)}),angular.module("frontendApp").run(["$templateCache",function(a){a.put("views/about.html",'<div class="jumbotron"> <h1>Konstantin Ivanov</h1> <p class="lead"> <!-- <img src="images/yeoman.8cb970fb.png" alt="I\'m Yeoman"><br> --> <img class="bc photo" src="images/ki_200x200.e956fd4b.jpg"><br> <strong>Test task</strong>: simple chat system using self-implemented WebSocket and Server-Sent Events. </p> <p><a class="btn btn-lg btn-success" ng-href="https://github.com/x2es/test-chat-app">GitHub <span class="glyphicon glyphicon-ok"></span></a></p> </div> <div class="row marketing"> <article class="markdown-body entry-content" itemprop="mainContentOfPage"><h1><a id="user-content-overview" class="anchor" href="#overview" aria-hidden="true"><span class="octicon octicon-link"></span></a>Overview</h1> <p>This is sample WebSocket / Server-Sent Event chat application. Github: <a href="https://github.com/x2es/test-chat-app">https://github.com/x2es/test-chat-app</a> </p> <h2><a id="user-content-transport-layer" class="anchor" href="#transport-layer" aria-hidden="true"><span class="octicon octicon-link"></span></a>Transport Layer</h2> <p>I have implemented zero-dependency communication libraries:</p> <ul> <li><p>WebSocket implementation (Raw WS) by part of RFC-6455: <code>./backend/lib/raw_ws/*</code> It depends only on node\'s <code>http</code> and <code>crypto</code> libraries. It supports <code>opcodes=[1,8]</code> and successfully passes about 100 tests of <code>wstest</code> <a href="http://autobahn.ws/testsuite/">Autobahn TestSuite</a>. Recent test reports plased at: <code>./testsuite-raw-ws-autobahn/reports/servers/index.html</code> For testing purposes have implemented <code>./echo-servers-raw-ws.js</code> which responds to <code>wstest</code> requests.</p></li> <li><p>Server-Sent Events (SSE) implementation: <code>./backend/lib/sse/*</code> It is absolutely minimal implementation for chat-app purposes.</p></li> </ul> <p>Both libraries have similar structure: <code>socket/endpoint</code> representation connected to <code>http.Server</code> trough similar <code>middleware</code>. It is possible to host HTTP, WebSocket and SSE service on same <code>url:port</code>.</p> <p>This WebSocket / SSE libraries used in chat servers: </p> <ul> <li><code>./chat-server-sse-raw-ws.js</code> - two channels of communication: SSE for outgoing and WebSocket for incomming data</li> <li><code>./chat-server-raw-ws.js</code>. - single channel of communication: WebSocket</li> </ul> <p>Other two chat-server implementation was used as reference and depend on <code>ws</code> library.</p> <h2><a id="user-content-backend-logic-layer" class="anchor" href="#backend-logic-layer" aria-hidden="true"><span class="octicon octicon-link"></span></a>Backend Logic Layer</h2> <p>Chat behaviour implemented with low-coupling with transport. It is easy to configure chat-server both for single WebSocket and dual SSE+WebSocket channels.</p> <p>For this design purposes <code>ChatRoom</code> interacts with abstract <code>Peer</code> representation. <code>Peer</code> relies on <code>AbstractTransportFacade</code> API <code>./lib/transport/*</code>. <code>AbstractTransportFacade</code> extended by appropriate facade.</p> <p>This approach allows to implement hybrid channel transparently for application\'s logic layer (see usage of <code>HybridChannel</code>). Additionally hybrid channel architecture requires mapping ("pairing") incomming and outgoing channels. This is concern of <code>ChannelController</code>.</p> <p>Backend Logic Layer covered by tests partially (see <code>./spec/*</code>).</p> <h2><a id="user-content-front-end" class="anchor" href="#front-end" aria-hidden="true"><span class="octicon octicon-link"></span></a>Front-end</h2> <p>Front-end implemented using Angular. Development environment depends on <a href="http://yeoman.io/">Yeoman</a> and <code>grunt-cli</code>. Recent "compiled" release placed in: <code>./frontend/dist</code>. It not depends on yeoman and may be served by any HTTP-server.</p> <p>Front-end have may work both with single (<a href="#/chat-ws">#/chat-ws</a>) and hybrid (<a href="#/chat-sse">#/chat-sse</a>) chnnels. Simple SSE and WebSocket endpoint-services was implemented for this purposes:</p> <ul> <li><code>./frontend/app/scripts/services/sse_endpoint.js</code></li> <li><code>./frontend/app/scripts/services/web_socket_endpoint.js</code></li> </ul> <p>Base chat controller <code>./frontend/app/scripts/controllers/chat.js</code> have two extensions: <code>chat_sse.js</code> and <code>chat_ws.js</code>.</p> <h1><a id="user-content-tdd" class="anchor" href="#tdd" aria-hidden="true"><span class="octicon octicon-link"></span></a>TDD</h1> <p>From beginning backend was developed using TDD approach. This approach allows to significantly reduce integration issues. For example the backend v0.0.1 (<a href="https://github.com/x2es/test-chat-app/tree/v0.0.1">https://github.com/x2es/test-chat-app/tree/v0.0.1</a>) was developped without any integration debugging. I had focused only on specs implementation and was not wasted time on continious debugging. But I have invested gained time to test coverate, which will help on next steps of development.</p> <p>Another benefit is clarity of development process. At any point you can run <code>npm test</code> and see progress. TDD specs is a good reflection of an application backlog. It should be easy to understand progress even by non-programmers, especially by product/project managers.</p> <p>Implemented Logic Layer at this point was not significantly changed later.</p> <h1><a id="user-content-backend" class="anchor" href="#backend" aria-hidden="true"><span class="octicon octicon-link"></span></a>Backend</h1> <pre><code>$ cd backend\n$ npm install\n</code></pre> <p>Run tests:</p> <pre><code>$ npm test\n</code></pre> <p>Run server:</p> <pre><code>$ npm start\n</code></pre> <h1><a id="user-content-front-end-1" class="anchor" href="#front-end-1" aria-hidden="true"><span class="octicon octicon-link"></span></a>Front-end</h1> <p>Depends on yeoman and <code>grunt-cli</code></p> <pre><code>$ cd frontend\n$ npm install\n$ bower install\n</code></pre> <p>Run server:</p> <pre><code>$ grunt serve\n</code></pre> </article> </div>'),a.put("views/chat.html",'<div class="chat-window"> <div ng-messages="connection.$error"> <div class="error-message" ng-message="failed_ws">Unable to connect to server (WebSocket)!</div> <div class="error-message" ng-message="failed_sse">Unable to connect to server (SSE)!</div> </div> <input type="text" class="nickname" ng-model="nickname" placeholder="{{defaultNickname}}" ng-keypress="nicknameKeypress($event)"> <div class="conversation"> <div class="message" ng-repeat="message in messages" ng-class="{ system: isSystem(message) }"> <span class="from" ng-click="appealTo($index)" ng-class="{ hidden: isSystem(message), me: isMe(message) }">{{message.from}}</span> <span class="body" ng-bind-html="br(message.body)"></span> </div> </div> <div class="input"> <form ng-submit="send()"> <button class="bt send" type="submit"></button> <textarea class="message-input" ng-model="inp_message" placeholder="Whatsup, {{getNickname()}}!" ng-keypress="inputKeypress($event)"></textarea> <div class="notifications" ng-class="{ hidden: noOneTyping }">{{typers.join(\', \')}} are typing...</div> </form> </div> </div>')}]);