import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopBooksChartProps {
  data: any[];
}

export default function TopBooksChart({ data }: TopBooksChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Top 10 sách bán chạy</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={
            data.length > 0 ? data : [{ name: "Đang cập nhật...", sales: 0 }]
          }
          margin={{ top: 5, right: 20, bottom: 100, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={120}
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="sales" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
