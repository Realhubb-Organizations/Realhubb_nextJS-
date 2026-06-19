'use client';

import { useProperties } from '@/admin/hooks';
import { Building2, AlertCircle, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ClientPropertiesPage() {
  const { properties, loading, error } = useProperties();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Live Properties from Firestore</h1>
          </div>
          <p className="text-muted-foreground">
            This page fetches properties directly from your Firestore database in real-time
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading properties from Firestore...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-normal text-sm">Error Loading Properties</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-20 border border-dashed rounded-lg">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-lg font-normal mb-2">No Properties Found</h2>
            <p className="text-muted-foreground mb-6">
              No properties in Firestore yet. Add some from the admin panel!
            </p>
            <Link
              href="/admin/dashboard"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Go to Admin Panel
            </Link>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <>
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✓ Successfully loaded <strong>{properties.length}</strong> properties from Firestore
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  {property.images && property.images[0] && (
                    <div className="w-full h-48 bg-muted relative overflow-hidden">
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-normal text-lg">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-normal">{property.price}</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-normal capitalize">{property.type}</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground">Area</p>
                        <p className="font-normal">{property.area}</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-normal capitalize">{property.status}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/property/${property.slug}`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                      <button
                        onClick={() => {
                          const json = JSON.stringify(property, null, 2);
                          console.log('Property Data:', json);
                          alert('Check console for full property data');
                        }}
                        className="flex-1 px-3 py-2 border border-input rounded hover:bg-muted text-sm"
                      >
                        Debug
                      </button>
                    </div>

                    {/* Debug Info */}
                    <details className="text-xs text-muted-foreground cursor-pointer">
                      <summary className="font-normal hover:text-foreground">Raw Data</summary>
                      <pre className="mt-2 p-2 bg-muted rounded overflow-auto max-h-32">
                        {JSON.stringify(property, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* How It Works */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
          <h2 className="font-normal">How to Use</h2>
          <ol className="text-sm space-y-2 ml-4 list-decimal text-muted-foreground">
            <li>Add properties in the <Link href="/admin/dashboard" className="underline text-primary">Admin Dashboard</Link></li>
            <li>Fill in all required fields (name, location, price, images)</li>
            <li>Click "Save" to store in Firestore</li>
            <li>Return to this page - properties should load automatically</li>
            <li>Click "View" to see the property detail page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
