import { useNavigate } from "react-router-dom";

export default function Tables() {
  const navigate = useNavigate();
  const tables = [1, 2, 3, 4, 5];

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Tables</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map((t) => (
          <div
            key={t}
            className="bg-white p-6 rounded-xl border text-center cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/menu?table=${t}`)}
          >
            <p className="text-lg font-semibold">Table {t}</p>
            <p className="text-sm text-gray-500 mt-2">Click to order</p>
          </div>
        ))}
      </div>
    </>
  );
}
