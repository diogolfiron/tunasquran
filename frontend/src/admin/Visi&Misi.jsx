import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VisiMisiAdmin() {
  const API_BASE = "http://localhost:8000";

  const [data, setData] = useState(null); // single object
  const [visi, setVisi] = useState([""]); // sekarang array
  const [misi, setMisi] = useState([""]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/visi-misi`);
      const d = res.data || null;
      setData(d);

      setVisi(d?.visi
        ? Array.isArray(d.visi)
          ? d.visi
          : [d.visi]
        : [""]);

      setMisi(d?.misi
        ? Array.isArray(d.misi)
          ? d.misi
          : [d.misi]
        : [""]);
    } catch (err) {
      console.error("Fetch visi misi error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FORM ================= */
  const handleArrayChange = (setter, index, value) => {
    setter(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addArrayItem = (setter) => setter(prev => [...prev, ""]);
  const removeArrayItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

  const resetForm = () => {
    setVisi([""]);
    setMisi([""]);
    setData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visi.some(v => v.trim() !== "")) return alert("Minimal satu visi wajib diisi");

    const payload = {
      visi: visi.filter(v => v.trim() !== ""),
      misi: misi.filter(m => m.trim() !== ""),
    };

    try {
      setLoading(true);
      if (data?._id) {
        await axios.put(`${API_BASE}/api/visi-misi/${data._id}`, payload);
      } else {
        await axios.post(`${API_BASE}/api/visi-misi`, payload);
      }
      alert("Visi & Misi berhasil disimpan");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan Visi & Misi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!data?._id) return;
    if (!confirm("Hapus Visi & Misi?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/visi-misi/${data._id}`);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Visi & Misi Admin</h1>

      {/* FORM */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Visi */}
            <div>
              <label className="block text-sm font-medium mb-1">Visi</label>
              {visi.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={item}
                    onChange={(e) => handleArrayChange(setVisi, index, e.target.value)}
                    className="flex-1 border rounded-md px-3 py-2 text-sm"
                  />
                  {visi.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(setVisi, index)}
                      className="text-red-600 text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(setVisi)}
                className="text-sm text-blue-600"
              >
                + Tambah Visi
              </button>
            </div>

            {/* Misi */}
            <div>
              <label className="block text-sm font-medium mb-1">Misi</label>
              {misi.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={item}
                    onChange={(e) => handleArrayChange(setMisi, index, e.target.value)}
                    className="flex-1 border rounded-md px-3 py-2 text-sm"
                  />
                  {misi.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(setMisi, index)}
                      className="text-red-600 text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(setMisi)}
                className="text-sm text-blue-600"
              >
                + Tambah Misi
              </button>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              {data && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-red-600 text-sm"
                >
                  Hapus Visi & Misi
                </button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#80916f] hover:bg-[#6f7f60]"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PREVIEW TABLE */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Preview Visi & Misi</h2>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Visi</th>
                <th className="p-2 text-left">Misi</th>
              </tr>
            </thead>

            <tbody>
              {!data && (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">
                    Belum ada data
                  </td>
                </tr>
              )}

              {data && (
                <tr className="border-b">
                  <td className="p-2">
                    <ul className="list-disc ml-4">
                      {(Array.isArray(data.visi) ? data.visi : [data.visi]).map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">
                    <ul className="list-disc ml-4">
                      {(Array.isArray(data.misi) ? data.misi : [data.misi]).map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
