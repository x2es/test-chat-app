
Overview
========

This is sample WebSocket chat application. Github: https://github.com/x2es/test-chat-app 

It was developed using TDD approach. This approach allows to significantly reduce integration issues.
For example the backend v0.0.1 (https://github.com/x2es/test-chat-app/tree/v0.0.1) was developped without any 
integration debugging. I had focused only on specs implementation and was not wasted time on continious debugging. 
But I have invested gained time to test coverate, which will help on next steps of development.

Another benefit is clarity of development process. At any point you can run `npm test` and see progress.
TDD specs is a good reflection of an application backlog. It should be easy to understand progress even by 
non-programmers, especially by product/project managers.

Backend
=======

  $ cd backend
  $ npm install

Run tests:

  $ npm test

Run server:

  $ npm start
