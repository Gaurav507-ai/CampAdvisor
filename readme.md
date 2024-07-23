# 🏕 CampAdvisor Project

### Description

CampAdvisor is a web-based application where users can view and create campgrounds. Users can add
campgrounds and comment on them by registering on the website.

### Main Function/Feature

- Users can create, edit, and remove campgrounds.
- Users can locate their campgrounds, and then see the location pins on the world map view.
- Users can review campgrounds, and edit or remove their specific reviews.
- Flash messages regarding actions.
- Users can see location of campground on map (Used mapbox api).
- Users can see real time weather information of campgrounds.

### Language and Tools

- HTML5, CSS3, EJS Templating
- Bootstrap 5
- Javascript
- Node.js
- Express.js
- NPM
- REST API
- NoSQL, MongoDB, Schema Design, Mongoose
- Authentication (Sessions), Authorization, Password.js
- Image Upload and Storage (Cloudinary)
- Maps and Geocoding

### Run it locally
1. Install [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get API key, secret code and cloud name
3. Create a mapbox account to get token
4. Create an openweather account to get api key

```
git clone https://github.com/Gaurav507-ai/CampAdvisor.git
cd YelpCamp
npm install
```

5. Create a .env file in the root of the project and add the following:

```
CLOUDINARY_CLOUD_NAME='<cloud_name>'
CLOUDINARY_KEY='<key>'
CLOUDINARY_SECRET='<secret>'
MAPBOX_TOKEN='<token>'
OPENWEATHER_API_KEY = '<key>'
```

6. Run ```node app.js``` in the terminal with the project.

### Website Images

#### Landing Page

![](Images/Index_page.png)

#### Campground Information

![](Images/campground_info.PNG)
