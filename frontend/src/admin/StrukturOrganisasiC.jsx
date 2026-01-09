import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StrukturOrganisasiC() {
  axios.defaults.withCredentials = false;
  const API_BASE = "http://localhost:8000";

  const [jabatan, setJabatan] = useState("");
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  /* ================= FETCH DATA ================= */
  const fetchStruktur = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/struktur`);
      setList(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStruktur();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jabatan || !nama) return alert("Jabatan dan nama wajib diisi");

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/struktur`, {
        jabatan,
        nama,
        deskripsi,
      });

      alert("Struktur organisasi berhasil ditambahkan");

      setJabatan("");
      setNama("");
      setDeskripsi("");
      fetchStruktur();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan struktur organisasi");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/struktur/${id}`);
      fetchStruktur();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = async (item) => {
    const newJabatan = prompt("Jabatan:", item.jabatan);
    if (newJabatan === null) return;

    const newNama = prompt("Nama:", item.nama);
    if (newNama === null) return;

    const newDeskripsi =
      prompt("Deskripsi:", item.deskripsi || "") ?? item.deskripsi;

    try {
      setLoading(true);
      await axios.put(`${API_BASE}/api/struktur/${item.id}`, {
        jabatan: newJabatan,
        nama: newNama,
        deskripsi: newDeskripsi,
      });
      fetchStruktur();
    } catch (err) {
      console.error(err);
      alert("Gagal mengedit data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">

      {/* ====== HEADER ====== */}
      <section id="struktur" className="scroll-mt-20">
        <h2 className="text-4xl font-bold text-[#80916f] mb-8 text-center">
          Struktur Organisasi
        </h2>

        <Card className="text-[#80916f] shadow-lg">
          <CardContent className="p-8">
            <p className="text-center text-gray-600">
              Struktur organisasi ini dirancang untuk mendukung keberjalanan
              kegiatan pendidikan dan pembinaan santri secara optimal.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ====== FORM INPUT ====== */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Tambah Struktur</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Jabatan</label>
              <input
                type="text"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Contoh: Ketua Yayasan"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nama</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Nama Lengkap"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Deskripsi (opsional)</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows="3"
                placeholder="Tugas atau tanggung jawab"
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

      {/* ====== LIST DATA ====== */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Daftar Struktur Organisasi</h3>

          {list.length === 0 ? (
            <p className="text-gray-500 text-center">
              Belum ada data struktur organisasi
            </p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Jabatan</th>
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2 text-left">Deskripsi</th>
                  <th className="p-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2 font-medium">{item.jabatan}</td>
                    <td className="p-2">{item.nama}</td>
                    <td className="p-2 text-gray-600">
                      {item.deskripsi || "-"}
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
          )}
        </CardContent>
      </Card>

    </div>
  );
}
