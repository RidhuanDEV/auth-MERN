import { motion as Motion } from "framer-motion";
import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import ProjectCard from "../components/ProjectCard";
import { useDataStore } from "../store/useDataStore";

const ProjectPage = () => {
  const { projects, isLoading, error, message, projectsData } = useDataStore();

  useEffect(() => {
    projectsData("ridhuandf1@gmail.com"); // fetch projects berdasarkan email
  }, [projectsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
            onClick={() => projectsData("ridhuandf1@gmail.com")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="w-full min-h-screen pt-12">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              My <span className="text-green-400">Projects</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Here are some of the projects I've worked on. Each project
              represents a unique challenge and learning experience.
            </p>
          </Motion.div>

          {projects.length === 0 ? (
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Projects Yet
                </h3>
                <p className="text-gray-400">
                  Projects will be displayed here once added.
                </p>
              </div>
            </Motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </Motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ProjectPage;
