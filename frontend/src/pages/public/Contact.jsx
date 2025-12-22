import { useState } from "react";
import api from "@/services/api";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/contact", form);
      setSuccess("Your message has been sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Contact</h1>
        <p className="text-gray-600">
          Feel free to reach out for academic collaboration, research inquiries,
          or general queries.
        </p>
      </section>

      <form
        onSubmit={submitHandler}
        className="space-y-6 bg-gray-200 p-6 border rounded-md"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={changeHandler}
            required
            className="w-full border bg-white px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={changeHandler}
            required
            className="w-full bg-white border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={changeHandler}
            required
            className="w-full bg-white border px-3 py-2 rounded-md"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-md"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {success && <p className="text-green-600 text-sm">{success}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default Contact;
