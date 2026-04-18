/*
  Nahal Kianpour

  Description:
  Main routing setup for the current frontend pages.
  At this stage, routes for the Browse Models page and
  Model Profile page are included.
*/

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Link,
  useParams
} from 'react-router-dom';
import { models } from './data/models';
import { useState } from 'react';

/*
  Nahal Kianpour

  Description:
  This component implements the Browse Models page.

  It displays model listings using mock data,
  provides frontend search/filter interface elements,
  and allows navigation to the individual model profile view.

  This component represents the client browsing flow
  defined in Assignment 1 wireframes.
*/

function BrowseModelsPage() {

const [searchTerm, setSearchTerm] = useState('');
const [selectedLocation, setSelectedLocation] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');

{/* Nahal Kianpour
   Combined search and location filtering
*/}
const filteredModels = models.filter(function(model) {

  const matchesSearch =
    model.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesLocation =
    selectedLocation === '' ||
    model.location === selectedLocation;

const matchesCategory =
  selectedCategory === '' ||
  model.category === selectedCategory;

return matchesSearch && matchesLocation && matchesCategory;

});

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow-sm">

        {/* Page heading */}
        <h1 className="text-3xl font-bold mb-6">
          Browse Models
        </h1>

        {/* Search and filter interface (UI prototype) */}
        <div className="mb-6 flex gap-4">

        <input
          type="text"
          placeholder="Search models"
          value={searchTerm}
          onChange={function(e) {
            setSearchTerm(e.target.value);
          }}
          className="border rounded px-3 py-2"
        />

          {/* Nahal Kianpour
            Location filter dropdown
          */}

          <select
            value={selectedLocation}
            onChange={function(e) {
              setSelectedLocation(e.target.value);
            }}
            className="border p-2 rounded"
          >
            <option value="">Location</option>
            <option value="Dublin">Dublin</option>
            <option value="Cork">Cork</option>
            <option value="Galway">Galway</option>
          </select>

      {/* Nahal Kianpour Category filter dropdown*/}
    <select
      value={selectedCategory}
      onChange={function(e) {
        setSelectedCategory(e.target.value);
      }}
      className="border p-2 rounded"
    >
      <option value="">Category</option>
      <option value="Fashion">Fashion</option>
      <option value="Editorial">Editorial</option>
      <option value="Commercial">Commercial</option>
    </select>

        </div>


        {/* Render one model card for each mock model record */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {filteredModels.map(function(model) {
            return (
              <div
                key={model.id}
                className="border rounded-lg p-4"
              >

                {/* Placeholder image area */}
                <div className="h-40 bg-gray-200 mb-4"></div>

                {/* Basic model summary information */}
                <h2 className="font-semibold">
                  {model.name}
                </h2>

                <p>
                  {model.category} | {model.location}
                </p>

                {/* Link to model profile route */}
                <Link
                  to={'/models/' + model.id}
                  className="inline-block mt-4 border px-4 py-2 rounded"
                >
                  View Profile
                </Link>

              </div>
            );
          })}

        </div>

      </div>
    </main>
  );
}

function ModelProfilePage() {

  const params = useParams();

  const model = models.find(function(item) {
    return item.id === Number(params.id);
  });

  if (!model) {
    return <h1>Model not found</h1>;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-sm">

        <Link
          to="/models"
          className="inline-block mb-6 border px-4 py-2 rounded"
        >
          Back to Models
        </Link>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Placeholder image area */}
          <div className="h-80 bg-gray-200"></div>

          <div>

            <h1 className="text-3xl font-bold mb-4">
              {model.name}
            </h1>

            <p className="mb-2">
              Category: {model.category}
            </p>

            <p className="mb-2">
              Location: {model.location}
            </p>

            <p className="mb-2">
              Height: {model.heightCm} cm
            </p>

            <p className="mb-6">
              Availability: {model.availability}
            </p>

            <button className="border px-4 py-2 rounded">
              Book / Contact
            </button>

            {/* Model biography section */}
            <p className="mt-6 mb-6">
              {model.bio}
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/models" replace />} />
        <Route path="/models" element={<BrowseModelsPage />} />
        <Route path="/models/:id" element={<ModelProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}