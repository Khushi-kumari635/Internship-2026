// seed/seedData.js
// This script fills the database with sample Indian data so the
// application looks realistic during a demo/presentation.
//
// Run it with:   npm run seed   (from inside the backend folder)
// WARNING: This clears existing data in these collections first!

const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const User = require("../models/User");
const AlumniProfile = require("../models/AlumniProfile");
const StudentProfile = require("../models/StudentProfile");
const Job = require("../models/Job");
const Event = require("../models/Event");

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing old data...");
    await User.deleteMany();
    await AlumniProfile.deleteMany();
    await StudentProfile.deleteMany();
    await Job.deleteMany();
    await Event.deleteMany();

    // Common password for all sample accounts (for demo/login purposes)
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash("password123", salt);

    console.log("👤 Creating sample Alumni users...");

    const alumniData = [
      {
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        department: "Computer Science",
        graduationYear: 2018,
        currentCompany: "Infosys",
        jobTitle: "Senior Software Engineer",
        industry: "Information Technology",
        location: "Bengaluru, Karnataka",
        phone: "9876543210",
        skills: ["Java", "Spring Boot", "Microservices", "AWS"],
        bio: "Passionate about building scalable backend systems. Love mentoring juniors from my alma mater.",
        careerHistory: [
          { company: "TCS", jobTitle: "Software Trainee", duration: "2018 - 2020" },
          { company: "Infosys", jobTitle: "Senior Software Engineer", duration: "2020 - Present" },
        ],
      },
      {
        name: "Priya Singh",
        email: "priya.singh@example.com",
        department: "Information Technology",
        graduationYear: 2017,
        currentCompany: "Google India",
        jobTitle: "Product Manager",
        industry: "Information Technology",
        location: "Hyderabad, Telangana",
        phone: "9876543211",
        skills: ["Product Strategy", "Agile", "Data Analysis", "UX Research"],
        bio: "Building products that matter. Always happy to guide students interested in product management.",
        careerHistory: [
          { company: "Flipkart", jobTitle: "Business Analyst", duration: "2017 - 2019" },
          { company: "Google India", jobTitle: "Product Manager", duration: "2019 - Present" },
        ],
      },
      {
        name: "Aman Kumar",
        email: "aman.kumar@example.com",
        department: "Computer Science",
        graduationYear: 2019,
        currentCompany: "Microsoft India",
        jobTitle: "Cloud Solutions Architect",
        industry: "Information Technology",
        location: "Noida, Uttar Pradesh",
        phone: "9876543212",
        skills: ["Azure", "Kubernetes", "DevOps", "System Design"],
        bio: "Cloud enthusiast helping enterprises migrate to Azure. Open to internship mentoring.",
        careerHistory: [
          { company: "Wipro", jobTitle: "Cloud Engineer", duration: "2019 - 2021" },
          { company: "Microsoft India", jobTitle: "Cloud Solutions Architect", duration: "2021 - Present" },
        ],
      },
      {
        name: "Neha Gupta",
        email: "neha.gupta@example.com",
        department: "Electronics & Communication",
        graduationYear: 2016,
        currentCompany: "Qualcomm India",
        jobTitle: "Hardware Design Engineer",
        industry: "Semiconductors",
        location: "Chennai, Tamil Nadu",
        phone: "9876543213",
        skills: ["VLSI", "Embedded Systems", "Circuit Design", "Verilog"],
        bio: "Working on next-gen chipsets. Believe in giving back to the department that shaped me.",
        careerHistory: [
          { company: "Texas Instruments", jobTitle: "Design Engineer", duration: "2016 - 2020" },
          { company: "Qualcomm India", jobTitle: "Hardware Design Engineer", duration: "2020 - Present" },
        ],
      },
      {
        name: "Rohan Verma",
        email: "rohan.verma@example.com",
        department: "Computer Science",
        graduationYear: 2020,
        currentCompany: "Zomato",
        jobTitle: "Data Scientist",
        industry: "Information Technology",
        location: "Gurugram, Haryana",
        phone: "9876543214",
        skills: ["Python", "Machine Learning", "SQL", "Deep Learning"],
        bio: "Solving real-world problems with data. Love talking to students about data science careers.",
        careerHistory: [
          { company: "Zomato", jobTitle: "Data Analyst", duration: "2020 - 2022" },
          { company: "Zomato", jobTitle: "Data Scientist", duration: "2022 - Present" },
        ],
      },
      {
        name: "Sneha Patel",
        email: "sneha.patel@example.com",
        department: "Information Technology",
        graduationYear: 2015,
        currentCompany: "Amazon India",
        jobTitle: "Engineering Manager",
        industry: "E-Commerce",
        location: "Mumbai, Maharashtra",
        phone: "9876543215",
        skills: ["Leadership", "System Design", "Node.js", "Team Management"],
        bio: "Leading engineering teams to build customer-first products. Big believer in alumni networks.",
        careerHistory: [
          { company: "Amazon India", jobTitle: "SDE-1", duration: "2015 - 2018" },
          { company: "Amazon India", jobTitle: "Engineering Manager", duration: "2018 - Present" },
        ],
      },
      {
        name: "Arjun Mehta",
        email: "arjun.mehta@example.com",
        department: "Mechanical Engineering",
        graduationYear: 2014,
        currentCompany: "Tata Motors",
        jobTitle: "Senior Design Engineer",
        industry: "Automobile",
        location: "Pune, Maharashtra",
        phone: "9876543216",
        skills: ["AutoCAD", "SolidWorks", "Product Design", "Project Management"],
        bio: "Designing vehicles of the future. Always ready to help mechanical engineering students.",
        careerHistory: [
          { company: "Mahindra & Mahindra", jobTitle: "Design Engineer", duration: "2014 - 2019" },
          { company: "Tata Motors", jobTitle: "Senior Design Engineer", duration: "2019 - Present" },
        ],
      },
      {
        name: "Ananya Kapoor",
        email: "ananya.kapoor@example.com",
        department: "Computer Science",
        graduationYear: 2021,
        currentCompany: "Paytm",
        jobTitle: "Frontend Developer",
        industry: "Fintech",
        location: "Noida, Uttar Pradesh",
        phone: "9876543217",
        skills: ["React", "JavaScript", "CSS", "TypeScript"],
        bio: "Crafting delightful user interfaces at Paytm. Recently graduated so I remember student struggles well!",
        careerHistory: [
          { company: "Paytm", jobTitle: "Frontend Developer Intern", duration: "2021" },
          { company: "Paytm", jobTitle: "Frontend Developer", duration: "2021 - Present" },
        ],
      },
    ];

    const createdAlumniUsers = [];

    for (const data of alumniData) {
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: commonPassword,
        role: "alumni",
      });

      await AlumniProfile.create({
        user: user._id,
        fullName: data.name,
        department: data.department,
        degree: "B.Tech",
        graduationYear: data.graduationYear,
        currentCompany: data.currentCompany,
        jobTitle: data.jobTitle,
        industry: data.industry,
        location: data.location,
        phone: data.phone,
        skills: data.skills,
        bio: data.bio,
        careerHistory: data.careerHistory,
      });

      createdAlumniUsers.push(user);
    }

    console.log("🎓 Creating sample Student users...");

    const studentData = [
      {
        name: "Kabir Anand",
        email: "kabir.anand@example.com",
        department: "Computer Science",
        currentYear: 2,
        rollNumber: "CS2024015",
        skills: ["C++", "Python", "Data Structures"],
        bio: "2nd year CS student passionate about competitive programming and web development.",
        location: "Delhi",
      },
      {
        name: "Ishita Reddy",
        email: "ishita.reddy@example.com",
        department: "Information Technology",
        currentYear: 3,
        rollNumber: "IT2023042",
        skills: ["React", "Node.js", "MongoDB"],
        bio: "3rd year IT student building full-stack projects and looking for a summer internship.",
        location: "Hyderabad, Telangana",
      },
      {
        name: "Yash Malhotra",
        email: "yash.malhotra@example.com",
        department: "Computer Science",
        currentYear: 4,
        rollNumber: "CS2021009",
        skills: ["Java", "Spring Boot", "SQL"],
        bio: "Final year student preparing for placements, interested in backend development roles.",
        location: "Jaipur, Rajasthan",
      },
      {
        name: "Diya Iyer",
        email: "diya.iyer@example.com",
        department: "Electronics & Communication",
        currentYear: 2,
        rollNumber: "EC2024031",
        skills: ["Embedded C", "Arduino", "Circuit Design"],
        bio: "Curious about hardware and IoT projects. Actively looking for mentors in ECE.",
        location: "Chennai, Tamil Nadu",
      },
    ];

    for (const data of studentData) {
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: commonPassword,
        role: "student",
      });

      await StudentProfile.create({
        user: user._id,
        fullName: data.name,
        department: data.department,
        rollNumber: data.rollNumber,
        currentYear: data.currentYear,
        expectedGraduationYear: 2026,
        skills: data.skills,
        bio: data.bio,
        location: data.location,
      });
    }

    console.log("💼 Creating sample Job posts...");

    const jobData = [
      {
        title: "Software Development Engineer",
        company: "Infosys",
        location: "Bengaluru, Karnataka",
        type: "Full-time",
        description:
          "Looking for enthusiastic freshers/graduates to join our engineering team working on enterprise-scale applications. Good problem-solving skills required.",
        skillsRequired: ["Java", "SQL", "Data Structures"],
        salary: "6-8 LPA",
        postedBy: createdAlumniUsers[0]._id, // Rahul Sharma
      },
      {
        title: "Associate Product Manager",
        company: "Google India",
        location: "Hyderabad, Telangana",
        type: "Full-time",
        description:
          "Join our product team to work on user-facing features used by millions across India. Strong analytical and communication skills needed.",
        skillsRequired: ["Product Sense", "Communication", "Data Analysis"],
        salary: "18-22 LPA",
        postedBy: createdAlumniUsers[1]._id, // Priya Singh
      },
      {
        title: "Cloud Engineering Intern",
        company: "Microsoft India",
        location: "Noida, Uttar Pradesh",
        type: "Internship",
        description:
          "6-month internship opportunity to work with our Azure cloud infrastructure team. Great opportunity for pre-final year students.",
        skillsRequired: ["Cloud Basics", "Linux", "Python"],
        salary: "40,000/month",
        postedBy: createdAlumniUsers[2]._id, // Aman Kumar
      },
      {
        title: "Data Science Intern",
        company: "Zomato",
        location: "Gurugram, Haryana",
        type: "Internship",
        description:
          "Work on real datasets to build recommendation models and analytics dashboards used across the company.",
        skillsRequired: ["Python", "Pandas", "SQL", "Statistics"],
        salary: "35,000/month",
        postedBy: createdAlumniUsers[4]._id, // Rohan Verma
      },
      {
        title: "Frontend Developer",
        company: "Paytm",
        location: "Noida, Uttar Pradesh",
        type: "Full-time",
        description:
          "Build responsive and performant web interfaces for our payments platform used by millions of Indians daily.",
        skillsRequired: ["React", "JavaScript", "CSS"],
        salary: "8-10 LPA",
        postedBy: createdAlumniUsers[7]._id, // Ananya Kapoor
      },
      {
        title: "Design Engineering Intern",
        company: "Tata Motors",
        location: "Pune, Maharashtra",
        type: "Internship",
        description:
          "Assist the design team with CAD modelling and prototype testing for upcoming vehicle projects.",
        skillsRequired: ["AutoCAD", "SolidWorks"],
        salary: "20,000/month",
        postedBy: createdAlumniUsers[6]._id, // Arjun Mehta
      },
    ];

    await Job.insertMany(jobData);

    console.log("📅 Creating sample Events...");

    const now = new Date();
    const daysFromNow = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

    const eventData = [
      {
        title: "Annual Alumni Meet 2026",
        description:
          "Join us for a day of networking, nostalgia, and celebration as alumni from all batches reunite on campus.",
        eventType: "Reunion",
        date: daysFromNow(20),
        time: "10:00 AM",
        location: "College Main Auditorium, Campus",
        organizer: "Alumni Association",
        image: "🎉",
      },
      {
        title: "Career in Cloud Computing - Webinar",
        description:
          "An alumni-led webinar on breaking into cloud computing careers, covering AWS, Azure, and GCP fundamentals.",
        eventType: "Webinar",
        date: daysFromNow(7),
        time: "6:00 PM",
        location: "Online (Google Meet)",
        organizer: "Aman Kumar (Microsoft India)",
        image: "💻",
      },
      {
        title: "Placement Preparation Workshop",
        description:
          "Hands-on workshop covering resume building, technical interviews, and HR round tips from industry alumni.",
        eventType: "Workshop",
        date: daysFromNow(12),
        time: "2:00 PM",
        location: "Seminar Hall 2, Campus",
        organizer: "Training & Placement Cell",
        image: "📝",
      },
      {
        title: "Startup Founders Networking Meetup",
        description:
          "An informal meetup for alumni entrepreneurs and students interested in the startup ecosystem.",
        eventType: "Networking",
        date: daysFromNow(30),
        time: "5:00 PM",
        location: "Innovation Hub, Bengaluru",
        organizer: "Entrepreneurship Cell",
        image: "🚀",
      },
      {
        title: "Data Science & AI Talk Series",
        description:
          "Rohan Verma from Zomato shares insights on building a career in data science and machine learning.",
        eventType: "Webinar",
        date: daysFromNow(3),
        time: "7:00 PM",
        location: "Online (Zoom)",
        organizer: "Rohan Verma (Zomato)",
        image: "📊",
      },
    ];

    await Event.insertMany(eventData);

    console.log("✅ Sample data seeded successfully!");
    console.log("----------------------------------------------------");
    console.log("You can log in with any sample account using:");
    console.log("Email:    rahul.sharma@example.com  (or any seeded email)");
    console.log("Password: password123");
    console.log("----------------------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
