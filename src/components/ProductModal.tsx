import { FC } from "react";
import FormModal, { FormField } from "./ui/FormModal";

interface ProductModalProps {
     isOpen: boolean;
     onClose: () => void;
     onSubmit: (data: ProductFormData) => Promise<void>;
     initialData?: ProductFormData | null;
     mode: "create" | "edit";
}

export interface ProductFormData {
     id?: string;
     name: string;
     description: string;
     price: number;
     isAvailable: string;
     imageUrl?: File | string | null;
     saleType: string;
     [key: string]: string | number | File | null | boolean | undefined;
}

const ProductModal: FC<ProductModalProps> = ({
     isOpen,
     onClose,
     onSubmit,
     initialData,
     mode,
}) => {
     const nameValidation = (value: unknown) => {
          if (!(value as string)?.trim()) return "Nama product wajib diisi";
          return undefined;
     };

     const fields: FormField<ProductFormData>[] = [
          {
               name: "name",
               label: "Nama Product",
               type: "text",
               placeholder: "Contoh: Kursi Sekolah",
               required: true,
               validation: nameValidation,
          },
          {
               name: "price",
               label: "Harga",
               type: "number",
               placeholder: "Contoh: 150000",
               required: true,
               min: 1,
          },
          {
               name: "isAvailable",
               label: "Ketersediaan",
               type: "select",
               required: true,
               options: [
                    {
                         label: "Tersedia",
                         value: "Tersedia"
                    }, 
                    {
                         label: "Tidak Tersedia",
                         value: "Tidak Tersedia"
                    }
               ]
          },
          {
               name: "saleType",
               label: "Jenis Penjualan",
               type: "select",
               required: true,
               options: [
                    {
                         label: "Massal",
                         value: "direct"
                    },
                    {
                         label: "Lelang",
                         value: "auction"
                    }
               ]
          },
          {
               name: "description",
               label: "Deskripsi",
               type: "textarea",
               placeholder: "Deskripsi tentang product ini (opsional)",
               rows: 4,
          },
          {
               name: "imageUrl",
               label: "URL Gambar",
               type: "file",
               accept: "image/*",
               placeholder: "https://example.com/image.jpg",
          },
     ];

     return (
          <FormModal<ProductFormData>
               isOpen={isOpen}
               onClose={onClose}
               onSubmit={onSubmit}
               initialData={initialData}
               mode={mode}
               title={{
                    create: "Tambah Product Baru",
                    edit: "Edit Product",
               }}
               fields={fields}
               submitButtonText={{
                    create: "Tambah Product",
                    edit: "Simpan Perubahan",
               }}
          />
     );
};

export default ProductModal;