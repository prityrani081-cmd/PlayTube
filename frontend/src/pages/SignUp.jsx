import { useState } from "react";
import { FaArrowLeft, FaUserCircle, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/google.png";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

function SignUp() {
  const [step, setStep] = useState(1);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1) {
      if (!userName.trim() || !email.trim()) {
        alert("Fill all the fields");
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      if (!password || !confirmPassword) {
        alert("Fill all the fields");
        return;
      }

      if (password !== confirmPassword) {
        alert("Password does not match");
        return;
      }

      setStep(3);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  //backend connection with api(axios)
  const handleSignUp = async () => {
    if (!backendImage) {
      alert("Please choose a profile picture");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photoUrl", backendImage);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        formData,
        { withCredentials: true },
      );
      console.log(result.data);
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log("Signup error:", error.response?.data);
      console.log("Status:", error.response?.status);

      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#181818] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-[#202124] p-6 shadow-lg sm:p-10">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button
            type="button"
            onClick={handleBack}
            className="mr-3 text-gray-300 transition hover:text-white"
            aria-label="Go back"
          >
            <FaArrowLeft size={18} />
          </button>

          <span className="text-xl font-medium text-white">Create Account</span>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <h1 className="mb-5 flex items-center gap-2 text-3xl font-normal text-white">
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
              Basic Info
            </h1>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="UserName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-md border border-gray-500 bg-transparent px-3 py-3 text-white outline-none placeholder:text-gray-400 focus:border-orange-500"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 w-full rounded-md border border-gray-500 bg-transparent px-3 py-3 text-white outline-none placeholder:text-gray-400 focus:border-orange-500"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-orange-500 px-6 py-2 text-white transition hover:bg-orange-600"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 2: Security */}
        {step === 2 && (
          <>
            <h1 className="mb-5 flex items-center gap-2 text-3xl font-normal text-white">
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
              Security
            </h1>

            <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-[#3c4043] px-3 py-2 text-sm text-white">
              <FaCircle size={12} />
              {email}
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3 w-full rounded-md border border-gray-500 bg-transparent px-3 py-3 text-white outline-none placeholder:text-gray-400 focus:border-orange-500"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-3 w-full rounded-md border border-gray-500 bg-transparent px-3 py-3 text-white outline-none placeholder:text-gray-400 focus:border-orange-500"
            />

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="accent-orange-500"
              />
              Show Password
            </label>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-orange-500 px-6 py-2 text-white transition hover:bg-orange-600"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3: Choose Avatar */}
        {step === 3 && (
          <>
            <h1 className="mb-6 flex items-center gap-2 text-3xl font-normal text-white">
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
              Choose Avatar
            </h1>

            <div className="mb-6 flex items-center gap-4">
              {frontendImage ? (
                <img
                  src={frontendImage}
                  alt="Profile preview"
                  className="h-20 w-20 rounded-full border-2 border-gray-500 object-cover"
                />
              ) : (
                <FaUserCircle size={80} className="shrink-0 text-gray-500" />
              )}

              <div className="min-w-0">
                <p className="mb-2 text-xs text-gray-300">
                  Upload Profile Picture
                </p>

                <label className="inline-block cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-xs text-white transition hover:bg-blue-700">
                  Choose file
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 max-w-40 truncate text-xs text-gray-400">
                  {backendImage ? backendImage.name : "No file chosen"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSignUp}
                className="rounded-full bg-green-500 px-6 py-3 text-sm text-white transition hover:bg-green-600"
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUp;
