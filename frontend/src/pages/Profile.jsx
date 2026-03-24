import { useAuth } from "../Context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 border rounded w-full max-w-md">

        <h1 className="text-2xl font-semibold mb-6">
          My Profile
        </h1>

        <p className="mb-2">
          <b>Name:</b> {user.user.name}
        </p>
        <p className="mb-6">
          <b>Email:</b> {user.user.email}
        </p>

        <button
          onClick={logout}
          className="w-full bg-black text-white py-2"
        >
          Logout
        </button>

      </div>
    </section>
  );
};

export default Profile;
