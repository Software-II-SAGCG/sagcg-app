'use client';

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const UserStatistics = () => {
  const [data, setData] = useState<Record<string, Record<string, Record<string, number>>>>({});

  const fetchData = async () => {
    try {
      const response = await fetch("/api/statistics/users");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error al obtener los datos de estadísticas:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-6">

      {Object.keys(data).map((modulo) => (
        <div key={modulo} className="space-y-6">

          <h2 className="text-xl font-bold mb-4">{`Módulo: ${modulo}`}</h2>

          {Object.keys(data[modulo]).map((evento) => {
            const usuarios = data[modulo][evento];
            const labels = Object.keys(usuarios);
            const valores = Object.values(usuarios);

            return (
              <div key={evento} className="space-y-4">

                <h3 className="text-lg font-bold">{`${evento}`}</h3>

                <Bar
                  data={{
                    labels,
                    datasets: [
                      {
                        label: `Usuarios en ${evento}`,
                        data: valores,
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
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
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default UserStatistics;
