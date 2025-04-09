import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export async function uploadImage(file: string, folder: string) {
    return await cloudinary.uploader.upload(file, {
        folder: `covers/${folder}`,
        resource_type: 'image'
    });
}

export async function deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
}

export async function getImages(folder: string) {
    const { resources } = await cloudinary.search
        .expression(`folder:covers/${folder}`)
        .execute();
    return resources;
}

