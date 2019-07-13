var express = require("express");
var app = express();
var mongoose = require("mongoose");


mongoose.connect("mongodb+srv://sand123:sand123@cluster0-t0jwv.gcp.mongodb.net/product_details?retryWrites=true&w=majoritys", { useNewUrlParser: true });

app.set("view engine","ejs");

var productSchema = new mongoose.Schema({
	name: String,
	code: String,
	price: String,
	date: Date,
	type: String
});

var Product = mongoose.model("Product", productSchema);

app.get("/",function(req,res){
	res.redirect("/products/1");
});


app.get("/products/:page",function(req,res){
	var perPage = 10;
	var page = req.params.page;
	Product
		.find({})
		.skip((perPage * page) - perPage)
		.limit(perPage)  
		.exec(function(err,product){
			Product.countDocuments().exec(function(err, count) {
		if(err){
			console.log(err);
		}
		else{
			res.render("product",{product:product, current: page, pages: Math.ceil(count/perPage)});
		}
	});
});
	});



app.get("/products/:type/:page",function(req,res){
	var perPage = 10;
	var page = req.params.page;
	var type = req.params.type;
	Product
		.find({"type":type.charAt(0).toUpperCase() + type.slice(1)})
		.skip((perPage * page) - perPage)
		.limit(perPage)  
		.exec(function(err,product){
			Product.count({"type":type.charAt(0).toUpperCase() + type.slice(1)}).exec(function(err, count) {
		if(err){
			console.log(err);
		}
		else{
			res.render("products",{product:product, current: page, pages: Math.ceil(count/perPage)});
		}
	});
});
	});



app.listen(process.env.PORT,process.env.IP,function(){
	console.log("Started");
});