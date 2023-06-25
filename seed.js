var mongoose 	= require("mongoose");
var Campground 	= require("./models/campground");
var Comment 	= require("./models/comment");
var data = [
	{
		name:"Taipei",
		image:"https://source.unsplash.com/1600x900/?camp",
		description: "It is the capital of Taiwan, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name:"Taichung",
		image:"https://source.unsplash.com/2400x1600/?camp",
		description: "It is in the middle of Taiwan, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name:"Hsinchu",
		image:"https://source.unsplash.com/1920x1458/?camp",
		description: "It is my hometown, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
]
// remove() > deleteMany(): Because of DeprecationWarning
function seedDB(){
	// Remove all campgrounds
	Campground.deleteMany({}, function(err){
		// if(err){
		// 	console.log(err);
		// }
		// console.log("removed campground");

		// // Add a few campgrounds > Inside the remove function
		// data.forEach(function(seed){
		// 	Campground.create(seed, function(err, campground){
		// 		if(err){
		// 			console.log(err);
		// 		} else {
		// 			console.log("added a campground");
		// 			// Create a comment
		// 			Comment.create(
		// 			{
		// 				text: "The place is great, but I wish there was Internet",
		// 				author: "Homer"
		// 			}, function(err, comment){
		// 				if(err){
		// 					console.log(err);
		// 				} else {
		// 					campground.comments.push(comment);
		// 					campground.save();
		// 					console.log("Created new comment");
		// 				}
		// 			});
		// 		}
		// 	})
		// });
	});


	// Add a few comments
}

module.exports = seedDB;