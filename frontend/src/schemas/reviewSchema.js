import * as Yup from "yup";

export const reviewSchema = Yup.object({
  rating: Yup.number().min(1).max(5).required(),
  comment: Yup.string()
    .min(6, "Review text must be at least 6 characters")
    .required("Review comment is required"),
});
