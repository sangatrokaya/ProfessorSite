import { useState, useEffect } from "react";
import api from "@/services/api";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    bio: "",
    about: "",
  });

  useEffect(() => {
    api.get("/api/profile").then(({ data }) => {
      if (data) setForm(data);
    });
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    await api.put("/api/profile", form);
    alert("Profile updated successfully!");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin Profile</h2>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          type="text"
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
