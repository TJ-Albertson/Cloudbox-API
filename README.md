# Cloudbox API  

Queries mongoDB and holds files for Cloudbox App. An Auth0 JWT is required in the authorization header to access all routes. Most of the routes utilize the email given in the JWT.

## Routes  

/files  
`Post`  
`Patch`  

/files/:email  
`Get`  

/files/:id  
`Delete`  

/files/folder  
`Post`  

/user  
`Get`  
`Put`  

/user/groups  
`Patch`  

/user/:email  
`Get`  
