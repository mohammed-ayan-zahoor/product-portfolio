import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    const token = request.cookies.get('token')?.value;
    if (!token || !verifyToken(token)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'products' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary error:', error);
                        return resolve(NextResponse.json({ message: 'Upload failed' }, { status: 500 }));
                    }
                    return resolve(NextResponse.json({ url: result.secure_url }));
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
