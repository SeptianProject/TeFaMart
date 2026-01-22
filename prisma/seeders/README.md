# Seeder Documentation - TefaMart

## 📂 Structure

Seeder yang sudah direfactor menjadi modular dengan struktur sebagai berikut:

```
prisma/
├── seed.ts                      # Main orchestrator
├── seeders/
│   ├── campus.seed.ts          # Campus data with image upload
│   ├── users.seed.ts           # Users (Super Admin, Admin, Client, Industri)
│   ├── category.seed.ts        # 6 Categories sesuai requirement
│   ├── tefa.seed.ts            # Teaching Factory units
│   ├── product.seed.ts         # Products with Cloudinary upload
│   └── utils/
│       ├── cloudinary-upload.ts # Helper untuk upload ke Cloudinary
│       └── helpers.ts          # Helper functions (slug, random, etc)
```

## 🎯 Features

### 1. **Modular Structure**

- Setiap entity memiliki file seeder sendiri
- Mudah di-maintain dan di-test
- Clear separation of concerns

### 2. **Cloudinary Integration**

- Otomatis upload images dari `public/assets` ke Cloudinary
- Fallback ke local path jika upload gagal
- Support multiple image formats (jpg, png, gif, webp)

### 3. **Category Mapping**

Sesuai dengan requirement:

- ✅ Elektronik & IOT
- ✅ Digital & Jasa IT
- ✅ Manufaktur
- ✅ Fashion & Tekstil
- ✅ Kreatif & Media
- ✅ Tata Boga & Agribisnis

### 4. **Sale Types**

- ✅ Pre Order (direct purchase)
- ✅ Lelang (auction with automatic auction creation)

### 5. **Campus dengan Image**

- Schema sudah diupdate dengan field `logo`, `image`, dan informasi lengkap
- Politeknik Negeri Banyuwangi sebagai main campus

## 🚀 Usage

### Prerequisites

1. **Environment Variables** - Pastikan sudah ada di `.env`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DATABASE_URL=your_database_url
```

### Run Migration

```bash
# Generate migration untuk perubahan schema Campus
npx prisma migrate dev --name add_campus_image_fields

# Or reset database and run all migrations
npx prisma migrate reset
```

### Run Seeder

```bash
# Run seeder
npm run seed

# Or directly with tsx
npx tsx prisma/seed.ts
```

## 📊 Data Generated

### Campus (3)

- Politeknik Negeri Banyuwangi (Main - with logo)
- Politeknik Negeri Jakarta
- Politeknik Negeri Bandung

### Users (6)

- **Super Admin**: `superadmin@tefamart.com` / `password123`
- **Admin Poliwangi**: `admin@poliwangi.ac.id` / `password123`
- **Admin PNJ**: `admin@pnj.ac.id` / `password123`
- **Admin Polban**: `admin@polban.ac.id` / `password123`
- **Client**: `client@example.com` / `password123`
- **Industri (Pending)**: `industri@example.com` / `password123`

### Categories (6)

Sesuai dengan folder di `public/assets`

### TEFA Units (8)

Multiple teaching factory units across different campuses

### Products (16)

- 2 produk Elektronik & IOT
- 3 produk Digital & Jasa IT
- 4 produk Manufaktur
- 2 produk Fashion & Tekstil
- 2 produk Kreatif & Media
- 2 produk Tata Boga & Agribisnis
- Mix antara Pre Order dan Lelang

### Auctions

- Otomatis dibuat untuk produk dengan saleType "Lelang"
- Start price: 70% dari harga produk
- Duration: 7 hari dari sekarang
- Status: active

## 🔧 Customization

### Menambah Product Baru

Edit file `prisma/seeders/product.seed.ts`:

```typescript
const productsData: ProductData[] = [
  // ... existing products
  {
    name: "Product Baru",
    description: "Deskripsi produk",
    price: 1000000,
    categoryId: "cat-elektronik-iot",
    tefaId: tefaIds.tefa1.id,
    saleType: "Pre Order", // or "Lelang"
    imagePath: "public/assets/elektronik-dan-iot/new-image.png",
  },
];
```

### Menambah Campus Baru

Edit file `prisma/seeders/campus.seed.ts`:

```typescript
const campus4 = await prisma.campus.upsert({
  where: { id: "campus-new" },
  update: {},
  create: {
    id: "campus-new",
    name: "Nama Campus",
    logo: logoUrl,
    // ... other fields
  },
});
```

### Mengubah Category

Edit file `prisma/seeders/category.seed.ts` sesuai kebutuhan.

## 📝 Notes

1. **Image Upload**:
   - Images di-upload ke Cloudinary folder `tefamart/products`
   - Logo campus ke `tefamart/campus/logo`
   - Jika gagal, fallback ke local path

2. **Performance**:
   - Upload dilakukan sequential untuk stability
   - Bisa dioptimasi dengan batch upload jika perlu

3. **Error Handling**:
   - Setiap seeder memiliki try-catch
   - Gagal upload image tidak akan stop seeding
   - Log yang informatif untuk debugging

4. **Idempotent**:
   - Menggunakan `upsert` untuk semua data
   - Aman untuk dijalankan multiple times
   - Data existing akan di-update, bukan duplicate

## 🎨 Best Practices Applied

✅ **Separation of Concerns** - Setiap file fokus pada satu entity
✅ **DRY Principle** - Helper functions untuk code reusability
✅ **Error Handling** - Proper try-catch dan error logging
✅ **Type Safety** - TypeScript interfaces untuk data structure
✅ **Idempotency** - Safe untuk multiple runs
✅ **Clear Naming** - Function dan variable names yang descriptive
✅ **Documentation** - Inline comments dan README
✅ **Environment Config** - Cloudinary config dari environment variables

## 🐛 Troubleshooting

### Error: Cloudinary credentials not found

```bash
# Pastikan .env sudah configured
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Error: Image file not found

```bash
# Check apakah image ada di folder public/assets
# Path harus relative dari root project
```

### Error: Database connection

```bash
# Check DATABASE_URL di .env
# Pastikan database running
```

## 📚 References

- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
