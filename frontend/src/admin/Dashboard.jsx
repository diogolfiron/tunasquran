import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";

export default function Dashboard() {
  const API_BASE = "http://localhost:8000";

  const [counts, setCounts] = useState({
    inspirasi: 0,
    pengajar: 0,
    galeri: 0,
    jalur: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          inspirasiRes,
          pengajarRes,
          galeriRes,
          jalurRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}/api/inspirasi`),
          axios.get(`${API_BASE}/api/pengajar`),
          axios.get(`${API_BASE}/api/gallery`),
          axios.get(`${API_BASE}/api/pmb/jalur`),
        ]);

        setCounts({
          inspirasi: inspirasiRes.data.length,
          pengajar: pengajarRes.data.length,
          galeri: galeriRes.data.length,
          jalur: jalurRes.data.length,
        });
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Posting Inspirasi</p>
            <p className="text-3xl font-bold text-[#80916f]">
              {counts.inspirasi}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Pengajar</p>
            <p className="text-3xl font-bold text-[#80916f]">
              {counts.pengajar}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Galeri</p>
            <p className="text-3xl font-bold text-[#80916f]">
              {counts.galeri}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Jalur PMB</p>
            <p className="text-3xl font-bold text-[#80916f]">
              {counts.jalur}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
