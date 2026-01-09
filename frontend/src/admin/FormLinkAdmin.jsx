// src/admin/FormLinkAdmin.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function FormLinkAdmin() {
  const API_BASE = "http://localhost:8000"; // sesuaikan dengan backend
  const [formLink, setFormLink] = useState("");
  const [formLinkId, setFormLinkId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil link form saat load
  const fetchFormLink = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/form-link/`);
      if (res.data && res.data.length > 0) {
        setFormLink(res.data[0].link);
        setFormLinkId(res.data[0].id);
      } else {
        setFormLink("");
        setFormLinkId(null);
      }
    } catch (error) {
      console.error("Fetch form link error:", error);
      alert("Gagal mengambil data form link");
    }
  };

  useEffect(() => {
    fetchFormLink();
  }, []);

  const handleUpdateLink = async () => {
    if (!formLink) return alert("Link tidak boleh kosong!");
    try {
      setLoading(true);
      if (formLinkId) {
        // Update existing
        await axios.put(`${API_BASE}/api/form-link/${formLinkId}`, { link: formLink });
      } else {
        // Create new
        const res = await axios.post(`${API_BASE}/api/form-link/`, { link: formLink });
        setFormLinkId(res.data.id);
      }
      alert("Link Google Form berhasil diperbarui!");
    } catch (error) {
      console.error("Update form link error:", error);
      alert("Gagal memperbarui link");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!formLinkId) return alert("Tidak ada link untuk dihapus");
    if (!confirm("Hapus link pendaftaran? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/form-link/${formLinkId}/`);
      setFormLink("");
      setFormLinkId(null);
      alert("Link Google Form berhasil dihapus");
    } catch (error) {
      console.error("Delete form link error:", error);
      alert("Gagal menghapus link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#80916f]">Form Link Admin</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <label className="block text-sm font-medium mb-1">
            Link Google Form
          </label>
          <input
            type="url"
            placeholder="Masukkan link form"
            value={formLink}
            onChange={(e) => setFormLink(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#80916f]"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleUpdateLink}
              disabled={loading}
              className="bg-[#80916f] hover:bg-[#6f7f60]"
            >
              {loading ? "Menyimpan..." : "Simpan Link"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={loading || !formLinkId}
                  className="ml-3 bg-red-500 hover:bg-red-600 text-white"
                >
                  {loading ? "Memproses..." : "Hapus Link"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus link pendaftaran?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus link pendaftaran yang disimpan. Anda perlu membuat ulang link jika ingin mengembalikannya.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batalkan</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteLink} className="bg-red-600">
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <a
          href={formLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-[#80916f] hover:bg-[#6f7f60] text-white font-bold px-12 py-6 text-lg">
            Daftar Sekarang
          </Button>
        </a>
      </div>
    </div>
  );
}
