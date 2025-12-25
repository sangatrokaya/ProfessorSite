import { useEffect, useState } from "react";
import api from "@/services/api";

const About = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/api/profile").then(({ data }) => setProfile(data));
  }, []);

  if (!profile) return null;

  return (
    <section className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold">{profile.name}</h1>
      <p className="text-gray-600">{profile.designation}</p>
      <p className="text-gray-700">{profile.bio}</p>
      <p className="mt-6 leading-relaxed">{profile.about}</p>
    </section>
  );
};

export default About;
