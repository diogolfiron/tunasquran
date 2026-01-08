import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function KurikulumAdmin() {
  const API_BASE = "http://localhost:8000";

  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch kurikulum list
  const fetchList = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/kurikulum`);
      setList(res.data);
    } catch (err) {
      console.error("Fetch kurikulum error:", err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Judul wajib diisi");

    const payload = {
      title,
      description,
    };

    try {
      setLoading(true);

      if (editingId) {
        // Update existing
        await axios.put(`${API_BASE}/api/kurikulum/${editingId}`, payload);
      } else {
        // Create new
        await axios.post(`${API_BASE}/api/kurikulum`, payload);
      }

      fetchList();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan Kurikulum");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus kurikulum ini?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/kurikulum/${id}`);
      fetchList();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kurikulum Admin</h1>

      {/* FORM */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#80916f] hover:bg-[#6f7f60]"
              >
                {loading ? "Menyimpan..." : editingId ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* TABLE PREVIEW */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Daftar Kurikulum</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Judul</th>
                <th className="p-2">Deskripsi</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-2 text-center text-gray-500">
                    Tidak ada kurikulum
                  </td>
                </tr>
              )}

              {list.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">
                    <div className="text-sm text-gray-700 max-w-md truncate">
                      {item.description}
                    </div>
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
