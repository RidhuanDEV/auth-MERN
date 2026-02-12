// seedProjects.js - Script untuk menambahkan data proyek ke database
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Proyek } from "./models/proyek.model.js";
import { User } from "./models/user.model.js";

dotenv.config();

const sampleProjects = [
  {
    photo_url:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform built with MERN stack featuring user authentication, product management, shopping cart, and payment integration.",
    project_url: "https://github.com/example/ecommerce-platform",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, team collaboration features, and progress tracking.",
    project_url: "https://github.com/example/task-manager",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    title: "Weather Dashboard",
    description:
      "A responsive weather dashboard that displays current weather conditions and forecasts using OpenWeatherMap API.",
    project_url: "https://github.com/example/weather-dashboard",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop",
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website showcasing projects, skills, and experience with smooth animations and interactive elements.",
    project_url: "https://github.com/example/portfolio-website",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
    title: "Chat Application",
    description:
      "Real-time chat application with multiple chat rooms, private messaging, and file sharing capabilities using Socket.io.",
    project_url: "https://github.com/example/chat-app",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    title: "Blog Platform",
    description:
      "A full-featured blog platform with user authentication, rich text editor, comments system, and admin dashboard.",
    project_url: "https://github.com/example/blog-platform",
  },
];

async function seedProjects() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find user by email
    const user = await User.findOne({ email: "ridhuandf1@gmail.com" });
    if (!user) {
      console.error("User with email ridhuandf1@gmail.com not found");
      process.exit(1);
    }

    console.log(`Found user: ${user._id}`);

    // Check if projects already exist
    const existingProjects = await Proyek.find({ user: user._id });
    if (existingProjects.length > 0) {
      console.log(
        `Found ${existingProjects.length} existing projects. Skipping seed.`
      );
      process.exit(0);
    }

    // Create projects
    const projectsToInsert = sampleProjects.map((project) => ({
      ...project,
      user: user._id,
    }));

    const insertedProjects = await Proyek.insertMany(projectsToInsert);
    console.log(`Successfully inserted ${insertedProjects.length} projects`);

    // Display inserted projects
    insertedProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
    });
  } catch (error) {
    console.error("Error seeding projects:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seed function
seedProjects();
