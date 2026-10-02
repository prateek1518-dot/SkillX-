// Placeholder data so the UI has something real to render.
// Replace each of these with calls to the Express API once
// the /api/skills, /api/requests, /api/sessions routes exist.

export const currentUser = {
  id: "u1",
  name: "Aditi Rao",
  email: "aditi.rao@student.edu",
  rating: 4.7,
  skillsOffered: ["React", "UI Design"],
  skillsWanted: ["Java", "Data Structures"],
};

export const skillListings = [
  {
    id: "s1",
    user: "Rohan Mehta",
    offers: "Java",
    wants: "React",
    rating: 4.8,
    blurb: "2 yrs building backend services, happy to pair on Spring Boot.",
  },
  {
    id: "s2",
    user: "Kavya Nair",
    offers: "UI Design",
    wants: "Python",
    rating: 4.9,
    blurb: "Figma + design systems. Looking to pick up scripting for data work.",
  },
  {
    id: "s3",
    user: "Sameer Khan",
    offers: "Python",
    wants: "Public Speaking",
    rating: 4.5,
    blurb: "Comfortable with pandas/numpy, want to get better at presenting.",
  },
  {
    id: "s4",
    user: "Ishita Verma",
    offers: "Public Speaking",
    wants: "UI Design",
    rating: 4.6,
    blurb: "Debate team captain, can help you structure and deliver a pitch.",
  },
  {
    id: "s5",
    user: "Dev Patel",
    offers: "Data Structures",
    wants: "Java",
    rating: 4.4,
    blurb: "TA for DSA last semester. Explaining trees and graphs is my thing.",
  },
  {
    id: "s6",
    user: "Neha Joshi",
    offers: "React",
    wants: "UI Design",
    rating: 4.9,
    blurb: "Built three hackathon projects in React, want to design them better.",
  },
];

export const exchangeRequests = [
  {
    id: "r1",
    direction: "incoming",
    withUser: "Rohan Mehta",
    theirSkill: "Java",
    yourSkill: "React",
    status: "pending",
    sentOn: "2026-08-20",
  },
  {
    id: "r2",
    direction: "outgoing",
    withUser: "Kavya Nair",
    theirSkill: "UI Design",
    yourSkill: "React",
    status: "active",
    sentOn: "2026-08-14",
  },
  {
    id: "r3",
    direction: "outgoing",
    withUser: "Ishita Verma",
    theirSkill: "Public Speaking",
    yourSkill: "React",
    status: "declined",
    sentOn: "2026-08-09",
  },
  {
    id: "r4",
    direction: "incoming",
    withUser: "Dev Patel",
    theirSkill: "Data Structures",
    yourSkill: "UI Design",
    status: "done",
    sentOn: "2026-07-28",
  },
];

export const sessions = [
  {
    id: "sess1",
    withUser: "Kavya Nair",
    skill: "UI Design",
    date: "2026-08-25",
    status: "upcoming",
    note: "Session 2 of 4 — covering component libraries.",
  },
  {
    id: "sess2",
    withUser: "Kavya Nair",
    skill: "UI Design",
    date: "2026-08-18",
    status: "completed",
    note: "Session 1 of 4 — Figma basics and design tokens.",
  },
  {
    id: "sess3",
    withUser: "Dev Patel",
    skill: "Data Structures",
    date: "2026-08-02",
    status: "completed",
    note: "Final session — trees, graphs, and a mock interview.",
  },
];

export const certificates = [
  {
    id: "c1",
    number: "SKX-2026-000482",
    skill: "Data Structures",
    withUser: "Dev Patel",
    issuedOn: "2026-08-03",
  },
];
