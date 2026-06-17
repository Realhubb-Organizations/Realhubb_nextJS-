'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { CheckCircle, AlertCircle, Loader2, Database } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'warning' | 'error' | 'loading';
  message: string;
  details?: Record<string, unknown>;
}

export default function AdminDiagnosticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [testing, setTesting] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (u) => {
        setUser(u);
        setUserLoading(false);
      },
      (err) => {
        setUserError(err);
        setUserLoading(false);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    const runDiagnostics = async () => {
      const newResults: DiagnosticResult[] = [];

      // 1. Check Authentication
      if (userError) {
        newResults.push({
          name: '🔑 Authentication',
          status: 'error',
          message: 'Auth error: ' + userError.message,
        });
      } else if (userLoading) {
        newResults.push({
          name: '🔑 Authentication',
          status: 'loading',
          message: 'Checking authentication...',
        });
      } else if (user) {
        newResults.push({
          name: '🔑 Authentication',
          status: 'success',
          message: `✓ Logged in as ${user.email}`,
          details: { email: user.email, uid: user.uid },
        });
      } else {
        newResults.push({
          name: '🔑 Authentication',
          status: 'warning',
          message: '⚠ Not logged in',
        });
      }

      // 2. Check Firestore Collections
      const collections = ['properties', 'blogPosts', 'developers', 'team', 'gallery', 'leads'];
      
      for (const collName of collections) {
        try {
          const coll = collection(db, collName);
          const snapshot = await getDocs(coll);
          newResults.push({
            name: `📚 ${collName}`,
            status: 'success',
            message: `✓ ${snapshot.size} documents found`,
            details: { documentCount: snapshot.size },
          });
        } catch (error: any) {
          newResults.push({
            name: `📚 ${collName}`,
            status: 'error',
            message: `✗ ${error.message}`,
          });
        }
      }

      // 3. Environment Check
      const envVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
      ];

      const missingEnvs = envVars.filter(
        (v) => typeof window !== 'undefined' && !process.env[`NEXT_PUBLIC_${v.replace('NEXT_PUBLIC_', '')}`]
      );

      if (missingEnvs.length === 0) {
        newResults.push({
          name: '⚙️ Environment Variables',
          status: 'success',
          message: '✓ Required public env vars configured',
        });
      } else {
        newResults.push({
          name: '⚙️ Environment Variables',
          status: 'warning',
          message: `⚠ Missing: ${missingEnvs.join(', ')}`,
        });
      }

      setResults(newResults);
      setTesting(false);
    };

    runDiagnostics();
  }, [user, userLoading, userError]);

  const getIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Admin Diagnostics</h1>
            </div>
            <p className="text-muted-foreground">Check Firestore connectivity and configuration</p>
          </div>

          {/* Results */}
          {testing ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Running diagnostics...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.name}
                  className={`p-4 border rounded-lg ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                      : result.status === 'error'
                      ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                      : result.status === 'warning'
                      ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
                      : 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(result.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{result.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                      {result.details && (
                        <pre className="text-xs mt-2 p-2 bg-black/10 rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Guidance */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              What to check if data isn't showing:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Ensure you're logged in (check Authentication section above)</li>
              <li>Verify Firebase Admin credentials are set in `.env.local`</li>
              <li>Restart dev server after adding environment variables</li>
              <li>Check that collections exist in Firestore Console</li>
              <li>Verify Firestore security rules allow your user to read data</li>
              <li>Add test data in admin panel first, then refresh</li>
            </ul>
          </div>

          {/* Debug Info */}
          <div className="bg-muted p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-sm mb-2">Debug Information</h3>
            <pre className="text-xs overflow-auto max-h-32">
              {JSON.stringify(
                {
                  timestamp: new Date().toISOString(),
                  resultsCount: results.length,
                  authStatus: user ? 'authenticated' : 'not-authenticated',
                  collectionTests: results.filter((r) => r.name.includes('📚')).length,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
