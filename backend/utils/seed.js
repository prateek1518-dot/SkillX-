import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import Request from "../models/Request.js";
import Session from "../models/Session.js";
import Certificate from "../models/Certificate.js";
import connectDB from "../config/db.js";

dotenv.config();

export const seedData = async (force = false) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !force) {
      console.log("[SkillX Seed] Database already contains data. Skipping auto-seed.");
      return;
    }

    console.log("[SkillX Seed] Seeding initial SkillX demo data...");

    // Clear existing collections if forcing
    if (force) {
      await User.deleteMany({});
      await Skill.deleteMany({});
      await Request.deleteMany({});
      await Session.deleteMany({});
      await Certificate.deleteMany({});
    }

    // Default password for all seed users
    const defaultPassword = "password123";

    // 1. Create Users
    const usersToCreate = [
      {
        name: "Aditi Rao",
        email: "aditi.rao@student.edu",
        password: defaultPassword,
        rating: 4.7,
        skillsOffered: ["React", "UI Design"],
        skillsWanted: ["Java", "Data Structures"],
      },
      {
        name: "Rohan Mehta",
        email: "rohan.mehta@student.edu",
        password: defaultPassword,
        rating: 4.8,
        skillsOffered: ["Java", "Spring Boot"],
        skillsWanted: ["React"],
      },
      {
        name: "Kavya Nair",
        email: "kavya.nair@student.edu",
        password: defaultPassword,
        rating: 4.9,
        skillsOffered: ["UI Design", "Figma"],
        skillsWanted: ["Python"],
      },
      {
        name: "Sameer Khan",
        email: "sameer.khan@student.edu",
        password: defaultPassword,
        rating: 4.5,
        skillsOffered: ["Python", "Pandas"],
        skillsWanted: ["Public Speaking"],
      },
      {
        name: "Ishita Verma",
        email: "ishita.verma@student.edu",
        password: defaultPassword,
        rating: 4.6,
        skillsOffered: ["Public Speaking"],
        skillsWanted: ["UI Design"],
      },
      {
        name: "Dev Patel",
        email: "dev.patel@student.edu",
        password: defaultPassword,
        rating: 4.4,
        skillsOffered: ["Data Structures", "Algorithms"],
        skillsWanted: ["Java"],
      },
      {
        name: "Neha Joshi",
        email: "neha.joshi@student.edu",
        password: defaultPassword,
        rating: 4.9,
        skillsOffered: ["React", "Next.js"],
        skillsWanted: ["UI Design"],
      },
    ];

    const createdUsers = [];
    for (const u of usersToCreate) {
      const created = await User.create(u);
      createdUsers.push(created);
    }

    const [aditi, rohan, kavya, sameer, ishita, dev, neha] = createdUsers;

    // 2. Create Skill Listings
    const listings = [
      {
        user: rohan.name,
        userId: rohan._id,
        offers: "Java",
        wants: "React",
        rating: 4.8,
        blurb: "2 yrs building backend services, happy to pair on Spring Boot.",
      },
      {
        user: kavya.name,
        userId: kavya._id,
        offers: "UI Design",
        wants: "Python",
        rating: 4.9,
        blurb: "Figma + design systems. Looking to pick up scripting for data work.",
      },
      {
        user: sameer.name,
        userId: sameer._id,
        offers: "Python",
        wants: "Public Speaking",
        rating: 4.5,
        blurb: "Comfortable with pandas/numpy, want to get better at presenting.",
      },
      {
        user: ishita.name,
        userId: ishita._id,
        offers: "Public Speaking",
        wants: "UI Design",
        rating: 4.6,
        blurb: "Debate team captain, can help you structure and deliver a pitch.",
      },
      {
        user: dev.name,
        userId: dev._id,
        offers: "Data Structures",
        wants: "Java",
        rating: 4.4,
        blurb: "TA for DSA last semester. Explaining trees and graphs is my thing.",
      },
      {
        user: neha.name,
        userId: neha._id,
        offers: "React",
        wants: "UI Design",
        rating: 4.9,
        blurb: "Built three hackathon projects in React, want to design them better.",
      },
    ];

    await Skill.insertMany(listings);

    // 3. Create Exchange Requests for Aditi
    const requests = [
      {
        fromUser: rohan._id,
        fromUserName: rohan.name,
        toUser: aditi._id,
        toUserName: aditi.name,
        theirSkill: "React",
        yourSkill: "Java",
        status: "pending",
        sentOn: "2026-08-20",
      },
      {
        fromUser: aditi._id,
        fromUserName: aditi.name,
        toUser: kavya._id,
        toUserName: kavya.name,
        theirSkill: "UI Design",
        yourSkill: "React",
        status: "active",
        sentOn: "2026-08-14",
      },
      {
        fromUser: aditi._id,
        fromUserName: aditi.name,
        toUser: ishita._id,
        toUserName: ishita.name,
        theirSkill: "Public Speaking",
        yourSkill: "React",
        status: "declined",
        sentOn: "2026-08-09",
      },
      {
        fromUser: dev._id,
        fromUserName: dev.name,
        toUser: aditi._id,
        toUserName: aditi.name,
        theirSkill: "UI Design",
        yourSkill: "Data Structures",
        status: "done",
        sentOn: "2026-07-28",
      },
    ];

    await Request.insertMany(requests);

    // 4. Create Sessions for Aditi
    const sampleSessions = [
      {
        userId: aditi._id,
        partnerId: kavya._id,
        withUser: kavya.name,
        skill: "UI Design",
        date: "2026-08-25",
        status: "upcoming",
        note: "Session 2 of 4 — covering component libraries.",
      },
      {
        userId: aditi._id,
        partnerId: kavya._id,
        withUser: kavya.name,
        skill: "UI Design",
        date: "2026-08-18",
        status: "completed",
        note: "Session 1 of 4 — Figma basics and design tokens.",
      },
      {
        userId: aditi._id,
        partnerId: dev._id,
        withUser: dev.name,
        skill: "Data Structures",
        date: "2026-08-02",
        status: "completed",
        note: "Final session — trees, graphs, and a mock interview.",
      },
    ];

    await Session.insertMany(sampleSessions);

    // 5. Create Certificate
    await Certificate.create({
      userId: aditi._id,
      userName: aditi.name,
      partnerId: dev._id,
      withUser: dev.name,
      skill: "Data Structures",
      number: "SKX-2026-000482",
      issuedOn: "2026-08-03",
    });

    console.log("[SkillX Seed] Database successfully seeded with demo data!");
  } catch (error) {
    console.error("[SkillX Seed Error]:", error.message);
  }
};

// If run directly from terminal: `node utils/seed.js`
if (process.argv[1]?.includes("seed.js")) {
  connectDB().then(async () => {
    await seedData(true);
    process.exit(0);
  });
}
