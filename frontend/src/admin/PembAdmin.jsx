import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function PEMBAdmin() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manajemen PMB</h1>

      <Card className="max-w-xl">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Link Google Form</label>
            <input
              type="text"
              placeholder="https://forms.gle/..."
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <Button className="bg-[#80916f] hover:bg-[#6f7f60]">
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
