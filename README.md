=======
# Demo

https://webdev108.herokuapp.com/

# Group 

Member1:  Jaako Rajala, jaakko.rajala@tuni.fi, 
responsible for: Project development/planning/UI/a part of readme.md

Member2:  Jin Luo, jin.luo@tuni.fi, 
responsible for: project planning, project implementation, debugging 


### The project structure

```
.
├── index.js                            --> connects to database, starts the server. 
├── package.json                        --> holds various metadata relevant to the project.
├── routes.js                           --> Directs HTTP requests to controllers, returns the responses (MVC)
│
├── auth                                --> authentication
│   └──  auth.js                        --> checks upon login that details are valid (IE: authentication). 
│
├── controllers                         --> CONTROLLERS (MVC)
│   ├── products.js                     --> controller for product (the model)
│   ├── orders.js                       --> controller for order (the model) //Added file
│   └── users.js                        --> controller for user (the model)
│
├── models                              --> MongoDB database collection schemas, models (MVC). 
│   ├── user.js                         --> Schema model for users -
│   ├── product.js                      --> Schema model for products - //Added file
│   └── order.js                        --> Schema model for user orders - //Added file
│                               
├── public                              --> Contents for client side presentation                             
│   ├── js                              --> javascript codes running on the client sides
│   └── css                             --> CSS files used to format the webpage
│
├── utils                               --> utils: used by routes and controllers
│   ├── requestUtils.js                 --> Contains request content handlers and validators. 
│   └── responseUtils.js                --> Contains the headers for responses. 
│
├── test                                --> tests
│   ├── auth                            --> Tests for authentication
│   ├── controllers                     --> Tests for controllers
│   |   ├──products.test.js             --> Tests controllers/products.js functionality. 
│   |   └──users.test.js                --> Tests controllers/users.js functionality
│   |
│   └── own                             --> Own tests
│       ├── routeHelperFunction.js      --> Tests the Added route helper functions
│       ├── controllers                 --> Own tests for controllers
│       │   ├── products.test.js        --> Tests functionality of products controller 
│       │   └── orders.test.js          --> Tests functionality of orders controller 
│       │
│       └── models                      --> Own tests for models
│           ├── product.test.js         --> Tests Schema model for product 
│           └── order.test.js           --> Tests Schema model for order 
│
└── 


```

## The architecture 

### Web pages
![Web pages](/UMLdiagrams/webPages.png)

### Data models
```
1. user
- Description: the user model is used to store the user information
- Attributes:    
     ├──_id              --> string  
     ├──name             --> string
     ├──password         --> string
     ├──email            --> string
     └──role             --> string

2. product
- Description: the product model is used to store the product information
- Attributes:    
     ├──_id              --> string  
     ├──name             --> string
     ├──price            --> string
     ├──image            --> string
     └──description      --> string

3. order
- Description: the order model is used to store the order information for each user
- Attributes:    
     ├──_id              --> string  
     ├──items            --> [itemSchema]
     └──customerId       --> string

4. item
- Description: the item model, as itemSchema, is the sub-model of the order model above
- Attributes:    
     ├──product:            
     │    ├──_id              --> string
     │    ├──name             --> string
     │    ├──price            --> number
     │    └──description      --> string
     │
     └──quantity         --> number
```





