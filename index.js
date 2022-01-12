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
		console.log(`Conencted to mongodb server at ${process.env.MONGO_CONNECTION_STRING}`);
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

app.route("/articles")
	.get((req, res) => {
		Article.find({}, (err, data) => {
			if (err) res.send(err);
			else res.send(data);
		});
	})
	.post((req, res) => {
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
	})
	.delete((req, res) => {
		Article.deleteMany({}, (err) => {
			if (err) res.send(err);
			else
				res.send({
					status: 200,
					message: "Successfully deleted all articles",
				});
		});
	});
app.route("/articles/:title")
	.get((req, res) => {
		const title = req.params.title;
		Article.findOne({ title: title }, (err, data) => {
			if (err) res.send(err);
			else {
				if (data) res.send(data);
				else
					res.send({
						status: 400,
						message: `No article with the title ${title}`,
					});
			}
		});
	})
	.put((req, res) => {
		const title = req.params.title;
		const newArticle = req.body;
		Article.updateOne(
			{ title: title },
			newArticle,
			(err) => {
				if (err) res.send(err);
				else
					res.send({
						status: 200,
						message: "Successfully updated",
					});
			}
		);
	})
	.patch((req, res) => {
		const title = req.params.title;
		let newArticle = req.body;
		Article.updateOne(
			{ title: title },
			{ $set: newArticle },
			(err) => {
				if (err) res.send(err);
				else
					res.send({
						status: 200,
						message: "Successfully updated",
					});
			}
		);
	})
	.delete((req, res) => {
		const title = req.params.title;
		Article.deleteOne(
			{ title: title },
			(err) => {
				if (err) res.send(err)
				else res.send({
					status: 200,
					message: "Successfully deleted article",
				})
			}
		);
	});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
