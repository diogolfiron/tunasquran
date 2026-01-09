import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function GalleryC() {
  // Do not send cookies by default (avoids CORS issues)
  axios.defaults.withCredentials = false;
  const API_BASE = "http://localhost:8000";
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("daily");
  const [galleryList, setGalleryList] = useState([]);
  const fileInputRef = useRef();

  // Fetch gallery list
  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/gallery`);
      setGalleryList(res.data);
    } catch (error) {
      console.error("Fetch gallery error:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image || !category) return;

    try {
      setLoading(true);

      // 1) Upload file to backend
      const uploadData = new FormData();
      uploadData.append("file", image);
      const upRes = await axios.post(`${API_BASE}/api/gallery/upload`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = upRes.data.url; // e.g. /images/filename.jpg

      // 2) Create gallery record
      await axios.post(`${API_BASE}/api/gallery`, {
        url: imageUrl,
        title,
        category,
      });

      alert("Gallery berhasil ditambahkan");

      // Reset form
      setTitle("");
      setImage(null);
      setPreview(null);
      setCategory("daily");
      fileInputRef.current.value = null;

      // Refresh list
      fetchGallery();
    } catch (error) {
      console.error("Upload error:", error.response || error);
      alert(error.response?.data?.detail || "Upload gagal, periksa console");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus item gallery ini?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/gallery/${id}`);
      fetchGallery();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus item");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (item) => {
    const newTitle = prompt("Judul baru:", item.title);
    if (newTitle === null) return; // cancelled
    const newCategory = prompt("Kategori (daily/karya):", item.category) || item.category;
    try {
      setLoading(true);
      await axios.put(`${API_BASE}/api/gallery/${item.id}`, {
        title: newTitle,
        category: newCategory,
      });
      fetchGallery();
    } catch (err) {
      console.error("Edit error:", err);
      alert("Gagal memperbarui item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gallery Admin</h1>
      </div>

      {/* Form Upload */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                type="text"
                placeholder="Masukkan judul"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#80916f]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gambar</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm"
                required
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 h-32 object-cover rounded-md"
                />
              )}
              {image && (
                <p className="text-xs text-gray-500 mt-1">
                  {image.name} ({(image.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#80916f]"
              >
                <option value="daily">daily</option>
                <option value="karya">karya</option>
              </select>
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

      {/* List Gallery */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Daftar Gallery</h2>

          {galleryList.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada gallery</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Kategori</th>
                  <th className="p-2">Gambar</th>
                  <th className="p-2">Judul</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {galleryList
                  .slice()
                  .sort((a, b) => {
                    const order = { daily: 0, karya: 1 };
                    const oa = order[a.category] ?? 99;
                    const ob = order[b.category] ?? 99;
                    if (oa !== ob) return oa - ob;
                    return (a.title || "").localeCompare(b.title || "");
                  })
                  .map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 capitalize">{item.category}</td>
                      <td className="p-2">
                        {item.url ? (
                          <img
                            src={item.url.startsWith("http") ? item.url : `${API_BASE}${item.url}`}
                            alt={item.title}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400">Tidak ada gambar</span>
                        )}
                      </td>
                      <td className="p-2">{item.title}</td> {/* <-- Judul */}
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
