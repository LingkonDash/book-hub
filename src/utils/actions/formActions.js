import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

//login
export const onLoginSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const obj = Object.fromEntries(formData.entries());
  const { email, password } = obj

  console.log(obj);

  // const { data, error } = await authClient.signIn.email({
  //   email,
  //   password,
  //   callbackURL: process.env.NEXT_PUBLIC_BASE_URL,
  // });

  // if (error) {
  //   toast.error(error.message || "Login failed. Please try again.");
  //   return;
  // }

  // toast.success("Logged in successfully! Redirecting...");
  // setTimeout(() => {
  //   router.push("/")
  //   router.refresh();
  // }, 700);
};


// signup
export const onSignupSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const obj = Object.fromEntries(formData.entries());
  const { name, email, password, image } = obj

  console.log(obj);
  // const { data, error } = await authClient.signUp.email({
  //   name,
  //   email,
  //   password,
  //   image,
  //   callbackURL: process.env.NEXT_PUBLIC_BASE_URL,
  // });

  // if (error) {
  //   toast.error(error.message || "Signup failed. Please try again.");
  //   return;
  // }

  // toast.success("Registered successfully! Redirecting to login...");
  // setTimeout(() => {
  //   router.push("/login")
  //   router.refresh()
  // }, 700);
};

// google login
export const handleGoogleLogin = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: process.env.NEXT_PUBLIC_BASE_URL,
  });
};
