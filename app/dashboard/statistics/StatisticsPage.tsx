'use client';

import { useState } from "react";
import HarvestStatistics from "./HarvestStatistics";
import UserStatistics from "./UserStatistics";
import Header from "@/app/components/Header";

const StatisticsPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="flex flex-col space-y-6">
      <Header title="Estadisticas" />

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedOption(selectedOption === "cosechas" ? null : "cosechas")}
          className={`px-4 py-2 rounded-md font-bold ${
            selectedOption === "cosechas" ? "bg-blue-600 text-white" : "bg-blue-400"
          }`}
        >
          Cosechas
        </button>
        <button
          onClick={() => setSelectedOption(selectedOption === "usuarios" ? null : "usuarios")}
          className={`px-4 py-2 rounded-md font-bold ${
            selectedOption === "usuarios" ? "bg-blue-600 text-white" : "bg-blue-400"
          }`}
        >
          Usuarios
        </button>
      </div>

      {/* Renderizado Condicional */}
      {selectedOption === "cosechas" && <HarvestStatistics />}
      {selectedOption === "usuarios" && <UserStatistics />}
    </div>
  );
};

export default StatisticsPage;

