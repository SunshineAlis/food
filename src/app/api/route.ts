// import { NextResponse } from 'next/server';
// import { uploadImage, deleteImage, getImages } from '@/app/lib/cloudinary';

// // Default folder for cover images
// const DEFAULT_FOLDER = 'covers/default';

// export async function GET() {
//     try {
//         const images = await getImages(DEFAULT_FOLDER);
//         return NextResponse.json(images);
//     } catch (error) {
//         return NextResponse.json(
//             { error: 'Failed to fetch images' },
//             { status: 500 }
//         );
//     }
// }

// export async function POST(request: Request) {
//     const { image } = await request.json();

//     try {
//         const result = await uploadImage(image, DEFAULT_FOLDER);
//         return NextResponse.json(result);
//     } catch (error) {
//         return NextResponse.json(
//             { error: 'Failed to upload image' },
//             { status: 500 }
//         );
//     }
// }

// export async function DELETE(request: Request) {
//     const { publicId } = await request.json();

//     try {
//         const result = await deleteImage(publicId);
//         return NextResponse.json(result);
//     } catch (error) {
//         return NextResponse.json(
//             { error: 'Failed to delete image' },
//             { status: 500 }
//         );
//     }
// }