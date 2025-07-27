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

const anggaranSchema = z.object({
  activity: z.string().min(5, "Nama aktivitas minimal 5 karakter"),
  bidang: z.string().min(1, "Pilih bidang kegiatan"),
  standard: z.string().min(1, "Pilih standar nasional"),
  allocatedBudget: z.number().min(1000000, "Anggaran minimal Rp 1.000.000"),
  usedBudget: z.number().min(0, "Anggaran terpakai tidak boleh negatif"),
  responsible: z.string().min(3, "Nama penanggung jawab minimal 3 karakter"),
  quarter: z.string().optional(),
  month: z.string().optional(),
  year: z.number().min(2022).max(2030),
}).refine((data) => data.usedBudget <= data.allocatedBudget, {
  message: "Anggaran terpakai tidak boleh melebihi alokasi",
  path: ["usedBudget"],
});

type AnggaranFormData = z.infer<typeof anggaranSchema>;

interface AnggaranFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<AnggaranFormData & { id: string }>;
  trigger?: React.ReactNode;
  onSubmit: (data: AnggaranFormData) => Promise<void>;
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

export default function AnggaranForm({
  mode,
  initialData,
  trigger,
  onSubmit,
  selectedYear,
  selectedQuarter,
  selectedMonth,
  periodType
}: AnggaranFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AnggaranFormData>({
    resolver: zodResolver(anggaranSchema),
    defaultValues: {
      activity: initialData?.activity || "",
      bidang: initialData?.bidang || "",
      standard: initialData?.standard || "",
      allocatedBudget: initialData?.allocatedBudget || 0,
      usedBudget: initialData?.usedBudget || 0,
      responsible: initialData?.responsible || "",
      quarter: periodType === 'quarterly' ? selectedQuarter : undefined,
      month: periodType === 'monthly' ? selectedMonth?.toString() : undefined,
      year: selectedYear,
    },
  });

  const handleSubmit = async (data: AnggaranFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: mode === 'create' ? "Anggaran berhasil ditambahkan" : "Anggaran berhasil diperbarui",
        description: `${data.activity} telah ${mode === 'create' ? 'ditambahkan' : 'diperbarui'} ke sistem.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan anggaran. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allocatedBudget = form.watch("allocatedBudget");
  const usedBudget = form.watch("usedBudget");
  const remainingBudget = allocatedBudget - usedBudget;
  const utilizationPercentage = allocatedBudget > 0 ? (usedBudget / allocatedBudget) * 100 : 0;

  const defaultTrigger = (
    <Button className="flex items-center space-x-2">
      {mode === 'create' ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
      <span>{mode === 'create' ? 'Tambah Anggaran' : 'Edit Anggaran'}</span>
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
            {mode === 'create' ? 'Tambah Anggaran RKAS' : 'Edit Anggaran RKAS'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nama Aktivitas *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama aktivitas..." {...field} />
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
                name="allocatedBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alokasi Anggaran (Rp) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50000000" 
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
                name="usedBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anggaran Terpakai (Rp) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
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

            {/* Budget Summary */}
            {allocatedBudget > 0 && (
              <div className="bg-slate-50 rounded-lg p-4 border">
                <h4 className="font-medium text-slate-900 mb-3">Ringkasan Anggaran</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Alokasi</p>
                    <p className="font-semibold text-blue-600">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(allocatedBudget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Sisa</p>
                    <p className="font-semibold text-orange-600">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(remainingBudget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Pemanfaatan</p>
                    <p className="font-semibold text-green-600">
                      {utilizationPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                {mode === 'create' ? 'Tambah Anggaran' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}