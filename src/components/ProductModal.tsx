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
     stock: number;
     imageUrl: string;
     [key: string]: string | number | undefined;
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
               name: "stock",
               label: "Stok",
               type: "number",
               placeholder: "Contoh: 100",
               required: true,
               min: 0,
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
               type: "url",
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