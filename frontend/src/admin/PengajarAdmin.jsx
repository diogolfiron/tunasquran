import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PengajarAdmin() {
  const API_BASE = "http://localhost:8000";

  const [nama, setNama] = useState("");
  const [mapel, setMapel] = useState("");
  const [pengajarList, setPengajarList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchPengajar = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/pengajar`);
      setPengajarList(res.data);
    } catch (err) {
      console.error("Fetch pengajar error:", err);
    }
  };

  useEffect(() => {
    fetchPengajar();
  }, []);

  // ================= TAMBAH =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !mapel) return;

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/pengajar`, {
        nama,
        mapel,
      });

      alert("Pengajar berhasil ditambahkan");
      setNama("");
      setMapel("");
      fetchPengajar();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Gagal menyimpan pengajar");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = async (item) => {
    const newNama = prompt("Nama Pengajar:", item.nama);
    if (newNama === null) return;

    const newMapel = prompt("Mata Pelajaran:", item.mapel);
    if (newMapel === null) return;

    try {
      setLoading(true);
      await axios.put(`${API_BASE}/api/pengajar/${item.id}`, {
        nama: newNama,
        mapel: newMapel,
      });
      fetchPengajar();
    } catch (err) {
      console.error(err);
      alert("Gagal mengedit data");
    } finally {
      setLoading(false);
    }
  };

  // ================= HAPUS =================
  const handleDelete = async (id) => {
    if (!confirm("Hapus data pengajar ini?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/pengajar/${id}`);
      fetchPengajar();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pengajar Admin</h1>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Pengajar
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mata Pelajaran
              </label>
              <input
                type="text"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Daftar Pengajar</h2>

          {pengajarList.length === 0 ? (
            <p className="text-gray-500 text-center">Belum ada pengajar</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2 text-left">Mapel</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengajarList.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.nama}</td>
                    <td className="p-2">{item.mapel}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
