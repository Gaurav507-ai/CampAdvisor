var express 	= require("express");
var router 		= express.Router();
var Campground 	= require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = 'pk.eyJ1IjoiZ2stMTIiLCJhIjoiY2xieHhtd3Q2MGtqODN4bzVxYjI1a3k0NyJ9.WqQzC8gmkv-KT0J3VsfT0w';
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
// if you require the folder, the system will automatically require index.js under this folder
var middleware 	= require("../middleware");
var multer 		= require('multer');
var cloudinary 	= require('cloudinary');
const request = require('request');
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
    	callback(null, Date.now() + file.originalname);
  	}
});
const apiKey = '67f4bc2b63afdb805f27ff2219c3b39c';
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

cloudinary.config({ 
  	cloud_name: 'dhgxinkbb', 
  	api_key: '443192363473679',
  	api_secret: '1jy-uAhoHBCSehfftYTYB-uqG0s'
});

// INDEX - Show all campgrounds
router.get("/", function(req, res){
	// Get all campgrounds from DB
	var perPage = 8;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;
	var matchResult = null;
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.countDocuments({name: regex}).exec(function (err, count) {
				if(err){
					console.log(err);
					res.redirect('back');
				} else {
					if(allCampgrounds.length < 1){
						matchResult = 'No campgrounds match "' + req.query.search + '", please try again.';					
					} else {
						matchResult = 'Campgrounds match "' + req.query.search + '" :';
					}
					res.render("campgrounds/index", {
						campgrounds: allCampgrounds, 
						matchResult: matchResult,
						current: pageNumber, 
						pages: Math.ceil(count / perPage),
						search: req.query.search
					});
				}
			});
		});
	} else {
		Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.countDocuments().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        matchResult: matchResult,
                        search: false
                    });
                }
            });
        });
	}	
});

// Use the same URL "/campgrounds" is fine since get and post are different > Convention
// CREATE - Add new campgrounds to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), async function(req, res) {
	cloudinary.v2.uploader.upload(req.file.path, async function(err, result) {
		if(err) {
		  req.flash('error', err.message);
		  return res.redirect('back');
		}
		// add cloudinary url for the image to the campground object under image property
		console.log(result.secure_url)	
		var name = req.body.name;
		var image = result.secure_url;
		var location = req.body.location;
		var desc = req.body.description;
		const geoData = await geocoder.forwardGeocode({
		query: req.body.location,
		limit: 1
		}).send()
		var author = {
		  id: req.user._id,
		  username: req.user.username
		}
		var cost = req.body.price;
		var newCampground = {name: name, image: image, description: desc, location: location, price: cost, author:author};
		newCampground.geometry = geoData.body.features[0].geometry;
		Campground.create(newCampground, function(err, campground) {
		  if (err) {
			req.flash('error', err.message);
			return res.redirect('back');
		   }
		   req.flash("success", campground.name + " Campground Successfully Created!");
		  res.redirect('/campgrounds/' + campground.id);
		});
	});
});

// "/campgrounds/new" > conventional name
// NEW - Show the form that would send the data to the post route
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			// render show template with that campground
			if(foundCampground){
				let city = foundCampground.location;
                let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
				request(url, function (err, response, body) {
                    if(err){
                        res.render('campgrounds/show', {campground: foundCampground});
                    } else {
                        
                    let condition = JSON.parse(body);
                    if(condition.main == undefined){
                        res.render('campgrounds/show', {campground: foundCampground});
                        } else {
                            res.render("campgrounds/show", {
                                campground: foundCampground,
                                temp: condition.main.temp,
                                wind: condition.wind.speed,
                                weather: condition.weather[0].description,
                            });     
                        }
                    }
                });
			}else {
                req.flash("error", "the campgrounds has been deleted!");
                res.redirect("/campgrounds");
            }
			//res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		res.render("campgrounds/edit", {campground: campground});
	});
});

// UPDATE Campground Route

router.put("/:id", upload.single('image'), function(req, res){
	// Find and update the correct campground
	Campground.findById(req.params.id, async function(err, campground){
		if(err){
			req.flash('error', err.message);
			res.redirect("back");
		} else {
			if (req.file) {
				try {
					//await cloudinary.v2.uploader.destroy(campground.imageId);
					var result = await cloudinary.v2.uploader.upload(req.file.path);
					campground.imageId = result.public_id;
					campground.image = result.secure_url;
				} catch(err) {
					req.flash('error', err.message);
					res.redirect("back");
				};
			};
			const geoData = await geocoder.forwardGeocode({
			query: req.body.campground.location,
			limit: 1
			}).send()
			campground.price = req.body.campground.price;
			campground.name = req.body.campground.name;
			campground.description = req.body.campground.description;
			campground.location = req.body.campground.location;
			campground.geometry = geoData.body.features[0].geometry;
			campground.save();
			req.flash("success", "Successfully Updated!");
			res.redirect("/campgrounds/" + campground._id);
		}
	});
	// Redirect somewhere(show page)
})

// DESTROY Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, async function(err, campground){
//	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash('error', err.message);
			return res.redirect("back");
		} else {
			try {
				//await cloudinary.v2.uploader.destroy(campground.imageId);
				campground.remove();
				req.flash('success', 'Campground deleted successfully!');
				res.redirect("/campgrounds");
			} catch (err) {
				req.flash('error', err.message);
				return res.redirect("back");
			}
		}
	})
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;