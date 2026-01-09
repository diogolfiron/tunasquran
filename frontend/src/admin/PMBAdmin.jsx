import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function PMBAdmin() {
  const API_BASE = "http://localhost:8000";

  const [jalurList, setJalurList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== FORM JALUR =====
  const [jalurName, setJalurName] = useState("");
  const [jalurBiaya, setJalurBiaya] = useState("");
  const [jalurDesc, setJalurDesc] = useState("");

  // ===== FORM KELAS =====
  const [kelasName, setKelasName] = useState("");
  const [kelasDesc, setKelasDesc] = useState("");

  // ================= FETCH =================
  const fetchPMB = async () => {
    try {
      const jalur = await axios.get(`${API_BASE}/api/pmb/jalur`);
      const kelas = await axios.get(`${API_BASE}/api/pmb/kelas`);
      setJalurList(jalur.data);
      setKelasList(kelas.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPMB();
  }, []);

  // ================= ADD =================
  const handleAddJalur = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/pmb/jalur`, {
        name: jalurName,
        biaya: jalurBiaya,
        description: jalurDesc,
      });
      setJalurName("");
      setJalurBiaya("");
      setJalurDesc("");
      fetchPMB();
    } finally {
      setLoading(false);
    }
  };

  const handleAddKelas = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/pmb/kelas`, {
        name: kelasName,
        description: kelasDesc,
      });
      setKelasName("");
      setKelasDesc("");
      fetchPMB();
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEditJalur = async (item) => {
    const name = prompt("Nama Jalur", item.name);
    if (name === null) return;
    const biaya = prompt("Biaya", item.biaya);
    const description = prompt("Deskripsi", item.description);

    await axios.put(`${API_BASE}/api/pmb/jalur/${item.id}`, {
      name,
      biaya,
      description,
    });
    fetchPMB();
  };

  const handleEditKelas = async (item) => {
    const name = prompt("Nama Kelas", item.name);
    if (name === null) return;
    const description = prompt("Deskripsi", item.description);

    await axios.put(`${API_BASE}/api/pmb/kelas/${item.id}`, {
      name,
      description,
    });
    fetchPMB();
  };

  // ================= DELETE =================
  const handleDeleteJalur = async (id) => {
    if (!confirm("Hapus jalur ini?")) return;
    await axios.delete(`${API_BASE}/api/pmb/jalur/${id}`);
    fetchPMB();
  };

  const handleDeleteKelas = async (id) => {
    if (!confirm("Hapus kelas ini?")) return;
    await axios.delete(`${API_BASE}/api/pmb/kelas/${id}`);
    fetchPMB();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">PMB Admin</h1>

      {/* ================= FORM JALUR ================= */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Tambah Jalur Pendaftaran</h2>
          <form onSubmit={handleAddJalur} className="space-y-3">
            <input
              className="w-full border rounded p-2"
              placeholder="Nama Jalur"
              value={jalurName}
              onChange={(e) => setJalurName(e.target.value)}
              required
            />
            <input
              className="w-full border rounded p-2"
              placeholder="Biaya"
              value={jalurBiaya}
              onChange={(e) => setJalurBiaya(e.target.value)}
              required
            />
            <textarea
              className="w-full border rounded p-2"
              placeholder="Deskripsi"
              value={jalurDesc}
              onChange={(e) => setJalurDesc(e.target.value)}
            />
            <Button disabled={loading}>
              {loading ? "Menyimpan..." : "Tambah Jalur"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ================= TABLE JALUR ================= */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Daftar Jalur</h2>

          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left w-1/4">Nama</th>
                <th className="p-3 text-left w-1/6">Biaya</th>
                <th className="p-3 text-left w-1/3">Deskripsi</th>
                <th className="p-3 text-left w-1/6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jalurList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Tidak ada jalur
                  </td>
                </tr>
              ) : (
                jalurList.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.biaya}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => handleEditJalur(item)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJalur(item.id)}
                        className="text-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ================= FORM KELAS ================= */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Tambah Program Kelas</h2>
          <form onSubmit={handleAddKelas} className="space-y-3">
            <input
              className="w-full border rounded p-2"
              placeholder="Nama Kelas"
              value={kelasName}
              onChange={(e) => setKelasName(e.target.value)}
              required
            />
            <textarea
              className="w-full border rounded p-2"
              placeholder="Deskripsi"
              value={kelasDesc}
              onChange={(e) => setKelasDesc(e.target.value)}
            />
            <Button className="bg-yellow-600 hover:bg-yellow-500" disabled={loading}>
              {loading ? "Menyimpan..." : "Tambah Kelas"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ================= TABLE KELAS ================= */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Daftar Kelas</h2>

          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left w-1/3">Nama Kelas</th>
                <th className="p-3 text-left w-1/2">Deskripsi</th>
                <th className="p-3 text-left w-1/6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kelasList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">
                    Tidak ada kelas
                  </td>
                </tr>
              ) : (
                kelasList.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => handleEditKelas(item)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteKelas(item.id)}
                        className="text-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
