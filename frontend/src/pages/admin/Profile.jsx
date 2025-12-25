import { useState, useEffect } from "react";
import api from "@/services/api";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    bio: "",
    about: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/profile");
        if (data) setForm(data);
      } catch (error) {
        console.log("Profile not found (first setup)!");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    await api.put("/api/profile", form);
    alert("Profile saved successfully!");
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
          onChange={(e) => ({ ...form, designation: e.target.value })}
        />

        <textarea
          className="border p-2 w-full"
          rows="4"
          placeholder="Short Bio"
          value={form.bio}
          onChange={(e) => ({ ...form, bio: e.target.value })}
        />

        <textarea
          className="border p-2 w-full"
          rows="6"
          placeholder="About Description"
          value={form.about}
          onChange={(e) => ({ ...form, about: e.target.value })}
        />

        <button className="bg-black text-white px-4 py-2">Save Profile</button>
      </form>
    </div>
  );
};
export default Profile;
