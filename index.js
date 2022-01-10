import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";
import { config } from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
config();
const app = express();
mongoose.connect(process.env.MONGO_CONNECTION_STRING, (err) => {
	if (err) console.log(err);
	else
		console.log(
			"Conencted to mongodb server at " +
				process.env.MONGO_CONNECTION_STRING
		);
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.static("public"));

let articles = [];
const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
});
const Article = new mongoose.model("Article", articleSchema);

app.get("/articles", (req, res) => {
	Article.find({}, (err, data) => {
		if (err) res.send(err);
		else res.send(data);
	});
});
app.post("/articles", (req, res) => {
	const newArticle = new Article(req.body);
	newArticle.save((err) => {
		if (err) res.send(err);
		else
			res.send({
				status: 200,
				message: "Successfully added new article",
				data: newArticle,
			});
	});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
