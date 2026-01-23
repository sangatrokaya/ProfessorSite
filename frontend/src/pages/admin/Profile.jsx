import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";

import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Briefcase,
  FileText,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Save,
  Loader2,
} from "lucide-react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    bio: "",
    about: "",
    contact: {
      email: "",
      phone: "",
      website: "",
    },
    socials: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
    photo: "",
  });

  // Get admin token (auth acces)
  const { adminInfo } = useSelector((state) => state.auth);
  const token = adminInfo?.token;

  useEffect(() => {
    if (initialized) return; // important guard

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/profile");

        // merge instead of overwrite, ensuring nested objects are preserved
        setForm((prev) => ({
          ...prev,
          ...data,
          contact: { ...prev.contact, ...data.contact },
          socials: { ...prev.socials, ...data.socials },
        }));
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
    setSaving(true);
    // console.log("token: ", token);
    try {
      await api.put("/api/profile", form);

      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error("Profile save failed!");
      console.error("SAVE ERROR:", error.response?.data);
    } finally {
      setSaving(false);
    }
  };

  const handleContactChange = (field, value) => {
    setForm({
      ...form,
      contact: {
        ...form.contact,
        [field]: value,
      },
    });
  };

  const handleSocialChange = (field, value) => {
    setForm({
      ...form,
      socials: {
        ...form.socials,
        [field]: value,
      },
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your public profile information
        </p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Asst. Prof. Bhim Rokaya"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="e.g., Assistant Professor, Mathematics"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo URL</Label>
              <Input
                id="photo"
                placeholder="https://example.com/photo.jpg"
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL of your profile photo (upload to a service like
                Cloudinary first)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                placeholder="A brief introduction that appears on your profile"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Keep it concise - this appears in the hero section
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About (Full Description)</Label>
              <Textarea
                id="about"
                rows={8}
                placeholder="Write a detailed description about your background, research interests, teaching philosophy, achievements, etc..."
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This appears in the main "About Me" section on your profile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="your.email@example.com"
                  value={form.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  placeholder="+977 XXX-XXXXXXX"
                  value={form.contact.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Personal Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="website"
                  type="url"
                  className="pl-10"
                  placeholder="https://yourwebsite.com"
                  value={form.contact.website}
                  onChange={(e) =>
                    handleContactChange("website", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-3 w-4 h-4 text-blue-600" />
                <Input
                  id="linkedin"
                  type="url"
                  className="pl-10"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  value={form.socials.linkedin}
                  onChange={(e) =>
                    handleSocialChange("linkedin", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <div className="relative">
                <Facebook className="absolute left-3 top-3 w-4 h-4 text-blue-500" />
                <Input
                  id="facebook"
                  type="url"
                  className="pl-10"
                  placeholder="https://www.facebook.com/yourprofile"
                  value={form.socials.facebook}
                  onChange={(e) =>
                    handleSocialChange("facebook", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3 w-4 h-4 text-pink-600" />
                <Input
                  id="instagram"
                  type="url"
                  className="pl-10"
                  placeholder="https://www.instagram.com/yourprofile"
                  value={form.socials.instagram}
                  onChange={(e) =>
                    handleSocialChange("instagram", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <div className="relative">
                <Youtube className="absolute left-3 top-3 w-4 h-4 text-red-600" />
                <Input
                  id="youtube"
                  type="url"
                  className="pl-10"
                  placeholder="https://www.youtube.com/@yourchannel"
                  value={form.socials.youtube}
                  onChange={(e) =>
                    handleSocialChange("youtube", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving || !token}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
    // <div>
    //   <h2 className="text-xl font-bold mb-6">Admin Profile</h2>

    //   <form onSubmit={submitHandler} className="space-y-4">
    //     <input
    //       className="border p-2 w-full"
    //       placeholder="Full Name"
    //       value={form.name}
    //       onChange={(e) => setForm({ ...form, name: e.target.value })}
    //     />

    //     <input
    //       className="border p-2 w-full"
    //       placeholder="Designation"
    //       value={form.designation}
    //       onChange={(e) => setForm({ ...form, designation: e.target.value })}
    //     />

    //     <textarea
    //       className="border p-2 w-full"
    //       rows="4"
    //       placeholder="Short Bio"
    //       value={form.bio}
    //       onChange={(e) => setForm({ ...form, bio: e.target.value })}
    //     />

    //     <textarea
    //       className="border p-2 w-full"
    //       rows="6"
    //       placeholder="About Description"
    //       value={form.about}
    //       onChange={(e) => setForm({ ...form, about: e.target.value })}
    //     />

    //     <button type="submit" className="bg-black text-white px-4 py-2">
    //       Save Profile
    //     </button>
    //   </form>
    // </div>
  );
};
export default Profile;
