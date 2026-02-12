import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import NavBar from "../components/NavBar";
import FileInput from "../components/FileInput";
import OffersManager from "../components/OffersManager";
import { useDataStore } from "../store/useDataStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const {
    home,
    about,
    projects,
    isLoading,
    error,
    message,
    homeData,
    aboutData,
    projectsData,
    updateHome,
    updateAbout,
    createProject,
  } = useDataStore();

  // Form states
  const [homeForm, setHomeForm] = useState({
    hobbies: [],
    intro: "",
    profile_picture_url: "",
    download_cv: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    github_url: "",
    offer_title: "",
    offers: [],
  });

  // File objects for upload
  const [homeFiles, setHomeFiles] = useState({
    profile_picture: null,
    download_cv: null,
  });

  const [aboutFiles, setAboutFiles] = useState({
    people_images: [], // Array untuk testimonial images
    tools_icons: [], // Array untuk tool icons
  });

  const [projectFile, setProjectFile] = useState(null);

  const [offers, setOffers] = useState([]);

  const [aboutForm, setAboutForm] = useState({
    self_description: [],
    people_title: [],
    people_opinion: [],
    people_url: [],
    experience_title: [],
    experience_location: [],
    experience_desc: [],
    experience_time: [],
    tools_name: [],
    tools_icon: [],
  });

  const [projectForm, setProjectForm] = useState({
    photo_url: "",
    title: "",
    description: "",
    project_url: "",
  });

  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    if (user?.email) {
      homeData(user.email);
      aboutData(user.email);
      projectsData(user.email);
    }
  }, [user, homeData, aboutData, projectsData]);

  useEffect(() => {
    if (home) {
      setHomeForm({
        hobbies: home.hobbies || [],
        intro: home.intro || "",
        profile_picture_url: home.profile_picture_url || "",
        download_cv: home.download_cv || "",
        facebook_url: home.facebook_url || "",
        instagram_url: home.instagram_url || "",
        linkedin_url: home.linkedin_url || "",
        github_url: home.github_url || "",
        offer_title: home.offer_title || "",
        offers: home.offers || [],
      });
      setOffers(home.offers || []);
    }
  }, [home]);

  useEffect(() => {
    if (about) {
      setAboutForm({
        self_description: about.self_description || [],
        people_title: about.people_title || [],
        people_opinion: about.people_opinion || [],
        people_url: about.people_url || [],
        experience_title: about.experience_title || [],
        experience_location: about.experience_location || [],
        experience_desc: about.experience_desc || [],
        experience_time: about.experience_time || [],
        tools_name: about.tools_name || [],
        tools_icon: about.tools_icon || [],
      });
    }
  }, [about]);

  const handleHomeSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Add text data
      formData.append("hobbies", JSON.stringify(homeForm.hobbies));
      formData.append("intro", homeForm.intro);
      formData.append("facebook_url", homeForm.facebook_url);
      formData.append("instagram_url", homeForm.instagram_url);
      formData.append("linkedin_url", homeForm.linkedin_url);
      formData.append("github_url", homeForm.github_url);
      formData.append("offer_title", homeForm.offer_title);
      formData.append("offers", JSON.stringify(offers));

      // Add files with folder info
      if (homeFiles.profile_picture) {
        formData.append("profile_picture", homeFiles.profile_picture);
        formData.append("profile_picture_folder", "profile");
      }
      if (homeFiles.download_cv) {
        formData.append("download_cv", homeFiles.download_cv);
        formData.append("download_cv_folder", "cv");
      }

      console.log("Files to upload:", {
        profile_picture: homeFiles.profile_picture?.name,
        download_cv: homeFiles.download_cv?.name,
      });
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await updateHome(formData);
      toast.success("Home data saved successfully!");

      // Fetch updated data to get new URLs
      await homeData(user.email);

      // Reset file states after successful save
      setHomeFiles({
        profile_picture: null,
        download_cv: null,
      });
    } catch (error) {
      console.error("Error in handleHomeSubmit:", error);
      toast.error("Error: " + (error.message || "Failed to save"));
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Add text data
      formData.append(
        "self_description",
        JSON.stringify(aboutForm.self_description)
      );
      formData.append("people_title", JSON.stringify(aboutForm.people_title));
      formData.append(
        "people_opinion",
        JSON.stringify(aboutForm.people_opinion)
      );
      formData.append(
        "experience_title",
        JSON.stringify(aboutForm.experience_title)
      );
      formData.append(
        "experience_location",
        JSON.stringify(aboutForm.experience_location)
      );
      formData.append(
        "experience_desc",
        JSON.stringify(aboutForm.experience_desc)
      );
      formData.append(
        "experience_time",
        JSON.stringify(aboutForm.experience_time)
      );
      formData.append("tools_name", JSON.stringify(aboutForm.tools_name));

      // Add testimonial images
      aboutFiles.people_images.forEach((file, index) => {
        if (file) {
          formData.append(`people_image_${index}`, file);
          formData.append(`people_image_${index}_folder`, "testimonials");
        }
      });

      // Add tool icons
      aboutFiles.tools_icons.forEach((file, index) => {
        if (file) {
          formData.append(`tool_icon_${index}`, file);
          formData.append(`tool_icon_${index}_folder`, "tools");
        }
      });

      console.log("About files to upload:", {
        people_images: aboutFiles.people_images.map((f) => f?.name),
        tools_icons: aboutFiles.tools_icons.map((f) => f?.name),
      });

      await updateAbout(formData);
      toast.success("About data saved successfully!");

      // Fetch updated data to get new URLs
      await aboutData(user.email);

      // Reset file states after successful save
      setAboutFiles({
        people_images: [],
        tools_icons: [],
      });
    } catch (error) {
      console.error("Error in handleAboutSubmit:", error);
      toast.error("Error: " + (error.message || "Failed to save"));
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Add text data
      formData.append("title", projectForm.title);
      formData.append("description", projectForm.description);
      formData.append("project_url", projectForm.project_url);

      // Add file
      if (projectFile) {
        formData.append("photo", projectFile);
        formData.append("photo_folder", "projects");
      }

      console.log("Project file to upload:", projectFile?.name);

      await createProject(formData);
      toast.success("Project created successfully!");

      // Reset form after successful submission
      setProjectForm({
        photo_url: "",
        title: "",
        description: "",
        project_url: "",
      });
      setProjectFile(null);
    } catch (error) {
      console.error("Error in handleProjectSubmit:", error);
      toast.error("Error: " + (error.message || "Failed to create project"));
    }
  };

  const addArrayItem = (formType, field) => {
    if (formType === "home") {
      setHomeForm((prev) => ({
        ...prev,
        [field]: [...prev[field], ""],
      }));
    } else if (formType === "about") {
      setAboutForm((prev) => ({
        ...prev,
        [field]: [...prev[field], ""],
      }));
    }
  };

  const updateArrayItem = (formType, field, index, value) => {
    if (formType === "home") {
      setHomeForm((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === index ? value : item)),
      }));
    } else if (formType === "about") {
      setAboutForm((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === index ? value : item)),
      }));
    }
  };

  const removeArrayItem = (formType, field, index) => {
    if (formType === "home") {
      setHomeForm((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    } else if (formType === "about") {
      setAboutForm((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <>
      <main className="w-full min-h-screen pt-12 bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900">
        <NavBar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 px-4"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Profile <span className="text-green-400">Management</span>
            </h1>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Manage your portfolio data - Home, About, and Projects
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 md:px-6 md:py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 text-sm md:text-base cursor-pointer"
            >
              Logout
            </button>
          </Motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 px-4">
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl p-1 w-full max-w-md md:max-w-lg">
              <div className="grid grid-cols-3 gap-1">
                {["home", "about", "projects"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-all text-xs md:text-sm cursor-pointer ${
                      activeTab === tab
                        ? "bg-green-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 bg-opacity-80 backdrop-blur-lg rounded-xl border border-red-700">
              <p className="text-red-300">{message}</p>
            </div>
          )}
          {message && !error && (
            <div className="mb-6 p-4 bg-green-900 bg-opacity-80 backdrop-blur-lg rounded-xl border border-green-700">
              <p className="text-green-300">{message}</p>
            </div>
          )}

          {/* Home Tab */}
          {activeTab === "home" && (
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl p-8 border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Home Dashboard Data
              </h2>
              <form onSubmit={handleHomeSubmit} className="space-y-6">
                {/* Hobbies Array */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Hobbies
                  </label>
                  {homeForm.hobbies.map((hobby, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={hobby}
                        onChange={(e) =>
                          updateArrayItem(
                            "home",
                            "hobbies",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Enter hobby"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("home", "hobbies", index)
                        }
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("home", "hobbies")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                  >
                    Add Hobby
                  </button>
                </div>

                {/* Other Home Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Intro
                    </label>
                    <textarea
                      value={homeForm.intro}
                      onChange={(e) =>
                        setHomeForm((prev) => ({
                          ...prev,
                          intro: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                      rows="3"
                      placeholder="Your introduction"
                    />
                  </div>
                  <div>
                    <FileInput
                      label="Profile Picture"
                      accept="image/*"
                      existingImage={homeForm.profile_picture_url}
                      onFileSelect={(file) =>
                        setHomeFiles((prev) => ({
                          ...prev,
                          profile_picture: file,
                        }))
                      }
                    />
                    {homeForm.profile_picture_url && (
                      <p className="text-xs text-gray-400 mt-1">
                        Current: {homeForm.profile_picture_url.slice(-30)}
                      </p>
                    )}
                  </div>
                  <div>
                    <FileInput
                      label="CV Download (PDF)"
                      accept=".pdf,.doc,.docx"
                      onFileSelect={(file) =>
                        setHomeFiles((prev) => ({
                          ...prev,
                          download_cv: file,
                        }))
                      }
                    />
                    {homeForm.download_cv && (
                      <p className="text-xs text-gray-400 mt-1">
                        Current: {homeForm.download_cv.slice(-30)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Offer Title
                    </label>
                    <input
                      type="text"
                      value={homeForm.offer_title}
                      onChange={(e) =>
                        setHomeForm((prev) => ({
                          ...prev,
                          offer_title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                      placeholder="What I Offer"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    "facebook_url",
                    "instagram_url",
                    "linkedin_url",
                    "github_url",
                  ].map((field) => (
                    <div key={field}>
                      <label className="block text-white font-medium mb-2 capitalize">
                        {field.replace("_url", "")}
                      </label>
                      <input
                        type="url"
                        value={homeForm[field]}
                        onChange={(e) =>
                          setHomeForm((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder={`https://${field.replace(
                          "_url",
                          ""
                        )}.com/username`}
                      />
                    </div>
                  ))}
                </div>

                {/* Offers Management */}
                <div className="border-t border-gray-700 pt-6">
                  <OffersManager
                    offers={offers}
                    onChange={(updatedOffers) => setOffers(updatedOffers)}
                    maxOffers={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Saving..." : "Save Home Data"}
                </button>
              </form>
            </Motion.div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl p-8 border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                About Page Data
              </h2>
              <form onSubmit={handleAboutSubmit} className="space-y-6">
                {/* Self Description */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Self Description
                  </label>
                  {aboutForm.self_description.map((desc, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        value={desc}
                        onChange={(e) =>
                          updateArrayItem(
                            "about",
                            "self_description",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                        rows="2"
                        placeholder="Describe yourself"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("about", "self_description", index)
                        }
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("about", "self_description")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                  >
                    Add Description
                  </button>
                </div>

                {/* Testimonials */}
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Testimonials
                  </h3>
                  {aboutForm.people_title.map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-lg mb-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={aboutForm.people_title[index] || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "about",
                              "people_title",
                              index,
                              e.target.value
                            )
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                          placeholder="Person name"
                        />
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">
                            Profile Image
                          </label>
                          <FileInput
                            accept="image/*"
                            existingImage={aboutForm.people_url[index]}
                            onFileSelect={(file) => {
                              const updatedImages = [
                                ...aboutFiles.people_images,
                              ];
                              updatedImages[index] = file;
                              setAboutFiles((prev) => ({
                                ...prev,
                                people_images: updatedImages,
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeArrayItem("about", "people_title", index);
                          removeArrayItem("about", "people_opinion", index);
                          removeArrayItem("about", "people_url", index);
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer mb-4"
                      >
                        Remove
                      </button>
                      <textarea
                        value={aboutForm.people_opinion[index] || ""}
                        onChange={(e) =>
                          updateArrayItem(
                            "about",
                            "people_opinion",
                            index,
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        rows="3"
                        placeholder="Testimonial text"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem("about", "people_title");
                      addArrayItem("about", "people_opinion");
                      addArrayItem("about", "people_url");
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                  >
                    Add Testimonial
                  </button>
                </div>

                {/* Experience */}
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Work Experience
                  </h3>
                  {aboutForm.experience_title.map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-lg mb-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={aboutForm.experience_title[index] || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "about",
                              "experience_title",
                              index,
                              e.target.value
                            )
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                          placeholder="Job title"
                        />
                        <input
                          type="text"
                          value={aboutForm.experience_location[index] || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "about",
                              "experience_location",
                              index,
                              e.target.value
                            )
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                          placeholder="Company location"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={aboutForm.experience_time[index] || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "about",
                              "experience_time",
                              index,
                              e.target.value
                            )
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                          placeholder="Duration (e.g., 2020-2022)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            removeArrayItem("about", "experience_title", index);
                            removeArrayItem(
                              "about",
                              "experience_location",
                              index
                            );
                            removeArrayItem("about", "experience_desc", index);
                            removeArrayItem("about", "experience_time", index);
                          }}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        value={aboutForm.experience_desc[index] || ""}
                        onChange={(e) =>
                          updateArrayItem(
                            "about",
                            "experience_desc",
                            index,
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                        rows="3"
                        placeholder="Job description"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem("about", "experience_title");
                      addArrayItem("about", "experience_location");
                      addArrayItem("about", "experience_desc");
                      addArrayItem("about", "experience_time");
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                  >
                    Add Experience
                  </button>
                </div>

                {/* Tools/Skills */}
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Tools & Skills
                  </h3>
                  {aboutForm.tools_name.map((_, index) => (
                    <div
                      key={index}
                      className="gap-4 mb-4 p-3 bg-gray-700 rounded-lg"
                    >
                      <input
                        type="text"
                        value={aboutForm.tools_name[index] || ""}
                        onChange={(e) =>
                          updateArrayItem(
                            "about",
                            "tools_name",
                            index,
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 mb-3"
                        placeholder="Tool/Skill name"
                      />
                      <div className="mb-3">
                        <label className="block text-sm text-gray-300 mb-1">
                          Icon/Image
                        </label>
                        <FileInput
                          accept="image/*"
                          existingImage={aboutForm.tools_icon[index]}
                          onFileSelect={(file) => {
                            const updatedIcons = [...aboutFiles.tools_icons];
                            updatedIcons[index] = file;
                            setAboutFiles((prev) => ({
                              ...prev,
                              tools_icons: updatedIcons,
                            }));
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeArrayItem("about", "tools_name", index);
                          removeArrayItem("about", "tools_icon", index);
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem("about", "tools_name");
                      addArrayItem("about", "tools_icon");
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                  >
                    Add Tool/Skill
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Saving..." : "Save About Data"}
                </button>
              </form>
            </Motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Add New Project Form */}
              <div className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl p-8 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Add New Project
                </h2>
                <form onSubmit={handleProjectSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) =>
                          setProjectForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Project title"
                        required
                      />
                    </div>
                    <div>
                      <FileInput
                        label="Project Image"
                        accept="image/*"
                        onFileSelect={(file) => setProjectFile(file)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Project Description
                    </label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                      rows="4"
                      placeholder="Describe your project"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Project URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.project_url}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          project_url: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                      placeholder="https://github.com/username/project"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? "Adding..." : "Add Project"}
                  </button>
                </form>
              </div>

              {/* Existing Projects */}
              <div className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl p-8 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Your Projects ({projects.length})
                </h2>
                {projects.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No projects added yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                      <div
                        key={project._id || index}
                        className="bg-gray-800 rounded-lg p-4"
                      >
                        <img
                          src={project.photo_url}
                          alt={project.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-white font-semibold mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          View Project →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Motion.div>
          )}
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
