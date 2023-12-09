import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;
  if (method === "GET") {
    const reviews = await Review.find({}).populate('productId').sort({createdAt: -1});
    res.status(201).json(reviews);
  }
  if (method === "PUT") {
    const { id } = req.body;
    const { status } = req.body;
    console.log(id, status);
    const review = await Review.findById(id);
    review.status = status;
    await review.save();
    res.status(201).json(review);
  }
  if (method === "DELETE") {
    const { id } = req.query;
    console.log(id);
    await Review.deleteOne({ _id: id });
    res.status(201).json({message: "Review deleted"});
  }
}