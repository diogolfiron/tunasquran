import { useState } from "react";

export default function AdminGallery() {
  const [form, setForm] = useState({
    url: "",
    category: "daily",
    title: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      setMessage("✅ Galeri berhasil ditambahkan");
      setForm({ url: "", category: "daily", title: "" });
    } catch (err) {
      setMessage("❌ Gagal menyimpan galeri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Input Galeri</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL GAMBAR */}
        <div>
          <label className="block font-semibold mb-1">URL Gambar</label>
          <input
            type="text"
            name="url"
            value={form.url}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* JUDUL */}
        <div>
          <label className="block font-semibold mb-1">Judul</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* KATEGORI */}
        <div>
          <label className="block font-semibold mb-1">Kategori</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="daily">Daily Act</option>
            <option value="karya">Karyaku</option>
          </select>
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="bg-[#80916f] text-white px-6 py-2 rounded-lg hover:bg-[#6f7f60]"
        >
          {loading ? "Menyimpan..." : "Simpan Galeri"}
        </button>

        {message && <p className="mt-2 font-semibold">{message}</p>}
      </form>
    </div>
  );
}
