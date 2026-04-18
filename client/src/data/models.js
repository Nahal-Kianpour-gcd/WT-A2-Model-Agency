/*
  Nahal Kianpour

  Description:
  This file stores mock model data used by the Browse Models page.

  The assignment brief permits mock data for frontend interaction,
  so this data is used to simulate records that would normally be
  retrieved from the backend API.

  Each object represents a model profile and includes key attributes
  needed for listing, filtering, and linking to the model profile view.
*/

export const models = [
  {
    id: 1,
    name: "Sophia Murphy",
    category: "Fashion",
    location: "Dublin",
    heightCm: 175,
    bio: "Fashion model based in Dublin with editorial and commercial experience.",
    availability: "Available"
  },

  {
    id: 2,
    name: "Emma Thompson",
    category: "Editorial",
    location: "Cork",
    heightCm: 178,
    bio: "Editorial model with experience in campaigns and studio work.",
    availability: "Available"
  },

  {
    id: 3,
    name: "Olivia Chen",
    category: "Commercial",
    location: "Galway",
    heightCm: 172,
    bio: "Commercial model experienced in advertising and promotional work.",
    availability: "Booked"
  }
];