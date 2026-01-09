import { Routes, Route } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import Dashboard from "../admin/Dashboard";
import PMBAdmin from "../admin/PMBAdmin";
import InspirasiAdmin from "../admin/InspirasiAdmin";
import GalleryCreate from "../admin/GalleryCreate";
import ProtectedAdmin from "../admin/ProtectedAdmin";
import VisiMisiAdmin from "../admin/Visi&Misi";
import KurikulumAdmin from "../admin/Kurikulum";
import UsahaAdmin from "../admin/UsahaAdmin";
import StrukturOrganisasiC from "@/admin/StrukturOrganisasiC";
import PengajarAdmin from "@/admin/PengajarAdmin";  
import FormLinkAdmin from "@/admin/FormLinkAdmin";




export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pmb" element={<PMBAdmin />} />
          <Route path="inspirasi" element={<InspirasiAdmin />} />
          <Route path="gallery" element={<GalleryCreate />} />
          <Route path="visi-misi" element={<VisiMisiAdmin />} />
          <Route path="kurikulum" element={<KurikulumAdmin />} />
          <Route path="usaha" element={<UsahaAdmin />} />
          <Route path="struktur" element={<StrukturOrganisasiC />} />
          <Route path="pengajar" element={<PengajarAdmin />} />
          <Route path="form-link" element={<FormLinkAdmin />} />

        </Route>
      </Route>
    </Routes>
  );
}
