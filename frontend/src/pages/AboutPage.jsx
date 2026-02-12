import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { motion as Motion } from "framer-motion";
import { useDataStore } from "../store/useDataStore";
import { Loader } from "lucide-react";

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { about, isLoading, error, message, aboutData } = useDataStore();

  useEffect(() => {
    aboutData("ridhuandf1@gmail.com");
  }, [aboutData]);

  // Default data jika belum ada data dari database
  const defaultTestimonials = [
    {
      image: "frontend.jpeg",
      name: "jojo sus",
      text: "Ridhuan is a highly skilled web developer who consistently delivers top-notch work. His attention to detail and problem-solving abilities make him a valuable asset to any team.",
    },
    {
      image: "backend.jpeg",
      name: "jojo sus",
      text: "Ridhuan is a highly skilled backend developer consistently delivering efficient and scalable solutions.",
    },
    {
      image: "uiux.jpeg",
      name: "jojo sus",
      text: "Ridhuan is a highly skilled UI/UX designer.",
    },
  ];

  const defaultExperience = [
    {
      year: "2020 - 2021",
      title: "Junior Web Developer at Tech Solutions",
      decriptions:
        "Worked on developing and maintaining client websites using HTML, CSS, and JavaScript. Collaborated with the design team to implement responsive designs and improve user experience.",
      location: "PT Tech Solutions",
    },
    {
      year: "2021 - 2022",
      title: "Frontend Developer at Web Innovators",
      decriptions:
        "Developed and optimized user interfaces using React.js, ensuring cross-browser compatibility and responsiveness. Worked closely with backend developers to integrate APIs and enhance application performance.",
      location: "PT Web Innovators",
    },
    {
      year: "2022 - Present",
      title: "Full Stack Developer at Creative Apps",
      decriptions:
        "Responsible for designing and implementing full-stack web applications using MERN stack (MongoDB, Express.js, React.js, Node.js). Led a team of developers to deliver high-quality projects on time.",
      location: "PT Creative Apps",
    },
  ];

  const defaultTechstack = [
    { name: "HTML", icon: "html-icon.png" },
    { name: "JavaScript", icon: "js-icon.png" },
    { name: "TypeScript", icon: "typescript-icon.png" },
    { name: "React", icon: "react-icon.png" },
    { name: "Node.js", icon: "nodejs-icon.png" },
    { name: "MongoDB", icon: "mongodb-icon.png" },
    { name: "Express", icon: "express-icon.png" },
    { name: "Tailwind CSS", icon: "tailwind-icon.png" },
    { name: "Python", icon: "python-icon.png" },
    { name: "Kotlin", icon: "kotlin-icon.png" },
  ];

  // Use data from database if available, otherwise use defaults
  const testimonials =
    about?.people_title?.length > 0
      ? about.people_title.map((name, index) => ({
          image: about.people_url?.[index] || "default-avatar.png",
          name: name,
          text: about.people_opinion?.[index] || "",
        }))
      : defaultTestimonials;

  const experience =
    about?.experience_title?.length > 0
      ? about.experience_title.map((title, index) => ({
          year: about.experience_time?.[index] || "",
          title: title,
          decriptions: about.experience_desc?.[index] || "",
          location: about.experience_location?.[index] || "",
        }))
      : defaultExperience;

  const techstack =
    about?.tools_name?.length > 0
      ? about.tools_name.map((name, index) => ({
          name: name,
          icon: about.tools_icon?.[index] || "default-icon.png",
        }))
      : defaultTechstack;

  const selfDescription =
    about?.self_description?.length > 0
      ? about.self_description.join(" ")
      : "I'm Ridhuan, a passionate web developer with a knack for creating dynamic and user-friendly web applications. With a background in informatics engineering and years of experience in the industry, I specialize in front-end development using React, as well as back-end technologies like Node.js and Express. My journey in web development started during my college years, where I discovered my love for coding and problem-solving. Since then, I've worked on various projects ranging from small business websites to complex web applications. When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and sharing my knowledge with the community.";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">
            {message || "An error occurred."}
          </p>
          <button
            onClick={() => aboutData("ridhuandf1@gmail.com")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  return (
    <>
      <main className="w-full min-h-screen pt-12">
        <NavBar />
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl w-full mx-auto mt-10 p-4 md:p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
        >
          <div className="text-white text-xl md:text-2xl font-bold mb-6 text-center">
            My <span className="text-green-400">History</span>
          </div>
          <div className="text-white mt-4 px-4 md:px-8 leading-relaxed text-sm md:text-base">
            {selfDescription}
          </div>
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl w-full mx-auto mt-10 py-2 px-4 md:px-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
        >
          <div className="text-white text-xl md:text-2xl font-bold text-left p-4">
            What they say <span className="text-green-400">About me</span> ?
          </div>
          <div className="relative w-full">
            <div className="relative h-80 md:h-96 overflow-hidden rounded-lg">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`duration-100 ease-in absolute inset-0 transition-opacity px-4 md:px-10 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex flex-col md:flex-row h-full items-center">
                    <div className="w-full md:w-1/3 flex justify-center items-center flex-col p-4 mb-4 md:mb-0">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-32 h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-lg shadow-md object-cover"
                      />
                      <p className="text-white mt-4 text-center font-medium">
                        {testimonial.name}
                      </p>
                    </div>
                    <div className="w-full md:w-2/3 text-white flex justify-center items-center px-4 md:px-8 leading-relaxed text-center md:text-left">
                      <p className="text-sm md:text-base lg:text-lg italic">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    index === currentSlide ? "bg-white" : "bg-gray-400"
                  }`}
                  aria-current={index === currentSlide}
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                ></button>
              ))}
            </div>

            <button
              type="button"
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none"
              onClick={prevSlide}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none"
              onClick={nextSlide}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        </Motion.div>
        <section className="max-w-7xl h-full w-full mx-auto mt-10 p-4 md:p-8 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl">
          <div className="text-white bg-gray-900 px-2 py-3 rounded-xl text-xl md:text-2xl font-bold mb-6 text-center mt-10">
            My <span className="text-green-500">Experience</span>
          </div>
          <div className="relative">
            {/* Center Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-green-500 h-full hidden md:block"></div>

            <div className="space-y-8 md:space-y-12">
              {experience.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <Motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative flex items-center ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } flex-col md:gap-8`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-900 hidden md:block"></div>

                    {/* Content Card */}
                    <div
                      className={`w-full md:w-5/12 bg-gray-900 p-4 md:p-6 rounded-lg text-white/80 border-b-2 border-green-500 hover:scale-105 transition-transform duration-300 ${
                        isEven ? "md:mr-auto" : "md:ml-auto"
                      }`}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-sm md:text-base text-white/60 mb-2">
                        {exp.year}
                      </p>
                      <p className="text-sm md:text-base font-light leading-relaxed mb-3">
                        {exp.decriptions}
                      </p>
                      <p className="text-sm md:text-base text-green-400 font-medium">
                        {exp.location}
                      </p>
                    </div>

                    {/* Spacer for mobile */}
                    <div className="w-full md:w-2/12 hidden md:block"></div>
                  </Motion.div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="max-w-7xl h-full w-full mx-auto mt-10 p-4 md:p-8 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl flex flex-col items-center">
          <div className="text-white bg-gray-900 px-2 py-3 rounded-xl text-xl md:text-2xl font-bold mb-6 text-center mt-10 w-full">
            My <span className="text-green-500">TechStack</span>
          </div>
          <div className="text-white bg-gray-900 p-4 md:p-6 rounded-xl w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-6">
              {techstack.map((tech, index) => (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center p-3 md:p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 hover:scale-105"
                >
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="w-8 h-8 md:w-12 md:h-12 mb-2"
                  />
                  <p className="text-xs md:text-sm font-medium text-center">
                    {tech.name}
                  </p>
                </Motion.div>
              ))}
            </div>
          </div>
          <div className="text-white w-full max-w-md md:w-1/2 bg-gray-900 py-3 rounded-xl text-sm md:text-lg mb-6 text-center mt-4">
            <div className="flex flex-col sm:flex-row justify-around items-center gap-2 sm:gap-0">
              <p className="font-light text-sm md:text-base">
                Check more informations ?
              </p>
              <a
                href="/projects"
                className="font-base text-sm md:text-base border-b-2 border-green-500 rounded-md px-3 py-2 hover:text-green-500 transition-colors duration-300"
              >
                View my projects !
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
