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
  // Đảm bảo các giá trị nhỏ vẫn hiển thị bằng cách thêm minimum value
  const availableBooks = Math.max(
    (stats?.totalBooks ?? 0) -
      (stats?.lowStockBooks ?? 0) -
      (stats?.outOfStockBooks ?? 0),
    0
  );
  const lowStockBooks = stats?.lowStockBooks ?? 0;
  const outOfStockBooks = stats?.outOfStockBooks ?? 0;

  const stockStatusData = [
    {
      name: "Còn hàng",
      value: availableBooks,
      displayValue: availableBooks,
      color: "#3B82F6",
    },
    {
      name: "Sắp hết",
      value: lowStockBooks > 0 ? Math.max(lowStockBooks, 1) : 0,
      displayValue: lowStockBooks,
      color: "#F59E0B",
    },
    {
      name: "Hết hàng",
      value: outOfStockBooks > 0 ? Math.max(outOfStockBooks, 1) : 0,
      displayValue: outOfStockBooks,
      color: "#EF4444",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Tỷ lệ tồn kho</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={stockStatusData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {stockStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(_value: any, name: any, props: any) => [
              props.payload.displayValue,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full shrink-0"></div>
          <span className="whitespace-nowrap">Còn hàng: {availableBooks}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full shrink-0"></div>
          <span className="whitespace-nowrap">Sắp hết: {lowStockBooks}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full shrink-0"></div>
          <span className="whitespace-nowrap">Hết hàng: {outOfStockBooks}</span>
        </div>
      </div>
    </div>
  );
}
