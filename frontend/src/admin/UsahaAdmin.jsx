import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UsahaAdmin() {
  const API_BASE = "http://localhost:8000";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [usahaList, setUsahaList] = useState([]);

  /* =====================
     FETCH DATA
  ===================== */
  const fetchUsaha = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/usaha`);
      setUsahaList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsaha();
  }, []);

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) return;

    try {
      setLoading(true);

      await axios.post(`${API_BASE}/api/usaha`, {
        title,
        description,
      });

      setTitle("");
      setDescription("");
      fetchUsaha();
    } catch (err) {
      console.error(err.response || err);
      alert("Gagal menyimpan usaha");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     DELETE
  ===================== */
  const handleDelete = async (id) => {
    if (!confirm("Hapus usaha ini?")) return;

    try {
      await axios.delete(`${API_BASE}/api/usaha/${id}`);
      fetchUsaha();
    } catch (err) {
      alert("Gagal menghapus usaha");
    }
  };

  /* =====================
     EDIT
  ===================== */
  const handleEdit = async (item) => {
    const newTitle = prompt("Judul baru:", item.title);
    if (newTitle === null) return;

    const newDescription = prompt("Deskripsi baru:", item.description);
    if (newDescription === null) return;

    try {
      await axios.put(`${API_BASE}/api/usaha/${item.id}`, {
        title: newTitle,
        description: newDescription,
      });
      fetchUsaha();
    } catch (err) {
      alert("Gagal mengedit usaha");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tunas Usaha</h1>

      {/* FORM */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Usaha</label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nama usaha"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Deskripsi</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi usaha"
                required
              />
            </div>

            <div className="flex justify-end">
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

      {/* TABLE */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Daftar Tunas Usaha
          </h2>

          {usahaList.length === 0 ? (
            <p className="text-gray-500 text-center">
              Belum ada data
            </p>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2 text-left">Deskripsi</th>
                  <th className="p-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {usahaList.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2 font-medium">
                      {item.title}
                    </td>
                    <td className="p-2 text-gray-600">
                      {item.description}
                    </td>
                    <td className="p-2 space-x-3">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
