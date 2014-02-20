Admin FreshFinder 
===========

View searchs from FreshFinder users on a Google Map with real-time updating.  


Requires
----------------
* node
* redis

Setup
---------------
```sh
cd dashboard-admin/
npm install
```

Add your Google Maps API key on line 89 of views/layout.jade where it says "YOUR_API_KEY". [Generate your Google Maps Key]
(https://developers.google.com/maps/documentation/javascript/tutorial#api_key)

Quick Start
--------------------------------------------------------
Start the app:
```sh
node app
```

Navigate to:
```
http://localhost:8070/
```
