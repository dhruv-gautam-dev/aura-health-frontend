import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

const LoginUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login(email, password); // called the service layer
      localStorage.setItem("token", result.token);
      alert("Login Successful");
      navigate("/user");
    } catch (err) {
      const error = err as { error?: string };
      setError(error.error || "Invalid Credentials");
    }
  };
  return (
    <section className="bg-green-500 light:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="mb-4 text-center   mb-20  text-4xl font-extrabold   md:text-5xl lg:text-6xl dark:text-white">
          ReqRes user app
        </h1>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-800 light:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-green-500 md:text-2xl light:text-white">
              Sign in to your account
            </h1>
            {error && <p>{error}</p>}
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  name="email"
                  id="email"
                  className="bg-green-200 border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-green-100  light:placeholder-white-900  "
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-green-200 border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-green-100  light:placeholder-white-900  "
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="  text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Sign in
                </button>
              </div>

              <p className="text-sm font-semibold  text-green-500 dark:text-green-400">
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don't have an account yet ?{"  "}
                </span>
                Sign up
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginUser;
