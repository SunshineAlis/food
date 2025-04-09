// app/api/covers/route.ts
import { NextResponse } from 'next/server';
import {
    uploadImage,
    deleteImage,
    getImages
} from '@/app/lib/cloudinary/server';

const DEFAULT_FOLDER = 'covers/default';

export async function GET() {
    try {
        const images = await getImages(DEFAULT_FOLDER);
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    try {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        const result = await uploadImage(dataUri, folder);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const { publicId } = await request.json();

    try {
        const result = await deleteImage(publicId);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}