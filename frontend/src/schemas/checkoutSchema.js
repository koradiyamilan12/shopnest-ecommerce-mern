import * as Yup from "yup";

export const checkoutSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  street: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal/ZIP code is required"),
  country: Yup.string().required("Country is required"),
});
