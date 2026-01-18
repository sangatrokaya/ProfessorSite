import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Send,
  Heart,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  const navigationLinks = [
    {
      title: "Home",
      to: "/",
    },
    {
      title: "About",
      to: "/about",
    },
    {
      title: "Career",
      to: "/career",
    },
  ];

  const resourceLinks = [
    {
      title: "Papers & Pubs.",
      to: "/papers",
    },
    {
      title: "Courses",
      to: "/courses",
    },
    {
      title: "Blogs",
      to: "/blogs",
    },
    {
      title: "Videos",
      to: "/videos",
    },
  ];

  const legalLinks = [
    {
      title: "Privacy Policy",
      to: "/privacy",
    },
    {
      title: "Terms of Services",
      to: "/terms",
    },
    {
      title: "Cookie Policy",
      to: "/cookies",
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/bhim-rokaya-760128173/",
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/bhim.rokaya.9",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/bhimrokaya815/",
      label: "Instagram",
      color: "hover:text-red-700",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@chautarieducationalgroup",
      label: "YouTube",
      color: "hover:text-red-600",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "bhim.rokaya@example.com",
      href: "mailto:bhim.rokaya@example.com",
    },
    { icon: Phone, text: "+977 XXX-XXXXXXX", href: "tel:+977XXXXXXXXX" },
    { icon: MapPin, text: "Kathmandu, Nepal" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand and Newsletter (Takes more space) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 group w-fit">
                {/* <GraduationCap className="w-6 h-6 text-primary" /> */}
                <div className="relative">
                  <img
                    src="/logo.jpg"
                    alt="Bhim Rokaya Profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Asst. Prof. Bhim Rokaya
                </span>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Assistant Professor dedicated to academic excellence, innovative
                research, and inspiring the next generation of learners in
                modern computing and technology.
              </p>
            </div>

            {/* Newsletter CTA */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Stay Updated!
                </h3>
                <p className="text-xs font-semibold text-muted-foreground">
                  Get all the latest research updates and course announcements
                </p>
              </div>

              {isSubscribed ? (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-lg">
                  <Send className="w-4 h-4" />
                  <span>Successfully subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 text-sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="h-10 px-4"
                  >
                    {isSubmitting ? (
                      "..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all hover:-translate-y-1 ${social.color}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.title}</span>
                    {link.title === "Career" && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Legal Info
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => (
                <li key={index}>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-start gap-2 group"
                    >
                      <contact.icon className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="break-words">{contact.text}</span>
                    </a>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <contact.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{contact.text}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="mt-6">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/contact">
                  <Mail className="w-4 h-4 mr-0" />
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            {/* Copyright */}
            <div className="flex items-center gap-1">
              <span>
                &copy; {new Date().getFullYear()} Bhim Rokaya. All rights
                reserved.
              </span>
            </div>

            {/* Developer Credit */}
            <div className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <a
                href="https://www.instagram.com/cswithsangat/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                Sangat Rokaya
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
