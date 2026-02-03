import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://reqres.in/api/users?page=${page}`
      );
      if (response && response.data && response.data.data) {
        setUsers(response.data.data);
        setTotalPages(response.data.total_pages);
      } else {
        console.error(`Failed to fetch users:`, error);
        alert("Failed to load users try again");
      }
      console.log(response.data.data);
    } catch (error) {
      console.error(`Failed to fetch users:`, error);
      alert("Failed to load users try again");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigate, page]);

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => page - 1);
    }
  };

  const handleEdit = (id) => {
    navigate(`/users/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete the user ?")) {
      try {
        await axios.delete(`https://reqres.in/api/users/${id}`);
        alert("User deleted Successfully");
      } catch (error) {
        console.error(`Failed to delete user:`, error);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className=" h-screen w-screen border-black border-2 bg-green-500">
      <h1 className="mb-4 text-center mt-20  text-4xl font-extrabold   md:text-5xl lg:text-6xl dark:text-white">
        UserList
      </h1>
      <div className="  mt-16  flex justify-center items-center ml-auto mr-auto">
        <div className="grid grid-cols-3  gap-6 ">
          {users.map((user) => (
            <div
              key={user.id}
              className="card flex  gap-4 box-border bg-white p-6 shadow-xl rounded-lg  "
            >
              <img
                src={user.avatar}
                alt="avatar"
                class="w-[150px] h-[150px]  p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              />

              <div className="personal_details p-1 mt-6 flex flex-col items-start justify-center">
                <div className="name text-xl font-bold">
                  Name:
                  <span className="text-lg font-medium ml-1">
                    {`${user.first_name} ${user.last_name}`}
                  </span>
                </div>
                <div className="text-xl font-bold">
                  Email:
                  <span className="text-lg font-medium ml-2 ">
                    {user.email}
                  </span>
                </div>

                <div className="Buttons   mt-20">
                  <button
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => {
                      handleEdit(user.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => {
                      handleDelete(user.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className=" Buttons flex flex-row gap-96  items-center justify-center mt-8 p-6">
        <button
          className="Button bg-white px-3 text-green-500 border-none font-semibold rounded-lg py-1 "
          onClick={handlePrev}
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          className="Button bg-white px-3 text-green-500 border-none font-semibold rounded-lg py-1 "
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
