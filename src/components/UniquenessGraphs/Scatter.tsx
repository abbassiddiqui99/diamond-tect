import { Scatter as ScatterGraph } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement } from 'chart.js';

import { generateColorForDonutGraph, roundToNearestMultipleOfFive } from 'src/utils/helpers';

ChartJS.register(ArcElement, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ScatterType {
  total: number;
  average: number;
  xLabel?: string;
  yLabel?: string;
}

const Scatter: React.FC<ScatterType> = ({ total, average, xLabel, yLabel }) => {
  return (
    <ScatterGraph
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            max: 120,
            beginAtZero: true,
            title: {
              display: true,
              text: xLabel,
            },
            grid: {
              display: false,
            },
            ticks: {
              stepSize: 25,
            },
          },
          y: {
            max: total * (1 + 0.25),
            beginAtZero: true,
            title: {
              display: true,
              text: yLabel,
            },
            grid: {
              display: false,
            },
            ticks: {
              stepSize: roundToNearestMultipleOfFive(total / 2),
            },
          },
        },
      }}
      data={{
        datasets: [
          {
            pointRadius: 10,
            pointHoverRadius: 12,
            data: [
              {
                x: average,
                y: total,
              },
            ],
            backgroundColor: generateColorForDonutGraph(average),
          },
        ],
      }}
    />
  );
};

export default Scatter;
