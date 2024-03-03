### Requirements

- node js version v20.11.0
- mongoDB client
- mongosh

### Set Up

1. Go to program files --> MongoDB-->server--->bin Copy bin path and add it in enviornment feild
2. Open Configuration file (mongo.config)
   set folowing

-        replication:
               replSetName: rs0

3. open mongosh using command **mongosh**

- use folowing command

```bash
use admin
mongod --port 27017 --replSet rs0 --dbpath="C:\[give a folder name]\db0"
rs.initiate()
```

4.  In the Root folder create **.env** file and **serviceAccountKey.json** file (paste the credentials that you have created using firebase ,(make sure create service Account credentials) )
5.  Inside .env file paste this **\*MONGO_URL=mongodb://localhost:27017/apoorv?replicaSet=rs0**

### After above setup let

- Run **npm init**
- **npm start**

[Schema Diagram](https://app.eraser.io/workspace/LclcwGwi9ihCRSRupRBZ)
