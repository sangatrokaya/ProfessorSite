import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";
import { toast } from "react-toastify";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    bio: "",
    about: "",
  });

  // Get admin token (auth acces)
  const { adminInfo } = useSelector((state) => state.auth);
  const token = adminInfo?.token;

  useEffect(() => {
    if (initialized) return; // important guard

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/profile");

        // merge instead of overwrite
        setForm((prev) => ({ ...prev, ...data }));
        setInitialized(true);
      } catch (error) {
        console.log("Profile not found yet!");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [initialized]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error("Profile save failed!");
      console.error("SAVE ERROR:", error.response?.data);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Admin Profile</h2>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Designation"
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
        />

        <textarea
          className="border p-2 w-full"
          rows="4"
          placeholder="Short Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <textarea
          className="border p-2 w-full"
          rows="6"
          placeholder="About Description"
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />

        <button type="submit" className="bg-black text-white px-4 py-2">
          Save Profile
        </button>
      </form>
    </div>
  );
};
export default Profile;
