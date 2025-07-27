import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Loader2 } from "lucide-react";
import type { Quarter, Month } from "@/components/dashboard/period-selector";

const kegiatanSchema = z.object({
  name: z.string().min(5, "Nama kegiatan minimal 5 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  bidang: z.string().min(1, "Pilih bidang kegiatan"),
  standard: z.string().min(1, "Pilih standar nasional"),
  budget: z.number().min(1000000, "Anggaran minimal Rp 1.000.000"),
  responsible: z.string().min(3, "Nama penanggung jawab minimal 3 karakter"),
  quarter: z.string().optional(),
  month: z.string().optional(),
  year: z.number().min(2022).max(2030),
});

type KegiatanFormData = z.infer<typeof kegiatanSchema>;

interface KegiatanFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<KegiatanFormData & { id: string }>;
  trigger?: React.ReactNode;
  onSubmit: (data: KegiatanFormData) => Promise<void>;
  selectedYear: number;
  selectedQuarter?: Quarter;
  selectedMonth?: Month;
  periodType: 'quarterly' | 'monthly';
}

const bidangOptions = [
  'Kurikulum', 'Kesiswaan', 'Sarana Prasarana', 'Pendidik & Tenaga',
  'Pembiayaan', 'Budaya Sekolah', 'Kemitraan', 'Evaluasi'
];

const standardOptions = [
  'Standar Kompetensi Lulusan', 'Standar Isi', 'Standar Proses', 'Standar Penilaian',
  'Standar Pendidik dan Tenaga Kependidikan', 'Standar Sarana dan Prasarana',
  'Standar Pengelolaan', 'Standar Pembiayaan'
];

export default function KegiatanForm({
  mode,
  initialData,
  trigger,
  onSubmit,
  selectedYear,
  selectedQuarter,
  selectedMonth,
  periodType
}: KegiatanFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<KegiatanFormData>({
    resolver: zodResolver(kegiatanSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      bidang: initialData?.bidang || "",
      standard: initialData?.standard || "",
      budget: initialData?.budget || 0,
      responsible: initialData?.responsible || "",
      quarter: periodType === 'quarterly' ? selectedQuarter : undefined,
      month: periodType === 'monthly' ? selectedMonth?.toString() : undefined,
      year: selectedYear,
    },
  });

  const handleSubmit = async (data: KegiatanFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: mode === 'create' ? "Kegiatan berhasil ditambahkan" : "Kegiatan berhasil diperbarui",
        description: `${data.name} telah ${mode === 'create' ? 'ditambahkan' : 'diperbarui'} ke sistem.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan kegiatan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="flex items-center space-x-2">
      {mode === 'create' ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
      <span>{mode === 'create' ? 'Tambah Kegiatan' : 'Edit Kegiatan'}</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Kegiatan RKAS' : 'Edit Kegiatan RKAS'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nama Kegiatan *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama kegiatan..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Deskripsi Kegiatan *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan deskripsi kegiatan..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bidang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bidang Kegiatan *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bidang..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bidangOptions.map((bidang) => (
                          <SelectItem key={bidang} value={bidang}>
                            {bidang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standar Nasional *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih standar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {standardOptions.map((standard) => (
                          <SelectItem key={standard} value={standard}>
                            {standard}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anggaran (Rp) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5000000" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penanggung Jawab *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama penanggung jawab..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun Anggaran *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="2022" 
                        max="2030"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {periodType === 'quarterly' && (
                <FormField
                  control={form.control}
                  name="quarter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Triwulan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih triwulan..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TW1">Triwulan 1 (Jan-Mar)</SelectItem>
                          <SelectItem value="TW2">Triwulan 2 (Apr-Jun)</SelectItem>
                          <SelectItem value="TW3">Triwulan 3 (Jul-Sep)</SelectItem>
                          <SelectItem value="TW4">Triwulan 4 (Okt-Des)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {periodType === 'monthly' && (
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bulan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih bulan..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                          ].map((month, index) => (
                            <SelectItem key={index + 1} value={(index + 1).toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Tambah Kegiatan' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}