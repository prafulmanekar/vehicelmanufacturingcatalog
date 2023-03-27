import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VehicleManufacturers.css"

const API_BASE_URL = "https://vpic.nhtsa.dot.gov/api/";

const VehicleManufacturers= () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("");

  useEffect(() => {
    const fetchManufacturers = async () => {
      const response = await axios.get(
        `${API_BASE_URL}vehicles/getallmanufacturers?format=json`
      );
      setManufacturers(response.data.Results);
    };
    fetchManufacturers();
  }, []);

  const handleRowClick = async (manufacturerId) => {
    const response = await axios.get(
      `${API_BASE_URL}vehicles/getmanufacturerdetails/${manufacturerId}?format=json`
    );
    setSelectedManufacturer(response.data.Results);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleVehicleTypeFilterChange = (event) => {
    setVehicleTypeFilter(event.target.value);
  };

  const filteredManufacturers = manufacturers.filter(
    (manufacturer) =>
      manufacturer.Mfr_Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      manufacturer.VehicleTypes.length > 0 &&
      (!vehicleTypeFilter || manufacturer.VehicleTypes.some((type) => type.Name === vehicleTypeFilter))
  );

  const vehicleTypes = [
    ...new Set(manufacturers.flatMap((manufacturer) => manufacturer.VehicleTypes.map((type) => type.Name))),
  ];

  return (
    <div className="manufacturer-catalog">
      <h1>Vehicle Manufacturer Catalog</h1>
      <div className="filters">
        
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        
        <select value={vehicleTypeFilter} onChange={handleVehicleTypeFilterChange}>
        
          <option value="" >All Vehicle Types</option>
          {vehicleTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredManufacturers.map((manufacturer) => (
            <tr key={manufacturer.Mfr_ID} onClick={() => handleRowClick(manufacturer.Mfr_ID)}>
              <td>{manufacturer.Mfr_Name}</td>
              <td>{manufacturer.Country}</td>
              <td>{manufacturer.VehicleTypes.map((type) => type.Name).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedManufacturer && (
        <div className="popup">
          <h2>{selectedManufacturer.Mfr_Name}</h2>
          <p>
            Registered Name: {selectedManufacturer.Mfr_RegisteredName}<br />
            Current Head: {selectedManufacturer.Current_Head} ({selectedManufacturer.Current_Head_Exec_Title})<br />
            Address: {selectedManufacturer.Address} {selectedManufacturer.City}, {selectedManufacturer.State} {selectedManufacturer.Zip}
          </p>
          <button onClick={() => setSelectedManufacturer(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default VehicleManufacturers;