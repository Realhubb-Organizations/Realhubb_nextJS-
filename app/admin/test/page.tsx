"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { CLOUDINARY_CONFIG } from "@/lib/cloudinary";
import ImageUpload from "@/admin/components/ImageUpload";
import { UploadResult } from "@/lib/uploadToCloudinary";
import Link from "next/link";

export default function CloudinaryTest() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      setChecking(false);
    });
    return unsub;
  }, [router]);

  const cloudNameSet = !!CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.cloudName !== "undefined" && CLOUDINARY_CONFIG.cloudName !== "";
  const presetSet = !!CLOUDINARY_CONFIG.uploadPreset && CLOUDINARY_CONFIG.uploadPreset !== "undefined" && CLOUDINARY_CONFIG.uploadPreset !== "";
  const configValid = cloudNameSet && presetSet;

  if (checking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-navy hover:text-gold transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Authenticated</span>
        </div>

        <div>
          <h1 className="font-heading text-2xl text-navy font-normal">Cloudinary Connection Test</h1>
          <p className="text-sm text-navy/70 mt-1">
            Verify your .env.local Cloudinary parameters and test live image uploads
          </p>
        </div>

        {/* Config status */}
        <div className="bg-white rounded-2xl border border-navy/10 p-6 space-y-4 shadow-sm">
          <p className="text-sm font-normal text-navy">Environment Variables</p>

          <div className="space-y-3">
            <ConfigRow
              label="NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
              value={CLOUDINARY_CONFIG.cloudName}
              ok={cloudNameSet}
            />
            <ConfigRow
              label="NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
              value={CLOUDINARY_CONFIG.uploadPreset}
              ok={presetSet}
            />
          </div>

          {!configValid && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-normal text-amber-900">Setup Incomplete</p>
                <p className="mt-1 text-amber-800 leading-relaxed">
                  Create a <code className="bg-amber-100/80 px-1.5 py-0.5 rounded text-amber-900 font-mono text-[11px]">.env.local</code> file in your
                  project root and add the Cloudinary variables. Then restart the dev server.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload test */}
        {configValid && (
          <div className="bg-white rounded-2xl border border-navy/10 p-6 space-y-4 shadow-sm">
            <p className="text-sm font-normal text-navy">Test Live Upload</p>
            <ImageUpload
              folder="properties"
              label="Test image (properties folder)"
              hint="Upload any test image to confirm Cloudinary connection"
              onUploadComplete={(result) => setUploadResult(result)}
            />

            {uploadResult && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <p className="flex items-center gap-2 text-sm font-normal text-emerald-800">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  Upload successful!
                </p>
                <div className="space-y-1 text-xs text-emerald-700 font-mono">
                  <p className="break-all">
                    <span className="font-normal">URL: </span>
                    <a
                      href={uploadResult.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-emerald-950"
                    >
                      {uploadResult.url}
                    </a>
                  </p>
                  <p>
                    <span className="font-normal">Public ID: </span>
                    <span className="bg-emerald-100/50 px-1 rounded">{uploadResult.publicId}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-[11px] text-navy/40">
          Once setup is verified, you can return to the dashboard.
        </p>
      </div>
    </div>
  );
}

interface ConfigRowProps {
  label: string;
  value: string;
  ok: boolean;
}

function ConfigRow({ label, value, ok }: ConfigRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-navy/5 last:border-0">
      <code className="text-[11px] text-navy/60 font-mono break-all sm:break-normal">{label}</code>
      <div className="flex items-center gap-2 shrink-0">
        {ok ? (
          <>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">{value}</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-700 font-medium">Not configured</span>
          </>
        )}
      </div>
    </div>
  );
}
