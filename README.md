# JWT USAGE

## JWT FLOW

Login/Signup --> password match --> server generates and returns signed JWT --> save JWT to localstorage --> Retrieve JWT from localstorage --> attach JWT to future protected routes

## JWT SECRET FRORNTEND USAGE

on signup/login success --> save 'token' to local storage
on fetching other routes --> retrieve 'token' from local storage and attach headers as 'Authorization': `Bearer ${token}`

## GOOGLE LOGIN COOKIE FLOW

click login button --> Backend -(redirect)-> Google -(redirect)-> Backend --> creates a cookie named auth_token with the JWT inside. --> backend -(redirect)-> /auth/success --> authSuccess.jsx logic (similar to normal login but with cookie) --> page go to /dashboard (or whatever set)
