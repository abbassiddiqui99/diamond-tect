import { Doughnut as DoughnutGraph } from 'react-chartjs-2';
import { UniquenessType } from 'src/types/graphs';

import { generateColorForDonutGraph } from 'src/utils/helpers';

interface DoughnutType {
  data: UniquenessType[];
}

const Doughnut: React.FC<DoughnutType> = ({ data }) => {
  const counts = data.map(item => item[1].count);
  const totalArea = counts.reduce((a, v) => a + v);
  const inPercent = counts.map(val => Math.max((val / totalArea) * 100, 1));

  return (
    <DoughnutGraph
      options={{
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: item => `${data[item.dataIndex][0]} | ${data[item.dataIndex][1].avgScore}: ${data[item.dataIndex][1].count} `,
            },
          },
          legend: {
            display: false,
          },
        },
      }}
      data={{
        datasets: [
          {
            label: '',
            data: inPercent,
            backgroundColor: data.map(item => generateColorForDonutGraph(item[1].avgScore)),
            borderWidth: 1,
          },
        ],
      }}
    />
  );
};

export default Doughnut;
