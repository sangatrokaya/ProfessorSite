const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* PROFILE */}
      <section className="text-center">
        <h1 className="text-3xl font-bold mb-2">Asst. Prof. Bhim Rokaya</h1>
        <p className="text-gray-600 mb-4">Teacher • Researcher • Educator</p>
        <p className="text-gray-700 leading-relaxed">
          I am a dedicated professional with a strong passion for teaching,
          research, and academic innovation. My works focuses on advancing
          knowledge through research publications, classroom excellence, and
          mentorship.
        </p>
      </section>

      {/* EXPERTISE */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Research Interests</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Ethnomathematics</li>
          <li>Topology</li>
          <li>Geometry</li>
          <li>Research Methodologies</li>
        </ul>
      </section>

      {/* EDUCATION / EXPERIENCE */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Education & EXperience</h2>
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Ph.D. Scholar</strong> in Mathematics Education — Tribhuvan
            University (TU), Nepal
          </li>
          <li>
            <strong>M.Phil.</strong> in Mathematics Education — Nepal Open
            University (NOU), Nepal
          </li>
          <li>
            <strong>M.Ed.</strong> in Mathematics Education — Tribhuvan
            University (TU), Nepal
          </li>
          <li>
            <strong>Asst. Prof.</strong> at Mid-West University (MWU), Nepal
          </li>
        </ul>
      </section>
    </div>
  );
};

export default About;
