import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Users,
  Heart,
  Sprout,
  GraduationCap,
  MessageSquare,
  Store,
  HandHeart,
  UserPlus,
  Phone,
  HelpCircle,
} from "lucide-react";
import {
  heroImages,
  siteInfo,
  yayasan,
  visiMisi,
  kurikulum,
  pengajar,
  inspirasiPosts,
  usaha,
  ziswafInfo,
  pmbInfo,
  faqData,
} from "../mockData";

const API_BASE = "http://localhost:8000";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [inspirasiList, setInspirasiList] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/gallery`);
        setGallery(res.data || []);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    const fetchInspirasi = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/inspirasi`);
        setInspirasiList(res.data || []);
      } catch (err) {
        console.error("Failed to fetch inspirasi:", err);
      }
    };
    fetchInspirasi();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
      setOpenSubmenu(null);
    }
  };

  const menuItems = [
    { label: "Beranda", id: "beranda" },
    {
      label: "Profile",
      submenu: [
        { label: "Yayasan", id: "yayasan" },
        { label: "Visi Misi", id: "visi-misi" },
        { label: "Struktur Organisasi", id: "struktur" },
      ],
    },
    {
      label: "Akademi",
      submenu: [
        { label: "Kurikulum", id: "kurikulum" },
        { label: "Pengajar", id: "pengajar" },
      ],
    },
    {
      label: "Galeri",
      submenu: [
        { label: "Daily Act", id: "galeri" },
        { label: "Karyaku", id: "galeri" },
      ],
    },
    {
      label: "Inspirasi",
      submenu: [
        { label: "Ruang Pena", id: "inspirasi" },
        { label: "Kisah Inspiratif", id: "inspirasi" },
        { label: "Tadabbur", id: "inspirasi" },
        { label: "One Day Motivation", id: "inspirasi" },
      ],
    },
    {
      label: "Usaha",
      submenu: [
        { label: "Kopma", id: "usaha" },
        { label: "Peternakan", id: "usaha" },
        { label: "Mitra Tani", id: "usaha" },
      ],
    },
    { label: "ZISWAF", id: "ziswaf" },
    { label: "PMB", id: "pmb" },
    { label: "Kontak", id: "kontak" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Sprout className="h-8 w-8 text-[#80916f]" />
              <span className="font-bold text-xl text-[#80916f]">
                Tunas Qur'an
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.submenu ? (
                    <div>
                      <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#80916f] flex items-center transition-colors">
                        {item.label}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {item.submenu.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => scrollToSection(subItem.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#80916f] hover:text-[#80916f] transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#80916f] transition-colors"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
              <Link
                to="/admin/login"
                className="ml-4 bg-[#80916f] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#6f7f60]"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-[#80916f]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() =>
                          setOpenSubmenu(openSubmenu === index ? null : index)
                        }
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#80916f] rounded-lg"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openSubmenu === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSubmenu === index && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() => scrollToSection(subItem.id)}
                              className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-[#80916f] rounded-lg"
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#80916f] rounded-lg"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
              <Link
                to="/admin/login"
                className="ml-4 bg-[#80916f] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#6f7f60]"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="beranda"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroImage ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b text-[#80916f] via-green-800/70 text-[#80916f]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Selamat datang di
            <br />
            <span className="text-yellow-300">
              Sekolah Tinggi Tunasqu Bandung
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 font-semibold text-yellow-200">
            {siteInfo.tagline}
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {siteInfo.motto}
          </p>
          <p className="text-base md:text-lg mb-8 italic">
            Mandiri bukan hanya bisa sendiri, justru ia menjadi kunci kedekatan
            menuju ilahi.
            <br />
            Dan peduli, jembatan antara pengabdi dan Sang Rabbi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("pmb")}
              className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold px-8 py-6 text-lg"
            >
              Daftar Sekarang
            </Button>
            <Button
              onClick={() => scrollToSection("yayasan")}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-6 text-lg"
            >
              Kenali Kami
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white" />
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* About Section */}
        <section id="yayasan" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#80916f] mb-4">
              Tentang Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto italic">
              "Membentuk generasi Qur'ani bukan sekadar membekali mereka dengan
              hafalan, tetapi menanamkan nilai, membangun karakter, dan
              mempersiapkan mereka menjadi insan bermanfaat bagi peradaban."
            </p>
          </div>

          <Card className="text-[#80916f] shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#80916f]">
                {yayasan.title}
              </CardTitle>
              <CardDescription className="text-base">
                Didirikan tahun {yayasan.founded}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {yayasan.description}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {yayasan.programs.map((program, index) => (
                  <div
                    key={index}
                    className="p-4 text-[#80916f] rounded-lg border border-green-100"
                  >
                    <h4 className="font-semibold text-[#80916f] mb-2">
                      {program.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {program.description}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {yayasan.subDescription}
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {yayasan.sub1Description}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Visi Misi */}
        <section id="visi-misi" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-8 text-center">
            Visi & Misi
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-yellow-700">Visi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{visiMisi.visi}</p>
              </CardContent>
            </Card>
            <Card className="text-[#80916f] bg-gradient-to-br from-green-50 to-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#80916f]">Misi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {visiMisi.misi.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#80916f] mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section id="struktur" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-8 text-center">
            Struktur Organisasi
          </h2>
          <Card className="text-[#80916f] shadow-lg">
            <CardContent className="p-8">
              <p className="text-center text-gray-600 py-12">
                Struktur organisasi ini dirancang untuk mendukung keberjalanan
                kegiatan pendidikan dan pembinaan santri secara optimal.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Kurikulum */}
        <section id="kurikulum" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-4 text-center">
            Kurikulum Khas Tunas Qur'an
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Bukan sekadar belajar, tapi menumbuhkan pribadi Qur'ani yang siap
            memimpin dan memberi manfaat.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kurikulum.map((item, index) => (
              <Card
                key={index}
                className="border-green-100 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-[#80916f]">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pengajar */}
        <section id="pengajar" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-4 text-center">
            Pengajar
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Di Tunas Qur'an, pengajar bukan sekadar guru — mereka adalah mentor
            hidup.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {pengajar.map((teacher, index) => (
              <Card
                key={index}
                className="border-yellow-100 bg-gradient-to-r from-yellow-50 to-white"
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold text-[#80916f] mb-1">
                    {teacher.name}
                  </h4>
                  <p className="text-sm text-gray-600">{teacher.subject}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Galeri */}
        <section id="galeri" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-12 text-center">
            Galeri
          </h2>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="daily">Daily Act</TabsTrigger>
              <TabsTrigger value="karya">Karyaku</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <div className="grid md:grid-cols-3 gap-6">
                {gallery
                  .filter((img) => img.category === "daily")
                  .map((img, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
                    >
                      <img
                        src={
                          img.url.startsWith("http")
                            ? img.url
                            : `${API_BASE}${img.url}`
                        }
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <p className="text-white p-4 font-semibold">
                          {img.title}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="karya">
              <div className="grid md:grid-cols-3 gap-6">
                {gallery
                  .filter((img) => img.category === "karya")
                  .map((img, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
                    >
                      <img
                        src={
                          img.url.startsWith("http")
                            ? img.url
                            : `${API_BASE}${img.url}`
                        }
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <p className="text-white p-4 font-semibold">
                          {img.title}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Inspirasi */}
        <section id="inspirasi" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-12 text-center">
            Inspirasi
          </h2>
          <Tabs defaultValue="Ruang Pena" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
              {[
                "Ruang Pena",
                "Kisah Inspiratif",
                "Tadabbur",
                "One Day Motivation",
              ].map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            {[
              "Ruang Pena",
              "Kisah Inspiratif",
              "Tadabbur",
              "One Day Motivation",
            ].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 gap-6">
                  {inspirasiList
                    .filter((post) => post.category === category)
                    .map((post, index) => (
                      <Card
                        key={index}
                        className="border-green-100 hover:shadow-xl transition-shadow duration-300"
                      >
                        <CardHeader>
                          <CardTitle className="text-xl text-[#80916f]">
                            {post.title}
                          </CardTitle>
                          <CardDescription>oleh {post.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed">
                            {post.content || post.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Usaha */}
        <section id="usaha" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-4 text-center">
            Tunas Usaha
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Dari koperasi, peternakan, hingga kemitraan tani—semua ini bukan
            sekadar unit usaha.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {usaha.map((item, index) => (
              <Card
                key={index}
                className="text-[#80916f] hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-[#80916f]">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ZISWAF */}
        <section id="ziswaf" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-12 text-center">
            ZISWAF
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-yellow-700">
                  Informasi Rekening
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Bank</p>
                  <p className="text-lg font-semibold text-[#80916f]">
                    {ziswafInfo.bankAccount.bank}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama Rekening</p>
                  <p className="text-lg font-semibold text-[#80916f]">
                    {ziswafInfo.bankAccount.accountName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nomor Rekening</p>
                  <p className="text-2xl font-bold text-[#80916f]">
                    {ziswafInfo.bankAccount.accountNumber}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="text-[#80916f] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#80916f]">
                  Program ZISWAF
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ziswafInfo.programs.map((program, index) => (
                    <div key={index} className="p-3 text-[#80916f] rounded-lg">
                      <h4 className="font-semibold text-[#80916f] mb-1">
                        {program.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {program.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PMB */}
        <section id="pmb" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-4 text-center">
            Penerimaan Mahasantri Baru
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Kami tidak hanya mendidik santri, tapi menyiapkan pemimpin masa
            depan.
          </p>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-[#80916f] mb-6 text-center">
                Jalur Pendaftaran
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {pmbInfo.jalur.map((jalur, index) => (
                  <Card
                    key={index}
                    className="text-[#80916f] hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl text-[#80916f]">
                        {jalur.name}
                      </CardTitle>
                      <CardDescription className="text-2xl font-bold text-yellow-600">
                        {jalur.biaya}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {jalur.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#80916f] mb-6 text-center">
                Program Kelas
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {pmbInfo.kelas.map((kelas, index) => (
                  <Card
                    key={index}
                    className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white shadow-lg"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-yellow-700">
                        {kelas.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {kelas.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="text-center">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeyth4ZAqR0yQHeZlLIava4BpwTCZvf9lb4YPaVVSVKISge3g/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#80916f] hover:bg-[#6f7f60] text-white font-bold px-12 py-6 text-lg">
                  Daftar Sekarang
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Kontak */}
        <section id="kontak" className="scroll-mt-20">
          <h2 className="text-4xl font-bold text-[#80916f] mb-12 text-center">
            Kontak Kami
          </h2>
          <Card className="text-[#80916f] shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-[#80916f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#80916f]">Alamat</p>
                    <p className="text-gray-600">{siteInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-[#80916f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#80916f]">Media Sosial</p>
                    <p className="text-gray-600">
                      Instagram: {siteInfo.instagram}
                    </p>
                    <p className="text-gray-600">TikTok: {siteInfo.tiktok}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 mb-16">
          <h2 className="text-4xl font-bold text-[#80916f] mb-12 text-center">
            FAQ
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border text-[#80916f] rounded-lg px-4 bg-white shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold text-[#80916f] hover:text-[#80916f]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#80916f] hover:bg-[#80916f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Sprout className="h-8 w-8 text-yellow-300" />
                <span className="font-bold text-xl text-yellow-300">
                  Tunas Qur'an
                </span>
              </div>
              <p className="text-green-100 text-sm leading-relaxed">
                {siteInfo.tagline}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-yellow-300">Kontak</h4>
              <div className="space-y-2 text-sm text-green-100">
                <p>Instagram: {siteInfo.instagram}</p>
                <p>TikTok: {siteInfo.tiktok}</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-yellow-300">Alamat</h4>
              <p className="text-sm text-green-100 leading-relaxed">
                {siteInfo.address}
              </p>
            </div>
          </div>
          <div className="border-t border-green-600 mt-8 pt-8 text-center">
            <p className="text-sm text-green-200">
              © 2025 Sekolah Tinggi Tunasqu Bandung. Karena kebaikan mesti
              selalu bertunas 🌱
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
