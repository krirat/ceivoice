JWT FLOW
Login/Signup --> password match --> server generates and returns signed JWT --> save JWT to localstorage --> Retrieve JWT from localstorage --> attach JWT to future protected routes
JWT SECRET FRORNTEND USAGE
on signup/login success --> save 'token' to local storage
on fetching other routes --> retrieve 'token' from local storage and attach headers as 'Authorization': `Bearer ${token}`
