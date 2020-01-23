# MedRec-Server_v2
Medrec server using graphql

1. Install all packages : npm install --unsafe-perm --allow-root
2. npm start
3. sampleQuery.txt contains all queries which can be executed
4. Open localhost:4000 and you can visit docs and also execute queries

Note: 
1. After resgistering the user it is to be verified.
    a. go to prisma folder ("prisma-medrec") in command line
    b. type "docker-compose up -d" command in terminal
    c. type "prisma token" in terminal -> Copy token
    d. Go to localhost:4466/_admin and put token in top left setting icon wherein token field is specified
    e. Approve user by searching the user and setting verified to true
    f. these changes are to be saved by clicking "Save Changes to Database" 

2. Some field requires HTTP HEADERS to be passed when executing the query. HEADERS requires token to be generated with the login query given in sampleQuery with respective email and password.
    -> Format of header is given in login query
