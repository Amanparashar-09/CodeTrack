
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DifficultyBarChart({ stats = {} }) {
  const safeStats = stats ?? {}
  const labels = ['Easy', 'Medium', 'Hard']
  const values = [safeStats.easy || 0, safeStats.medium || 0, safeStats.hard || 0]

  const data = {
    labels,
    datasets: [
      {
        label: 'Problems Solved',
        data: values,
        backgroundColor: [
          'rgba(34, 197, 94,  0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(239, 68,  68, 0.75)',
        ],
        borderColor: [
          'rgba(34, 197, 94,  1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68,  68, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor:  '#9ca3af',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: ctx => ` ${ctx.parsed.y} problems`,
        },
      },
    },
    scales: {
      x: {
        grid:  { display: false },
        ticks: { color: '#9ca3af', font: { size: 13, weight: '500' } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid:  { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6b7280', stepSize: 1 },
        border: { display: false },
      },
    },
  }

  return (
    <div className="card h-72">
      <h3 className="text-gray-300 font-semibold mb-4">Problems by Difficulty</h3>
      <div className="h-52">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
