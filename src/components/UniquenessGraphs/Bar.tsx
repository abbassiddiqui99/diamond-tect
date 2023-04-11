import { Bar as BarGraph } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import { NftHistogramType } from 'src/types/graphs';
import { BAR_COLOR } from 'src/constant/commonConstants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarType {
  data: NftHistogramType;
  xLabel?: string;
  yLabel?: string;
  xMax?: number;
  yMax?: number;
}

const Bar: React.FC<BarType> = ({ data, xLabel, yLabel, xMax, yMax }) => {
  return (
    <BarGraph
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            max: xMax,
            beginAtZero: true,
            title: {
              display: true,
              text: xLabel,
            },
            grid: {
              display: false,
            },
          },
          y: {
            max: yMax,
            beginAtZero: true,
            title: {
              display: true,
              text: yLabel,
            },
            grid: {
              display: false,
            },
          },
        },
      }}
      data={{
        labels: Object.keys(data),
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: [BAR_COLOR.green, BAR_COLOR.yellow, BAR_COLOR.red, BAR_COLOR.darkRed],
          },
        ],
      }}
    />
  );
};

export default Bar;
