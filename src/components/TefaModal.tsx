"use client";

import FormModal, { FormField } from "./ui/FormModal";

interface TefaModalProps {
     isOpen: boolean;
     onClose: () => void;
     onSubmit: (data: TefaFormData) => Promise<void>;
     initialData?: TefaFormData | null;
     mode: "create" | "edit";
}

export interface TefaFormData {
     id?: string;
     name: string;
     major: string;
     description: string;
     [key: string]: string | undefined;
}

export default function TefaModal({
     isOpen,
     onClose,
     onSubmit,
     initialData,
     mode,
}: TefaModalProps) {
     const fields: FormField<TefaFormData>[] = [
          {
               name: "name",
               label: "Nama TEFA",
               type: "text",
               placeholder: "Contoh: TEFA Otomotif",
               required: true,
               validation: (value) => {
                    if (!(value as string)?.trim()) return "Nama TEFA wajib diisi";
               },
          },
          {
               name: "major",
               label: "Jurusan",
               type: "text",
               placeholder: "Contoh: Teknik Kendaraan Ringan",
               required: true,
               validation: (value) => {
                    if (!(value as string)?.trim()) return "Jurusan wajib diisi";
               },
          },
          {
               name: "description",
               label: "Deskripsi",
               type: "textarea",
               placeholder: "Deskripsi tentang TEFA ini (opsional)",
               rows: 4,
          },
     ];

     return (
          <FormModal<TefaFormData>
               isOpen={isOpen}
               onClose={onClose}
               onSubmit={onSubmit}
               initialData={initialData}
               mode={mode}
               title={{
                    create: "Tambah TEFA Baru",
                    edit: "Edit TEFA",
               }}
               fields={fields}
               size="md"
               submitButtonText={{
                    create: "Tambah TEFA",
                    edit: "Simpan Perubahan",
               }}
          />
     );
}
