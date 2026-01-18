import { useEffect, useState } from "react";
import api from "@/services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
  Download,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/profile")
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-[300px_1fr] gap-12">
        <Skeleton className="w-64 h-64 rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Profile not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-10" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
            {/* Profile Image */}
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                {profile.photo ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="relative w-64 h-64 object-cover rounded-2xl border-4 border-white dark:border-slate-800 shadow-2xl"
                    />
                  </>
                ) : (
                  <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-muted-foreground border-4 border-white dark:border-slate-800 shadow-2xl">
                    <Briefcase className="w-16 h-16" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Available
                </div>
              </div>
            </div>

            {/* Name + Bio + Quick Actions */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Educator & Researcher
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  {profile.name}
                </h1>

                {profile.designation && (
                  <p className="text-xl text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    {profile.designation}
                  </p>
                )}

                {profile.bio && (
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Quick Contact & Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                {profile.contact?.email && (
                  <Button size="lg" asChild>
                    <a href={`mailto:${profile.contact.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email Me
                    </a>
                  </Button>
                )}

                <Button size="lg" variant="outline" asChild>
                  <a
                    href="/cv/Bhim_Rokaya_CV.pdf"
                    // download="Bhim_Rokaya_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </a>
                </Button>
              </div>

              {/* Social Links */}
              {profile.socials && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {profile.socials.linkedin && (
                    <SocialButton
                      icon={Linkedin}
                      url={profile.socials.linkedin}
                      label="LinkedIn"
                      color="hover:text-blue-600"
                    />
                  )}
                  {profile.socials.facebook && (
                    <SocialButton
                      icon={Facebook}
                      url={profile.socials.facebook}
                      label="Facebook"
                      color="hover:text-blue-500"
                    />
                  )}
                  {profile.socials.instagram && (
                    <SocialButton
                      icon={Instagram}
                      url={profile.socials.instagram}
                      label="Instagram"
                      color="hover:text-pink-600"
                    />
                  )}
                  {profile.socials.youtube && (
                    <SocialButton
                      icon={Youtube}
                      url={profile.socials.youtube}
                      label="YouTube"
                      color="hover:text-red-600"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* About Section */}
        {profile.about && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
            </div>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {profile.about}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Information Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Details */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Contact Information</h3>
              </div>

              <div className="space-y-4">
                {profile.contact?.email && (
                  <ContactItem
                    icon={Mail}
                    label="Email"
                    value={profile.contact.email}
                    href={`mailto:${profile.contact.email}`}
                  />
                )}

                {profile.contact?.phone && (
                  <ContactItem
                    icon={Phone}
                    label="Phone"
                    value={profile.contact.phone}
                    href={`tel:${profile.contact.phone}`}
                  />
                )}

                {profile.contact?.website && (
                  <ContactItem
                    icon={Globe}
                    label="Website"
                    value={profile.contact.website}
                    href={profile.contact.website}
                    external
                  />
                )}

                {profile.contact?.location && (
                  <ContactItem
                    icon={MapPin}
                    label="Location"
                    value={profile.contact.location}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          {profile.socials && (
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Social Media Handles
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {profile.socials?.linkedin && (
                    <SocialCard
                      icon={Linkedin}
                      label="LinkedIn"
                      url={profile.socials.linkedin}
                      color="bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
                    />
                  )}
                  {profile.socials?.facebook && (
                    <SocialCard
                      icon={Facebook}
                      label="Facebook"
                      url={profile.socials.facebook}
                      color="bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
                    />
                  )}
                  {profile.socials?.instagram && (
                    <SocialCard
                      icon={Instagram}
                      label="Instagram"
                      url={profile.socials.instagram}
                      color="bg-pink-50 dark:bg-pink-950 hover:bg-pink-100 dark:hover:bg-pink-900"
                    />
                  )}
                  {profile.socials?.youtube && (
                    <SocialCard
                      icon={Youtube}
                      label="YouTube"
                      url={profile.socials.youtube}
                      color="bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

// Contact Item Component
const ContactItem = ({ icon: Icon, label, value, href, external }) => (
  <div className="flex items-start gap-3 group">
    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-primary/10 transition-colors">
      <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary transition-colors break-words flex items-center gap-1"
        >
          {value}
          {external && <ExternalLink className="w-3 h-3 flex-shrink-0" />}
        </a>
      ) : (
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {value}
        </p>
      )}
    </div>
  </div>
);

// Social Button Component (for hero section)
const SocialButton = ({ icon: Icon, url, label, color }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all hover:-translate-y-1 shadow-sm hover:shadow-md ${color}`}
  >
    <Icon className="w-5 h-5" />
  </a>
);

// Social Card Component (for contact section)
const SocialCard = ({ icon: Icon, label, url, color }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-primary transition-all ${color}`}
  >
    <Icon className="w-6 h-6" />
    <span className="text-sm font-medium">{label}</span>
  </a>
);

export default About;
