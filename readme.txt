To run this use command : nodemon server.js 

 
Follow these step between production and development:
1 ) go to config.env 
2 ) set NODE_ENV=production or NODE_ENV=development
3 )  Note that production and development are in small letters.

General Instructions:

For user signup use route : /api/khaapa/user/signup

For admin signup use route: /api/khaapa/user/admin-signup

Similarly, 
for admin login use route: /api/khaapa/user/admin-login
for user login use route: /api/khaapa/user/login

General format for sign up :
{"name":"-",
"email":"-",
"password":"-",
"ConfirmPassword":"-",}

For login:
{"email":"-",
"password":"-",}

For accessing protected routes, ensure you are logged in by setting authorization as Bearer Token and sending your token in header (Postman)

For Forget Password, send email in body to get reset token

For Reset Password, send password and confirm password in body with reset token in request url (/resetPassword/:token)


