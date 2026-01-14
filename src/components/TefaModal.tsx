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
     const nameValidation = (value: unknown) => {
          if (!(value as string)?.trim()) return "Nama TEFA wajib diisi";
          return undefined;
     };

     const majorValidation = (value: unknown) => {
          if (!(value as string)?.trim()) return "Jurusan wajib diisi";
          return undefined;
     };

     const fields: FormField<TefaFormData>[] = [
          {
               name: "name",
               label: "Nama TEFA",
               type: "text",
               placeholder: "Contoh: TEFA Otomotif",
               required: true,
               validation: nameValidation,
          },
          {
               name: "major",
               label: "Jurusan",
               type: "text",
               placeholder: "Contoh: Teknik Kendaraan Ringan",
               required: true,
               validation: majorValidation,
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
               submitButtonText={{
                    create: "Tambah TEFA",
                    edit: "Simpan Perubahan",
               }}
          />
     );
}
