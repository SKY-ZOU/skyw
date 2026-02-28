export default function MetricCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-gold-400 md:text-4xl">{value}</div>
      <div className="mt-1 text-sm font-medium text-[#6C757D]">{label}</div>
    </div>
  );
}
