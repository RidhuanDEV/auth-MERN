import { motion as Motion } from "framer-motion";
import NavBar from "../components/NavBar.jsx";
import Card from "../components/Card.jsx";
import React, { useEffect } from "react";
import { useDataStore } from "../store/useDataStore.js";
import { Loader } from "lucide-react";

const offers = [
  {
    title: "Professional UI/UX Design",
    imageSrc: "./uiux.jpeg",
    description: "Create UI/UX Design",
  },
  {
    title: "Web Development",
    imageSrc: "./web.jpeg",
    description: "Building Responsive Websites",
  },
  {
    title: "Mobile App Development",
    imageSrc: "./mobile.jpeg",
    description: "Creating User-Friendly Mobile Apps",
  },
];

const DashboardPage = () => {
  const [offer, setOffer] = React.useState(offers);
  // Ambil state & action via hook (bukan getState)
  const isLoading = useDataStore((store) => store.isLoading);
  const home = useDataStore((store) => store.home);
  const error = useDataStore((store) => store.error);
  const message = useDataStore((store) => store.message);
  const homeData = useDataStore((store) => store.homeData);

  // Fetch home data once on mount (prevents infinite re-fetch when `home` updates)
  useEffect(() => {
    homeData("ridhuandf1@gmail.com"); // load default/profile home
    // run only on mount or when homeData reference changes
  }, [homeData]);

  // Update offers when `home` changes — separate concern from fetching
  useEffect(() => {
    if (home?.offer_url && home?.description && home?.offer_title) {
      setOffer([
        {
          imageSrc: home.offer_url,
          description: home.description,
          title: home.offer_title,
        },
      ]);
    } else {
      setOffer(offers); // fallback ke default
    }
  }, [home]);

  const downloadResume = () => {
    const resumeUrl = home?.download_cv || "./resume.pdf";
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const contactMe = () => {
    const whatsappUrl = "https://wa.me/6282113472156";
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-900">
        <Loader className="animate-spin text-green-500" size={48} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500 text-lg">
          {message || "An error occurred."}
        </p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen">
      <NavBar></NavBar>

      {/* Main Section - Hero/Intro with Dark Background */}
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8">
        {/* Hero Section - Responsive Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen items-center">
            {/* Main Content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6 md:p-8 hover:border hover:border-green-400 transition-all duration-500"
              >
                <h2 className="text-xl md:text-2xl font-bold text-white bg-clip-text mb-2">
                  Hello Buds,
                </h2>
                <h4 className="text-2xl md:text-4xl font-medium mb-2 text-gray-300">
                  I am <span className="text-green-400">Roger</span> !
                </h4>
                <h5 className="text-base md:text-lg font-base mb-2 text-white/70">
                  {home?.hobbies?.join(", ") ||
                    "UI /UX Designer & Frontend Developer"}
                  .
                </h5>
                <div className="text-transparent border-b-2 mb-6 md:mb-8 border-green-400 w-fit pointer-events-none select-none">
                  cuma garis biasa aja
                </div>
                <div className="space-y-4 md:space-y-6">
                  <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-base md:text-lg font-light text-white mb-3 px-2 md:px-4 leading-relaxed">
                      {home?.intro ||
                        "I am a passionate UI/UX designer and frontend developer with a knack for creating visually stunning and user-friendly digital experiences. With a strong foundation in design principles and a keen eye for detail, I specialize in crafting intuitive interfaces that captivate users and drive engagement."}
                    </p>
                  </Motion.div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 md:mt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Motion.button
                      className="py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-sm md:text-base cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={downloadResume}
                    >
                      Download Resume
                    </Motion.button>

                    <Motion.button
                      className="py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-sm md:text-base cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={contactMe}
                    >
                      Contact Me
                    </Motion.button>
                  </div>

                  <div>
                    <p className="text-sm font-light text-white/70">
                      Get in touch with me for collaboration or just a friendly
                      chat!
                    </p>
                  </div>
                </div>
              </Motion.div>
            </div>

            {/* Profile Image */}
            <div className="lg:col-span-1 order-1 lg:order-2 flex justify-center">
              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 overflow-hidden rounded-2xl border-2 border-green-500 shadow-lg hover:scale-105 transition-transform duration-500">
                  <img
                    src={home?.profile_picture_url || "./profilsaya.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Motion.div>
            </div>
          </div>

          {/* Social Links Section */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full flex justify-center"
          >
            <div className="bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-xl gap-10 p-6 md:p-8 hover:border-b-2 border-green-500 transition-transform duration-500 flex">
              <div className="text-center">
                <h3 className="text-white font-light text-lg md:text-xl mb-6">
                  Find me on:
                </h3>
              </div>
              <div className="flex justify-center space-x-6 md:space-x-8">
                <a
                  href={
                    home?.linkedin_url ||
                    "https://www.linkedin.com/in/yourprofile"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src="./icons8-linkedin.svg"
                    alt="LinkedIn"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </a>
                <a
                  href={home?.github_url || "https://github.com/yourprofile"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src="./icons8-github.svg"
                    alt="GitHub"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </a>
                <a
                  href={
                    home?.instagram_url || "https://instagram.com/yourprofile"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src="./icons8-instagram.svg"
                    alt="Instagram"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </a>
                <a
                  href={
                    home?.facebook_url || "https://facebook.com/yourprofile"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src="./icons8-facebook.svg"
                    alt="Facebook"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </a>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* Offer Section - Blue Gradient Background */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-4">
        <div className="max-w-7xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What I <span className="text-yellow-400">Offer</span>
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
              Professional services tailored to bring your vision to life
            </p>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
          </Motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offer.map((item, index) => (
              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 hover:bg-white/20 transition-all duration-300 shadow-2xl border border-white/20 hover:scale-105 hover:shadow-yellow-400/20"
              >
                <div className="text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 overflow-hidden rounded-2xl bg-white/20 p-3">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-white font-bold text-xl md:text-2xl mb-4">
                    {item.title}
                  </h3>
                  <p className="text-blue-100 text-base md:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Section - Green Gradient Background */}
      <section className="py-16 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 px-4">
        <div className="max-w-6xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Have Any <span className="text-yellow-400">Project</span> in
                Minds?
              </h2>
              <p className="text-green-100 text-lg md:text-xl mb-6">
                Let's turn your ideas into reality together
              </p>
              <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Start Something Amazing?
                </h3>
                <p className="text-green-100 text-base md:text-lg leading-relaxed mb-6">
                  I'm always excited to take on new challenges and collaborate
                  on innovative projects. Whether you need a stunning website, a
                  mobile app, or UI/UX design, I'm here to help bring your
                  vision to life with creativity and expertise.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm md:text-base">
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full">
                    Web Development
                  </span>
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full">
                    UI/UX Design
                  </span>
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full">
                    Mobile Apps
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Motion.button
                  className="py-4 px-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-green-900 transition duration-200 text-lg md:text-xl cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={contactMe}
                >
                  Let's Work Together!
                </Motion.button>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>
    </main>
  );
};
export default DashboardPage;
