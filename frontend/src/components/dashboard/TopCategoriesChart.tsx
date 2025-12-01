import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopCategoriesChartProps {
  data: any[];
}

export default function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
      <h3 className="text-lg font-semibold mb-4">Top 10 thể loại bán chạy</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={
            data.length > 0
              ? data
              : [{ category: "Đang cập nhật...", sales: 0 }]
          }
          layout="vertical"
          margin={{ top: 5, right: 20, bottom: 5, left: 150 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            dataKey="category"
            type="category"
            width={140}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey="sales" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
