import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Plus, Trash2, GripVertical, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface TableColumn {
  id: string;
  key: string;
  label: string;
  visible: boolean;
  width?: number;
  type: 'text' | 'number' | 'currency' | 'date' | 'status' | 'badge';
  sortable?: boolean;
  required?: boolean;
}

interface ColumnManagerProps {
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
  onAddColumn?: (column: Omit<TableColumn, 'id'>) => void;
}

const defaultColumnTypes = [
  { value: 'text', label: 'Teks' },
  { value: 'number', label: 'Angka' },
  { value: 'currency', label: 'Mata Uang' },
  { value: 'date', label: 'Tanggal' },
  { value: 'status', label: 'Status' },
  { value: 'badge', label: 'Badge' }
];

export default function ColumnManager({ columns, onColumnsChange, onAddColumn }: ColumnManagerProps) {
  const [open, setOpen] = useState(false);
  const [newColumn, setNewColumn] = useState({
    key: '',
    label: '',
    type: 'text' as const,
    visible: true,
    sortable: true,
    required: false
  });

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  const handleColumnDelete = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column?.required) {
      toast({
        title: "Tidak Dapat Dihapus",
        description: "Kolom ini wajib dan tidak dapat dihapus",
        variant: "destructive"
      });
      return;
    }
    
    const updatedColumns = columns.filter(col => col.id !== columnId);
    onColumnsChange(updatedColumns);
    toast({
      title: "Kolom Dihapus",
      description: `Kolom "${column?.label}" berhasil dihapus`
    });
  };

  const handleAddColumn = () => {
    if (!newColumn.key || !newColumn.label) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Harap isi nama kolom dan label",
        variant: "destructive"
      });
      return;
    }

    const column: Omit<TableColumn, 'id'> = {
      key: newColumn.key,
      label: newColumn.label,
      type: newColumn.type,
      visible: newColumn.visible,
      sortable: newColumn.sortable,
      required: newColumn.required
    };

    onAddColumn?.(column);
    setNewColumn({
      key: '',
      label: '',
      type: 'text',
      visible: true,
      sortable: true,
      required: false
    });
    
    toast({
      title: "Kolom Ditambahkan",
      description: `Kolom "${column.label}" berhasil ditambahkan`
    });
  };

  const visibleColumns = columns.filter(col => col.visible);
  const hiddenColumns = columns.filter(col => !col.visible);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Kelola Kolom</span>
          <Badge variant="secondary">{visibleColumns.length}/{columns.length}</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pengaturan Kolom Tabel RKAS</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visible Columns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Kolom Tampil ({visibleColumns.length})</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Aktif
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleColumns.map((column) => (
                <div key={column.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50/30">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <Checkbox
                      checked={column.visible}
                      onCheckedChange={(checked) => 
                        handleColumnVisibilityChange(column.id, checked as boolean)
                      }
                    />
                    <div>
                      <div className="font-medium text-sm">{column.label}</div>
                      <div className="text-xs text-gray-500">{column.key} • {column.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {column.required && (
                      <Badge variant="secondary" className="text-xs">Wajib</Badge>
                    )}
                    {!column.required && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleColumnDelete(column.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {visibleColumns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Tidak ada kolom yang ditampilkan</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hidden Columns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Kolom Tersembunyi ({hiddenColumns.length})</span>
                <Badge variant="outline" className="bg-gray-50 text-gray-700">
                  Nonaktif
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hiddenColumns.map((column) => (
                <div key={column.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/30">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={column.visible}
                      onCheckedChange={(checked) => 
                        handleColumnVisibilityChange(column.id, checked as boolean)
                      }
                    />
                    <div>
                      <div className="font-medium text-sm text-gray-600">{column.label}</div>
                      <div className="text-xs text-gray-400">{column.key} • {column.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {column.required && (
                      <Badge variant="secondary" className="text-xs">Wajib</Badge>
                    )}
                    {!column.required && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleColumnDelete(column.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {hiddenColumns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Semua kolom sedang ditampilkan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add New Column */}
        {onAddColumn && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Tambah Kolom Baru</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="column-key" className="text-xs">Nama Kolom*</Label>
                  <Input
                    id="column-key"
                    value={newColumn.key}
                    onChange={(e) => setNewColumn(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="contoh: totalAnggaran"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="column-label" className="text-xs">Label*</Label>
                  <Input
                    id="column-label"
                    value={newColumn.label}
                    onChange={(e) => setNewColumn(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="contoh: Total Anggaran"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="column-type" className="text-xs">Tipe</Label>
                  <select
                    id="column-type"
                    value={newColumn.type}
                    onChange={(e) => setNewColumn(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {defaultColumnTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleAddColumn}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4">
                <label className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={newColumn.visible}
                    onCheckedChange={(checked) => 
                      setNewColumn(prev => ({ ...prev, visible: checked as boolean }))
                    }
                  />
                  <span>Tampilkan langsung</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={newColumn.sortable}
                    onCheckedChange={(checked) => 
                      setNewColumn(prev => ({ ...prev, sortable: checked as boolean }))
                    }
                  />
                  <span>Dapat diurutkan</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={newColumn.required}
                    onCheckedChange={(checked) => 
                      setNewColumn(prev => ({ ...prev, required: checked as boolean }))
                    }
                  />
                  <span>Kolom wajib</span>
                </label>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper function to render table cell based on column type
export function renderTableCell(value: any, column: TableColumn) {
  if (value === null || value === undefined) return '-';

  switch (column.type) {
    case 'currency':
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(Number(value) || 0);

    case 'number':
      return new Intl.NumberFormat('id-ID').format(Number(value) || 0);

    case 'date':
      return new Date(value).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

    case 'status':
      const statusColors = {
        draft: 'bg-gray-100 text-gray-800 border-gray-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200'
      };
      const statusLabels = {
        draft: 'Draft',
        pending: 'Menunggu',
        approved: 'Disetujui',
        rejected: 'Ditolak'
      };
      return (
        <Badge className={statusColors[value] || statusColors.draft}>
          {statusLabels[value] || value}
        </Badge>
      );

    case 'badge':
      return <Badge variant="secondary">{value}</Badge>;

    default:
      return value?.toString() || '-';
  }
}