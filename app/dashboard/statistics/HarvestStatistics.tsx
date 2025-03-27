'use client';

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

interface HarvestData {
  id: number;
  nombre: string;
  sumaTotalKg: number;
  montoTotalInvertido: number;
}

const HarvestStatistics = () => {
  const [harvests, setHarvests] = useState<HarvestData[]>([]);

  const fetchHarvests = async () => {
    try {
      const harvestResponse = await fetch("/api/cosecha/obtener");
      const harvests = await harvestResponse.json();

      const harvestDataPromises = harvests.map(async (harvest: { id: number; nombre: string }) => {
        const response = await fetch(`/api/compra/total/${harvest.id}`);
        const data = await response.json();
        return { id: harvest.id, nombre: harvest.nombre, ...data };
      });

      const resolvedData = await Promise.all(harvestDataPromises);
      setHarvests(resolvedData);
    } catch (error) {
      console.error("Error al obtener los datos de las cosechas:", error);
    }
  };

  useEffect(() => {
    fetchHarvests();
  }, []);

  const labels = harvests.map((harvest) => harvest.nombre);
  const totalKg = harvests.map((harvest) => harvest.sumaTotalKg);
  const totalMonto = harvests.map((harvest) => harvest.montoTotalInvertido);

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-4">Monto Total Invertido por Cosecha</h2>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Monto Total Invertido ($)",
                data: totalMonto,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
          }}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Suma Total de Kg por Cosecha</h2>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Suma Total de Kg",
                data: totalKg,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default HarvestStatistics;
