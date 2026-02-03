import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditUSer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(" ");

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://reqres.in/api/users/${id}`);
      if (response && response.data && response.data.data) {
        const { first_name, last_name, email, avatar } = response.data.data;
        setUser({ first_name, last_name, email });
        setAvatar({ avatar });
        console.log(avatar);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      alert("Failed to load user details.");
    }
  };
  useEffect(() => {
    fetchUser();
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = (id) => {
    navigate(`/user`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, user);
      alert(`user updated Successfully `);
      navigate("/user");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user.");
    }
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center  border-black border-2 bg-green-500">
      <div className="card flex flex-col items-center justify-center gap-4 w-1/3 box-border bg-white p-6 shadow-xl rounded-lg  ">
        <h1 className="mb-10 text-center mt-10  text-4xl font-extrabold   md:text-5xl lg:text-6xl ">
          Edit User
        </h1>
        <img
          src={avatar}
          alt="avatar"
          class="w-[150px] h-[150px]  p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
        />

        <form onSubmit={handleSubmit}>
          <div className="name text-xl font-bold">
            <label className="text-xl font-bold">First Name: </label>
            <input
              className="text-lg font-medium ml-2 "
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="name text-xl font-bold">
            <label className="text-xl font-bold">Last Name:</label>
            <input
              className="text-lg font-medium ml-4 "
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="name text-xl font-bold">
            <label className="text-xl font-bold">Email:</label>
            <input
              className="text-lg font-medium ml-16 "
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-14 flex flex-row justify-center items-center gap-12">
            <button
              class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              type="submit"
            >
              Submit
            </button>
            <button
              class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              type="button"
              onClick={handleCancel}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUSer;
