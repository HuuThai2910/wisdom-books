import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DashboardStats } from "../../types";

interface StockStatusChartProps {
  stats: DashboardStats;
}

export default function StockStatusChart({ stats }: StockStatusChartProps) {
  const stockStatusData = [
    {
      name: "Còn hàng",
      value:
        (stats?.totalBooks ?? 0) -
        (stats?.lowStockBooks ?? 0) -
        (stats?.outOfStockBooks ?? 0),
      color: "#3B82F6",
    },
    { name: "Sắp hết", value: stats?.lowStockBooks ?? 0, color: "#F59E0B" },
    { name: "Hết hàng", value: stats?.outOfStockBooks ?? 0, color: "#EF4444" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Tỷ lệ tồn kho</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={stockStatusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {stockStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>
            Còn hàng:{" "}
            {(stats?.totalBooks ?? 0) -
              (stats?.lowStockBooks ?? 0) -
              (stats?.outOfStockBooks ?? 0)}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
          <span>Sắp hết: {stats?.lowStockBooks ?? 0}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span>Hết hàng: {stats?.outOfStockBooks ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
