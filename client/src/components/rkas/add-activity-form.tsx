import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const activitySchema = z.object({
  standardId: z.string().min(1, "Standard wajib dipilih"),
  kodeGiat: z.string().min(1, "Kode kegiatan wajib diisi"),
  namaGiat: z.string().min(1, "Nama kegiatan wajib diisi"),
  subtitle: z.string().optional(),
  kodeDana: z.string().min(1, "Kode dana wajib diisi"),
  namaDana: z.string().min(1, "Nama dana wajib diisi"),
  tw1: z.string().min(1, "TW1 wajib diisi"),
  tw2: z.string().min(1, "TW2 wajib diisi"),
  tw3: z.string().min(1, "TW3 wajib diisi"),
  tw4: z.string().min(1, "TW4 wajib diisi"),
});

type ActivityForm = z.infer<typeof activitySchema>;

interface AddActivityFormProps {
  onSuccess: () => void;
}

export default function AddActivityForm({ onSuccess }: AddActivityFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      standardId: "",
      kodeGiat: "",
      namaGiat: "",
      subtitle: "",
      kodeDana: "",
      namaDana: "",
      tw1: "0",
      tw2: "0",
      tw3: "0",
      tw4: "0",
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: ActivityForm) => {
      const response = await apiRequest('POST', '/api/rkas/activities', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rkas/activities'] });
      toast({
        title: "Berhasil",
        description: "Kegiatan berhasil ditambahkan",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menambahkan kegiatan",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ActivityForm) => {
    createActivityMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="standardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Standard</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih standard" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard-1">Pengembangan Standar Isi</SelectItem>
                    <SelectItem value="standard-2">Pengembangan Standar Proses</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kodeGiat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Kegiatan</FormLabel>
                <FormControl>
                  <Input placeholder="01.3.02.01.2.001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="namaGiat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kegiatan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama kegiatan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea placeholder="Masukkan keterangan kegiatan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="kodeDana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Dana</FormLabel>
                <FormControl>
                  <Input placeholder="3.02.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="namaDana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Dana</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sumber dana" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BOP Reguler">BOP Reguler</SelectItem>
                    <SelectItem value="BOS Reguler">BOS Reguler</SelectItem>
                    <SelectItem value="DAK Fisik">DAK Fisik</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="tw1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TW 1</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tw2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TW 2</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tw3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TW 3</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tw4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TW 4</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Batal
          </Button>
          <Button 
            type="submit" 
            className="bg-erkas-success text-white hover:bg-green-600"
            disabled={createActivityMutation.isPending}
          >
            {createActivityMutation.isPending ? (
              <div className="erkas-loading mr-2" />
            ) : null}
            Simpan
          </Button>
        </div>
      </form>
    </Form>
  );
}
