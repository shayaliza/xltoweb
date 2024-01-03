"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

const ExcelUploader = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleAddManually = () => {
    setData([...data, { name, age }]);
    setName("");
    setAge("");
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("Raw Excel Data:", excelData);

        const headers = excelData[0];
        const formattedData = excelData.slice(1).map((row) => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        setData((prevData) => [...prevData, ...formattedData]);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    };

    reader.readAsBinaryString(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Manual Entry</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Name:</label>

        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full border-2 border-gray-300 p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Age:</label>

        <input
          type="text"
          value={age}
          onChange={handleAgeChange}
          className="w-full border-2 border-gray-300 p-2 rounded-md"
        />
      </div>

      <button
        onClick={handleAddManually}
        className="bg-red-400 p-2 border-2 border-yellow-200 text-white rounded-md"
      >
        Add Manually
      </button>

      <h2 className="mt-6 text-xl font-bold">Bulk Upload</h2>
      <h2 className="">
        Make sure 1 col is Name and second is age written in your excel file
      </h2>

      <div {...getRootProps()} className="mt-2">
        <input {...getInputProps()} />

        <p className="bg-red-400 p-2 border-2 border-yellow-200 rounded-md">
          Select Excel file or drag n drop
        </p>
      </div>

      <h2 className="mt-6 text-xl font-bold">All Data </h2>

      <ul className="list-disc pl-6 mt-2">
        {data.map((item, index) => (
          <li key={index} className="mb-2">
            {item.name} - {item.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExcelUploader;
